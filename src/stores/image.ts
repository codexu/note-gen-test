import { getFiles, GithubFile } from '@/lib/github';
import { RepoNames } from '@/lib/github.types';
import { create } from 'zustand'

interface MarkState {
  path: string
  setPath: (path: string) => void

  images: GithubFile[]
  pushImage: (image: GithubFile) => void
  deleteImage: (name: string) => void
  getImages: () => Promise<void>
}

const useImageStore = create<MarkState>((set, get) => ({
  path: '',
  setPath: (path) => set({ path }),

  images: [],

  pushImage: (image) => {
    set(state => ({
      images: [image, ...state.images]
    }))
  },
  deleteImage: (name) => {
    set(state => ({
      images: state.images.filter(item => item.name !== name)
    }))
  },
  async getImages() {
    set({ images: [] })
    const images = await getFiles({ path: get().path, repo: RepoNames.image })
    set({ images: images || [] })
  },
}))

export default useImageStore