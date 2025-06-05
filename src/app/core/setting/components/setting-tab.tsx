"use client";

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation";
import baseConfig from '../config'
import { useTranslations } from 'next-intl'
import useSettingStore from "@/stores/setting"

export function SettingTab() {
  const [currentPage, setCurrentPage] = useState('about')
  const router = useRouter()
  const pathname = usePathname()
  const t = useTranslations('settings')
  const { setLastSettingPage } = useSettingStore()
  
  // Add translations to the config
  const config = baseConfig.map(item => ({
    ...item,
    title: t(`${item.anchor}.title`)
  }))

  function handleNavigation(anchor: string) {
    setCurrentPage(anchor)
    router.push(`/core/setting/${anchor}`)
    // 记录最后访问的设置页面
    setLastSettingPage(anchor)
  }

  useEffect(() => {
    // 从当前URL路径中提取当前页面
    const pageName = pathname.split('/').pop()
    if (pageName && pageName !== 'setting') {
      setCurrentPage(pageName)
      // 记录最后访问的设置页面
      setLastSettingPage(pageName)
    }
  }, [pathname, setLastSettingPage])

  return (
    <div className="w-56 border-r h-full min-h-screen bg-sidebar p-4">
      <ul>
        {
          config.map(item => {
            return (
              <li
                key={item.anchor}
                className={currentPage === item.anchor ? '!bg-zinc-800 text-white setting-anchor' : 'setting-anchor'}
                onClick={() => handleNavigation(item.anchor)}
              >
                {item.icon}
                <span>{item.title}</span>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}