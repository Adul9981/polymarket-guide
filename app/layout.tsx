import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Polymarket 新人导航 | 预测市场一站式入口',
  description: '精选加密货币涨跌、天气、马斯克推文、英雄联盟赛事、伊朗局势五大板块，帮你快速上手 Polymarket 预测市场',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full bg-[#0d0e12]">{children}</body>
    </html>
  )
}
