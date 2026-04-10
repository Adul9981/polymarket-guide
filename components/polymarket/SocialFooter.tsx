export default function SocialFooter() {
  const links = [
    {
      label: '推特',
      sublabel: '@rich_adul',
      href: 'https://x.com/rich_adul',
      color: '#1d9bf0',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      label: 'YouTube',
      sublabel: '@coveym',
      href: 'https://www.youtube.com/@coveym/',
      color: '#ff0000',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      label: 'TG 交流群',
      sublabel: '反馈问题 · 持续交流',
      href: 'https://t.me/polymarket_toolsad/',
      color: '#0088cc',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
    {
      label: 'TG 频道',
      sublabel: '最新资讯 · 工具更新',
      href: 'https://t.me/polymarket_ad/',
      color: '#0088cc',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
  ]

  return (
    <footer className="mt-20 pt-10 border-t border-[#2d2f36]">
      {/* Call to action */}
      <div className="text-center mb-8">
        <p className="text-base font-semibold text-white mb-1">加入社区，一起玩转预测市场</p>
        <p className="text-sm text-slate-400">进群反馈问题 · 获取工具更新 · 和志同道合的朋友交流心得</p>
      </div>

      {/* Social link cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#1a1b1e] hover:bg-[#22242a] border border-[#2d2f36] hover:border-[#3d3f46] transition-all group"
          >
            <span
              className="transition-transform group-hover:scale-110"
              style={{ color: link.color }}
            >
              {link.icon}
            </span>
            <span className="text-sm font-semibold text-white">{link.label}</span>
            <span className="text-[11px] text-slate-500 text-center leading-tight">{link.sublabel}</span>
          </a>
        ))}
      </div>

      {/* Bottom disclaimer */}
      <p className="text-center text-xs text-slate-600 leading-relaxed pb-4">
        数据来源 Polymarket Gamma API · 每小时自动更新 · 仅供参考，不构成投资建议
      </p>
    </footer>
  )
}
