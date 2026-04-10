'use client'

import { useEffect, useRef, useState } from 'react'
import { CATEGORIES } from '@/data/polymarket-categories'

export default function CategoryNav() {
  const [activeId, setActiveId] = useState<string>(CATEGORIES[0].id)
  const navRef = useRef<HTMLDivElement>(null)

  // Intersection Observer：监听各板块进入视口，更新高亮
  useEffect(() => {
    const observers: IntersectionObserver[] = []

    CATEGORIES.forEach((cat) => {
      const el = document.getElementById(cat.id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(cat.id)
        },
        { threshold: 0.15, rootMargin: '-80px 0px -40% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // 点击后让 tab 按钮滚进导航栏可视区域
  function scrollNavToActive(id: string) {
    const btn = navRef.current?.querySelector(`[data-id="${id}"]`) as HTMLElement
    btn?.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' })
  }

  function handleClick(id: string) {
    setActiveId(id)
    scrollNavToActive(id)
    const el = document.getElementById(id)
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY - 72
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <nav className="sticky top-0 z-20 bg-[#0d0e12]/95 backdrop-blur border-b border-[#2d2f36] -mx-4 px-4 mb-10">
      <div
        ref={navRef}
        className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-hide"
      >
        {CATEGORIES.map((cat) => {
          const isActive = activeId === cat.id
          return (
            <button
              key={cat.id}
              data-id={cat.id}
              onClick={() => handleClick(cat.id)}
              className={[
                'shrink-0 inline-flex items-center gap-1.5 text-sm px-3.5 py-1.5 rounded-lg',
                'transition-all duration-200 whitespace-nowrap cursor-pointer border',
                isActive
                  ? 'bg-[#00e8a2]/10 text-[#00e8a2] border-[#00e8a2]/30 font-semibold'
                  : 'text-slate-400 hover:text-white hover:bg-[#1a1b1e] border-transparent',
              ].join(' ')}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
