import Image from 'next/image'
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { GithubFile } from "@/lib/github"
import { convertBytesToSize } from '@/lib/utils'
import { deleteFile } from "@/lib/github"
import { toast } from "@/hooks/use-toast"
import useImageStore from "@/stores/image"
import { RepoNames } from "@/lib/github.types"
import { PhotoProvider, PhotoView } from 'react-photo-view';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger } from "@/components/ui/context-menu"
import useSettingStore from '@/stores/setting'
import { useState } from 'react'
import { LoaderCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function ImageCard({file}: {file: GithubFile}) {
  const [loading, setLoading] = useState(false)
  const { deleteImage } = useImageStore()
  const { githubUsername } = useSettingStore()

  async function handleDelete(file: GithubFile) {
    setLoading(true)
    const res = await deleteFile({path: file.path, sha: file.sha, repo: RepoNames.image})
    if (res) {
      toast({ title: '文件已删除', description: file.name })
      deleteImage(file.name)
    } else {
      toast({ title: '文件删除失败' })
    }
    setLoading(false)
  }

  async function handleCopyLink() {
    const fileLink = `https://cdn.jsdelivr.net/gh/${githubUsername}/${RepoNames.image}@main/${file.name}`
    navigator.clipboard.writeText(fileLink)
    toast({ title: '已复制 URL 到剪切板', description: fileLink })
  }

  async function handleCopyMarkdown() {
    const fileLink = `![${file.name}](https://cdn.jsdelivr.net/gh/${githubUsername}/${RepoNames.image}@main/${file.name})`
    navigator.clipboard.writeText(fileLink)
    toast({ title: '已复制 Markdown 到剪切板', description: fileLink })
  }

  async function handleCopyHTML() {
    const fileLink = `<img src="https://cdn.jsdelivr.net/gh/${githubUsername}/${RepoNames.image}@main/${file.name}" />`
    navigator.clipboard.writeText(fileLink)
    toast({ title: '已复制 HTML 到剪切板', description: fileLink })
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Card className={`w-full h-36 overflow-hidden p-0 rounded-lg shadow-none relative group cursor-pointer hover:outline outline-0.5`}>
          <CardContent className="p-0 h-full">
            {
              file.isNew && <Badge className='absolute top-2 right-2'>最近上传</Badge>
            }
            <PhotoProvider>
              <PhotoView src={file.download_url}>
                {
                  loading ? 
                  <div className='absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center text-white'>
                    <LoaderCircle className='animate-spin size-6' />
                  </div> :
                  <Image src={file.download_url} alt={file.name} width={0} height={0} className="w-full h-full object-cover" />
                }
              </PhotoView>
            </PhotoProvider>
          </CardContent>
        </Card>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuSub>
          <ContextMenuSubTrigger inset>详细信息</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem className='flex justify-between gap-4'>
              <span className='w-20'>文件名称</span>
              <span className='text-zinc-500'>{file.name}</span>
            </ContextMenuItem>
            <ContextMenuItem className='flex justify-between gap-4'>
              <span className='w-20'>文件大小</span>
              <span className='text-zinc-500'>{convertBytesToSize(file.size)}</span>
            </ContextMenuItem>
            <ContextMenuItem className='flex justify-between gap-4'>
              <span className='w-20'>SHA</span>
              <span className='text-zinc-500'>{file.sha}</span>
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuItem inset onClick={() => handleCopyLink()}>
          复制链接
        </ContextMenuItem>
        <ContextMenuItem inset onClick={() => handleCopyMarkdown()}>
          复制 Markdown
        </ContextMenuItem>
        <ContextMenuItem inset onClick={() => handleCopyHTML()}>
          复制 HTML
        </ContextMenuItem>
        <ContextMenuItem inset onClick={() => handleDelete(file)}>
          <span className="text-red-900">删除</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}