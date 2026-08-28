export default function ErrorPage({ statusCode }: { statusCode: number }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">{statusCode || 500}</h1>
        <p className="text-gray-600">页面出错了</p>
        <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">返回首页</a>
      </div>
    </div>
  )
}
