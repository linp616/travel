import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "旅途智选 - 个性化行程定制",
  description: "输入出行信息，获取高性价比的个性化旅游攻略",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}