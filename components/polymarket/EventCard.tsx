import { GammaEvent, formatVolume, formatEndDate, getTopOutcome } from '@/lib/gamma-api'
import { getEventLink } from '@/lib/polymarket-links'
import { translateTitle } from '@/lib/translate'

interface EventCardProps {
  event: GammaEvent
}

export default function EventCard({ event }: EventCardProps) {
  const link = getEventLink(event.slug)
  const primaryMarket = event.markets?.[0]
  const outcome = primaryMarket ? getTopOutcome(primaryMarket) : null
  const endDate = formatEndDate(event.endDate || primaryMarket?.endDate || '')
  const vol24h = event.volume24hr ?? 0
  const totalVol = event.volume ?? 0
  const zhTitle = translateTitle(event.title)

  // 颜色：绿色 = 是/涨/高于等；橙色 = 否/跌/低于等
  const outcomeColor = outcome?.positive ? '#00e8a2' : '#f97316'

  return (
    <div className="pm-card group flex flex-col gap-2.5">
      {/* 中文标题（主） */}
      {zhTitle ? (
        <>
          <h3 className="text-sm font-semibold text-white leading-snug group-hover:text-[#00e8a2] transition-colors">
            {zhTitle}
          </h3>
          <p className="text-[11px] text-slate-500 leading-snug line-clamp-1">{event.title}</p>
        </>
      ) : (
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 group-hover:text-[#00e8a2] transition-colors">
          {event.title}
        </h3>
      )}

      {/* 当前最高概率选项 */}
      {outcome && (
        <div className="inline-flex items-center gap-2 text-xs">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: outcomeColor }}
          />
          <span className="font-semibold" style={{ color: outcomeColor }}>
            {outcome.label}
          </span>
          <span className="text-slate-400">·</span>
          <span className="text-slate-300 font-medium">{outcome.pct}%</span>
        </div>
      )}

      {/* 规则摘要 */}
      {event.description && (
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {event.description}
        </p>
      )}

      <div className="mt-auto flex flex-col gap-2">
        {/* 截止时间 + 交易量 */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <ClockIcon />
            {endDate}
          </span>
          <span className="flex items-center gap-1">
            <VolumeIcon />
            {vol24h > 0 ? `${formatVolume(vol24h)}/24h` : formatVolume(totalVol)}
          </span>
        </div>

        {/* CTA */}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="pm-btn-trade"
        >
          前往交易 →
        </a>
      </div>
    </div>
  )
}

function ClockIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path strokeLinecap="round" d="M12 6v6l4 2" strokeWidth="2" />
    </svg>
  )
}

function VolumeIcon() {
  return (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
}
