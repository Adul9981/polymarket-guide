import { Suspense } from 'react'
import { fetchEventsByTagSlug, fetchEventsByMultipleTagSlugs, fetchEventBySlug, fetchMuskTweetsEvents, GammaEvent } from '@/lib/gamma-api'
import { CATEGORIES, CategoryConfig } from '@/data/polymarket-categories'
import HeroSection from '@/components/polymarket/HeroSection'
import CategoryNav from '@/components/polymarket/CategoryNav'
import CategorySection from '@/components/polymarket/CategorySection'
import KnowledgeSection from '@/components/polymarket/KnowledgeSection'
import SocialFooter from '@/components/polymarket/SocialFooter'

/** 过滤掉 endDate 已过期的事件 */
function filterExpired(events: GammaEvent[]): GammaEvent[] {
  const now = Date.now()
  return events.filter((e) => {
    const end = e.endDate || e.markets?.[0]?.endDate
    if (!end) return true // 无截止时间保留
    return new Date(end).getTime() > now
  })
}

async function fetchCategoryEvents(config: CategoryConfig): Promise<GammaEvent[]> {
  let events: GammaEvent[] = []

  if (config.fetchStrategy === 'tag_slug' && config.tagSlug) {
    events = await fetchEventsByTagSlug(
      config.tagSlug,
      6,
      config.tagSlugOrder ?? 'volume24hr',
      config.tagSlugAscending ?? false,
    )
  } else if (config.fetchStrategy === 'multi_tag_slug' && config.tagSlugs) {
    events = await fetchEventsByMultipleTagSlugs(config.tagSlugs)
  } else if (config.fetchStrategy === 'musk') {
    events = await fetchMuskTweetsEvents()
  } else if (config.fetchStrategy === 'slugs' && config.slugs) {
    const results = await Promise.allSettled(config.slugs.map(fetchEventBySlug))
    events = results
      .filter((r): r is PromiseFulfilledResult<GammaEvent> => r.status === 'fulfilled' && r.value !== null)
      .map((r) => r.value)
  }

  return filterExpired(events)
}

async function AllCategories() {
  const categoryData = await Promise.allSettled(
    CATEGORIES.map(async (cat) => ({
      config: cat,
      events: await fetchCategoryEvents(cat),
    }))
  )

  return (
    <div className="flex flex-col gap-12">
      {categoryData.map((result, i) => {
        if (result.status === 'rejected') {
          return (
            <section key={i} className="pm-empty">
              该板块数据加载失败，请刷新重试
            </section>
          )
        }
        const { config, events } = result.value
        return (
          <CategorySection key={config.id} config={config} events={events} />
        )
      })}
    </div>
  )
}

export default function PolymarketPage() {
  return (
    <div className="min-h-screen bg-[#0d0e12] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <HeroSection />
        <KnowledgeSection />
        <CategoryNav />
        <Suspense fallback={<LoadingSkeleton />}>
          <AllCategories />
        </Suspense>
        <SocialFooter />
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-12">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="flex gap-3 mb-5">
            <div className="w-8 h-8 rounded bg-[#1a1b1e]" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-5 w-32 rounded bg-[#1a1b1e]" />
              <div className="h-4 w-64 rounded bg-[#1a1b1e]" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="h-40 rounded-xl bg-[#1a1b1e]" />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
