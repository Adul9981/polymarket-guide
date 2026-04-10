# Polymarket 预测市场导航

> 为中文用户打造的 Polymarket 新人一站式入口，精选 6 大热门板块，标注规则与截止时间，一键跳转交易。

🌐 **在线访问：** [polymarket-guide-lac.vercel.app](https://polymarket-guide-lac.vercel.app/)

---

## 功能特色

- **6 大精选板块** — 加密货币涨跌、天气预测、NBA 赛事、马斯克推文、英雄联盟赛事、伊朗局势
- **实时数据** — 对接 Polymarket Gamma API，每小时自动更新
- **中文界面** — 事件标题、概率标签、截止时间全部中文化
- **智能排序** — 天气/NBA 等板块按截止时间升序，优先展示即将结算的市场
- **过期过滤** — 自动过滤已结束的事件，只展示活跃市场
- **新手知识库** — 六类市场策略 + 四大基础概念，帮助新人快速上手
- **一键跳转** — 所有事件卡片附带邀请链接，直达 Polymarket 交易页

## 六大板块

| 板块 | 说明 |
|------|------|
| ₿ 加密货币涨跌 | BTC/ETH 等 5 分钟短线 + 每小时/每日涨跌预测 |
| 🌤 天气预测 | 全球城市每日最高气温，Polymarket 指定气象站数据，每天结算 |
| 🏀 NBA 赛事 | 常规赛/季后赛胜负预测，按最快结算时间排序 |
| 𝕏 马斯克推文 | 每周发帖数量区间预测，每周五结算 |
| 🎮 英雄联盟赛事 | LPL/LCK/LEC 职业联赛 BO3 系列赛胜负 |
| 🌐 伊朗局势 | 停火协议、冲突结束、政权更迭等地缘政治市场 |

## 技术栈

- **框架：** Next.js 16 (App Router)
- **语言：** TypeScript
- **样式：** Tailwind CSS 4
- **数据：** Polymarket Gamma API
- **部署：** Vercel

## 本地运行

```bash
# 克隆项目
git clone https://github.com/Adul9981/polymarket-guide.git
cd polymarket-guide

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 联系与社区

| 平台 | 链接 |
|------|------|
| 推特 | [@rich_adul](https://x.com/rich_adul) |
| YouTube | [@coveym](https://www.youtube.com/@coveym/) |
| Telegram 交流群 | [polymarket_toolsad](https://t.me/polymarket_toolsad/) |
| Telegram 频道 | [polymarket_ad](https://t.me/polymarket_ad/) |

欢迎加入群组反馈问题、分享心得，或通过 GitHub Issues 提交建议。

---

> 数据来源 Polymarket Gamma API · 每小时自动更新 · 仅供参考，不构成投资建议
