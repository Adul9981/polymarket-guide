const GAMMA_API = 'https://gamma-api.polymarket.com'

export interface GammaMarket {
  id: string
  question: string
  conditionId: string
  slug: string
  resolutionSource: string
  endDate: string
  liquidity: number
  startDate: string
  image: string
  icon: string
  description: string
  outcomes: string
  outcomePrices: string
  volume: number
  active: boolean
  closed: boolean
}

export interface GammaEvent {
  id: string
  title: string
  slug: string
  description: string
  startDate: string
  endDate: string
  image: string
  icon: string
  active: boolean
  closed: boolean
  archived: boolean
  volume: number
  volume24hr: number
  liquidity: number
  markets: GammaMarket[]
}

/** 通过 tag_slug 查询活跃事件（唯一有效的 tag 过滤方式）*/
export async function fetchEventsByTagSlug(
  tagSlug: string,
  limit = 6,
  order: 'volume24hr' | 'startDate' = 'volume24hr',
): Promise<GammaEvent[]> {
  const url = `${GAMMA_API}/events?active=true&closed=false&archived=false&tag_slug=${tagSlug}&limit=${limit}&order=${order}&ascending=false`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) return []
  return res.json()
}

/**
 * 同时查询多个 tag_slug，合并结果并按 id 去重。
 * 用于需要混合展示不同子类别的场景（如：5分钟市场 + 每小时市场）。
 */
export async function fetchEventsByMultipleTagSlugs(
  tagSlugs: { slug: string; limit?: number; order?: 'volume24hr' | 'startDate' }[],
): Promise<GammaEvent[]> {
  const results = await Promise.allSettled(
    tagSlugs.map(({ slug, limit = 4, order = 'volume24hr' }) =>
      fetchEventsByTagSlug(slug, limit, order)
    )
  )
  const seen = new Set<string>()
  const merged: GammaEvent[] = []
  for (const r of results) {
    if (r.status !== 'fulfilled') continue
    for (const event of r.value) {
      if (!seen.has(event.id)) {
        seen.add(event.id)
        merged.push(event)
      }
    }
  }
  return merged
}

/** 通过精确 slug 查询单个事件 */
export async function fetchEventBySlug(slug: string): Promise<GammaEvent | null> {
  const url = `${GAMMA_API}/events?slug=${slug}`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) return null
  const data: GammaEvent[] = await res.json()
  return data[0] ?? null
}

/**
 * 动态生成马斯克推文市场的 slug。
 * 规则：每周五 12:00 ET 到下周五 12:00 ET 为一个周期。
 * slug 格式：elon-musk-of-tweets-{month1}-{day1}-{month2}-{day2}
 */
function getMuskTweetsSlug(referenceDate?: Date): string {
  const MONTHS = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december',
  ]

  // 以 ET 时区的"今天"为基准找最近的周四（开始日）
  const now = referenceDate ?? new Date()
  // 转换为 ET（UTC-4 夏令 / UTC-5 冬令），简单用 UTC-4 近似
  const etOffset = -4 * 60 // 分钟
  const etNow = new Date(now.getTime() + (etOffset - now.getTimezoneOffset()) * 60000)

  const dayOfWeek = etNow.getDay() // 0=Sun, 5=Fri
  // 距离上一个周五的天数（Polymarket 马斯克推文市场以每周五结算）
  const daysToLastFriday = (dayOfWeek + 2) % 7 // Fri=5 → 0, Sat=6 → 1, Thu=4 → 6
  const startDate = new Date(etNow)
  startDate.setDate(etNow.getDate() - daysToLastFriday)

  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 7)

  const startMonth = MONTHS[startDate.getMonth()]
  const endMonth = MONTHS[endDate.getMonth()]

  return `elon-musk-of-tweets-${startMonth}-${startDate.getDate()}-${endMonth}-${endDate.getDate()}`
}

/**
 * 获取当前及相邻周期的马斯克推文市场（最多返回 3 个活跃事件）。
 * 优先展示当前周，再加上前后一周，按时间正序排列。
 */
export async function fetchMuskTweetsEvents(): Promise<GammaEvent[]> {
  const now = new Date()
  const offsets = [0, -7, 7]
  const slugs = offsets.map((offsetDays) => {
    const ref = new Date(now)
    ref.setDate(now.getDate() + offsetDays)
    return getMuskTweetsSlug(ref)
  })

  const results = await Promise.allSettled(slugs.map(fetchEventBySlug))
  return results
    .filter((r): r is PromiseFulfilledResult<GammaEvent> => r.status === 'fulfilled' && r.value !== null && !r.value.archived)
    .map((r) => r.value)
    .sort((a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime())
}

// ── 工具函数 ────────────────────────────────────────────────────────────────

export function formatVolume(vol: number): string {
  if (vol >= 1_000_000) return `$${(vol / 1_000_000).toFixed(1)}M`
  if (vol >= 1_000) return `$${(vol / 1_000).toFixed(0)}K`
  return `$${vol.toFixed(0)}`
}

export function formatEndDate(isoDate: string): string {
  if (!isoDate) return '—'
  const d = new Date(isoDate)
  return d.toLocaleString('zh-CN', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }) + ' ET'
}

export function getTopOutcomeLabel(market: GammaMarket): string | null {
  try {
    const outcomes: string[] = JSON.parse(market.outcomes)
    const prices: string[] = JSON.parse(market.outcomePrices)
    if (!outcomes.length || !prices.length) return null
    const nums = prices.map(Number)
    const maxVal = Math.max(...nums)
    const maxIdx = nums.indexOf(maxVal)
    const pct = Math.round(maxVal * 100)
    return `${outcomes[maxIdx]} ${pct}%`
  } catch {
    return null
  }
}
