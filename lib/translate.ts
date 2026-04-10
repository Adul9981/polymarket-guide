/**
 * 将 Polymarket 英文事件标题翻译为中文（模式匹配，无需 API）
 * 原始英文标题作为副标题保留
 */

const COIN_MAP: Record<string, string> = {
  Bitcoin: '比特币',
  BTC: '比特币',
  Ethereum: '以太坊',
  ETH: '以太坊',
  Solana: 'SOL',
  SOL: 'SOL',
  BNB: 'BNB',
  XRP: 'XRP',
  Dogecoin: '狗狗币',
  DOGE: '狗狗币',
  Hyperliquid: 'Hyperliquid',
  HYPE: 'HYPE',
  'S&P 500': '标普500',
  SPX: '标普500',
}

const MONTH_MAP: Record<string, string> = {
  January: '1月', February: '2月', March: '3月', April: '4月',
  May: '5月', June: '6月', July: '7月', August: '8月',
  September: '9月', October: '10月', November: '11月', December: '12月',
}

function replaceCoin(str: string): string {
  let result = str
  for (const [en, zh] of Object.entries(COIN_MAP)) {
    result = result.replace(new RegExp(`\\b${en}\\b`, 'g'), zh)
  }
  return result
}

function translateMonth(str: string): string {
  let result = str
  for (const [en, zh] of Object.entries(MONTH_MAP)) {
    result = result.replace(new RegExp(en, 'gi'), zh)
  }
  return result
}

/** 将 "April 9" 格式转换为 "4月9日" */
function translateDate(str: string): string {
  return str.replace(/([A-Za-z]+)\s+(\d+)/g, (_, month, day) => {
    const key = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase()
    const zhMonth = MONTH_MAP[key]
    return zhMonth ? `${zhMonth}${day}日` : `${month} ${day}`
  })
}

export function translateTitle(title: string): string | null {
  // ── 马斯克推文 ──────────────────────────────────────────
  // "Elon Musk # tweets April 10 - April 17, 2026?"
  const muskMatch = title.match(/Elon Musk #\s*tweets\s+(\w+\s+\d+)\s*[-–]\s*(\w+\s+\d+)/i)
  if (muskMatch) {
    const start = translateDate(muskMatch[1])
    const end = translateDate(muskMatch[2])
    return `马斯克推文数预测（${start} ~ ${end}）`
  }

  // ── 加密货币涨跌（5分钟/小时）─────────────────────────
  // "Bitcoin Up or Down - April 10, 11:50AM-11:55AM ET"
  const updown5m = title.match(/^(.+?)\s+Up or Down\s*[-–]\s*\w+\s+\d+,\s*(\d+:\d+[AP]M)-(\d+:\d+[AP]M)/i)
  if (updown5m) {
    const coin = replaceCoin(updown5m[1].trim())
    return `${coin} 涨跌 · ${updown5m[2]}–${updown5m[3]} ET`
  }

  // "Bitcoin Up or Down - April 9, 10AM ET"
  const updown1h = title.match(/^(.+?)\s+Up or Down\s*[-–]\s*\w+\s+\d+,\s*(\d+[AP]M)\s*ET/i)
  if (updown1h) {
    const coin = replaceCoin(updown1h[1].trim())
    return `${coin} 涨跌 · ${updown1h[2]} ET`
  }

  // "Bitcoin Up or Down on April 9?"
  const updownDay = title.match(/^(.+?)\s+Up or Down on\s+(\w+\s+\d+)/i)
  if (updownDay) {
    const coin = replaceCoin(updownDay[1].trim())
    const date = translateDate(updownDay[2])
    return `${coin} ${date} 当日涨跌`
  }

  // "S&P 500 (SPX) Opens Up or Down on April 9?"
  const spxOpen = title.match(/S&P 500.*Opens Up or Down on\s+(\w+\s+\d+)/i)
  if (spxOpen) {
    const date = translateDate(spxOpen[1])
    return `标普500 ${date} 开盘涨跌`
  }

  // ── 天气 ───────────────────────────────────────────────
  // "Highest temperature in Hong Kong on April 9?"
  const tempMatch = title.match(/Highest temperature in (.+?) on (\w+\s+\d+)/i)
  if (tempMatch) {
    const city = tempMatch[1].trim()
    const date = translateDate(tempMatch[2])
    return `${city} ${date} 最高气温`
  }

  // ── 英雄联盟 ───────────────────────────────────────────
  // "LoL: TeamA vs TeamB (BO3) - LCK Rounds"
  const lolMatch = title.match(/LoL:\s*(.+?)\s+vs\s+(.+?)\s*\((BO\d)\)/i)
  if (lolMatch) {
    return `英雄联盟：${lolMatch[1]} vs ${lolMatch[2]} (${lolMatch[3]})`
  }

  // ── 伊朗 ───────────────────────────────────────────────
  if (/Trump announces US x Iran ceasefire/i.test(title)) return '特朗普宣布美伊停火'
  if (/US x Iran ceasefire/i.test(title)) return '美伊停火协议达成预测'
  if (/Iran x Israel.*conflict ends/i.test(title)) return '伊以/美冲突结束预测'
  if (/Military action against Iran ends/i.test(title)) return '对伊军事行动结束预测'
  if (/Trump announces end of military operations against Iran/i.test(title)) return '特朗普宣布结束对伊军事行动'
  if (/Iranian regime fall.*june/i.test(title)) return '伊朗政权6月前倒台预测'
  if (/Iranian regime fall/i.test(title)) return '伊朗政权倒台预测'
  if (/Strait of Hormuz.*normal/i.test(title)) return '霍尔木兹海峡恢复通航预测'
  if (/US x Iran diplomatic meeting/i.test(title)) return '美伊外交会谈预测'

  return null // 未匹配，返回 null，调用方保留英文原文
}
