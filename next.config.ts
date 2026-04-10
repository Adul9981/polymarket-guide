import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 使用旧缓存模型（fetch revalidate），避免 PPR 对 new Date() 的限制
}

export default nextConfig
