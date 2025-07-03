import { getAllExtensions } from '@/lib/supabase/queries'
import { ExtensionsClient } from '@/app/extensions/components/ExtensionsClient'

export default async function ExtensionsPage() {
  const initialData = await getAllExtensions()

  return (
    <div className="container mx-auto p-8 max-w-3xl h-1/2 bg-gray-50 min-h-screen flex flex-col justify-center">
      <h1 className="text-2xl font-bold mb-4">파일 확장자 차단</h1>

      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <ExtensionsClient initialData={initialData} />
      </div>
    </div>
  )
}

export const metadata = {
  title: '파일 확장자 차단 | Extension Filter',
  description: '파일 확장자별로 업로드를 제한하는 관리 시스템',
}
