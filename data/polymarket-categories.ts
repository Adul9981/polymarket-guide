export interface TagSlugQuery {
  slug: string
  limit?: number
  /** 排序字段 */
  order?: 'volume24hr' | 'startDate' | 'endDate'
  /** true = 升序（最早/最小在前），false = 降序（默认）*/
  ascending?: boolean
}

export interface CategoryConfig {
  id: string
  label: string
  icon: string
  description: string
  tip: string
  /**
   * tag_slug       → 单个 tag_slug 查询
   * multi_tag_slug → 多个 tag_slug 合并查询（去重）
   * slugs          → 精确 slug 列表
   * musk           → 动态生成周度 slug
   */
  fetchStrategy: 'tag_slug' | 'multi_tag_slug' | 'slugs' | 'musk'
  tagSlug?: string
  tagSlugOrder?: 'volume24hr' | 'startDate' | 'endDate'
  tagSlugAscending?: boolean
  tagSlugs?: TagSlugQuery[]
  slugs?: string[]
}

export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'crypto',
    label: '加密货币涨跌',
    icon: '₿',
    description: 'BTC / ETH 等加密货币涨跌预测，涵盖 5 分钟短线和每小时 / 每日两种周期',
    tip: '5分钟市场每5分钟滚动更新；每小时/每日市场交易量更大，适合初次体验',
    fetchStrategy: 'multi_tag_slug',
    tagSlugs: [
      { slug: 'bitcoin',    limit: 1, order: 'startDate', ascending: false }, // 比特币5分钟（优先展示1个）
      { slug: '5m',         limit: 4, order: 'startDate', ascending: false }, // 其他币种5分钟市场
      { slug: 'up-or-down', limit: 4, order: 'endDate',   ascending: true  }, // 即将结束的每小时/每日
    ],
  },
  {
    id: 'weather',
    label: '天气预测',
    icon: '🌤',
    description: '预测全球城市每日最高气温，数据来源为官方气象局，每天结算',
    tip: '结算周期最短，参与门槛低，适合快速体验预测市场',
    fetchStrategy: 'tag_slug',
    tagSlug: 'temperature',
    tagSlugOrder: 'endDate',
    tagSlugAscending: true,
  },
  {
    id: 'nba',
    label: 'NBA 赛事',
    icon: '🏀',
    description: '预测 NBA 常规赛 / 季后赛胜负，赛后即时结算，优先展示即将开赛比赛',
    tip: '熟悉球队近况与伤病情况的球迷有天然信息优势',
    fetchStrategy: 'tag_slug',
    tagSlug: 'nba',
    tagSlugOrder: 'endDate',
    tagSlugAscending: true,
  },
  {
    id: 'musk',
    label: '马斯克推文',
    icon: '𝕏',
    description: '预测马斯克本周发帖数量区间（主帖 + 转发，不含回复），每周五结算',
    tip: '7天周期、流动性极强，规律性明显，新手最推荐板块之一',
    fetchStrategy: 'musk',
  },
  {
    id: 'lol',
    label: '英雄联盟赛事',
    icon: '🎮',
    description: '预测 LPL / LCK / LEC 职业联赛 BO3 系列赛胜负，赛后即结算',
    tip: '熟悉赛事战队状态的玩家有天然信息优势',
    fetchStrategy: 'tag_slug',
    tagSlug: 'league-of-legends',
  },
  {
    id: 'iran',
    label: '伊朗局势',
    icon: '🌐',
    description: '预测美伊停火、冲突结束、政权更迭等关键时间节点，全站交易量最高地缘政治板块',
    tip: '总交易量超 2 亿美元，流动性极高，适合关注国际时事的玩家',
    fetchStrategy: 'slugs',
    slugs: [
      'us-x-iran-ceasefire-by',
      'trump-announces-us-x-iran-ceasefire-by',
      'iran-x-israelus-conflict-ends-by',
      'military-action-against-iran-ends-on-127',
      'trump-announces-end-of-military-operations-against-iran-by',
      'will-the-iranian-regime-fall-by-june-30',
      'strait-of-hormuz-traffic-returns-to-normal-by-april-30',
      'us-x-iran-diplomatic-meeting-by-833',
    ],
  },
]
