import { BookOpen, Upload, Library } from 'lucide-react'

interface HomePageProps {
  onNavigate: (page: 'home' | 'library' | 'upload' | 'reader') => void
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          ห้องสมุด<span className="text-blue-600">อีบุ๊ก</span>ส่วนตัว
        </h2>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          อัพโหลด อ่าน และจัดการหนังสือ PDF ของคุณด้วยประสบการณ์การอ่านที่สวยงาม
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => onNavigate('library')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Library className="mr-2 h-5 w-5" />
            เปิดห้องสมุด
          </button>
          <button
            onClick={() => onNavigate('upload')}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Upload className="mr-2 h-5 w-5" />
            อัพโหลดหนังสือ
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="mt-24">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-sm border">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">ตัวอ่าน PDF</h3>
                <p className="mt-5 text-base text-gray-500">
                  อ่านหนังสือ PDF ของคุณด้วยอินเทอร์เฟซที่ลื่นไหลและใช้งานง่าย
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-sm border">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                  <Library className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">ห้องสมุดส่วนตัว</h3>
                <p className="mt-5 text-base text-gray-500">
                  จัดระเบียบและจัดการหนังสือทั้งหมดของคุณในอินเทอร์เฟซที่สวยงาม
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-sm border">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">อัพโหลดง่าย</h3>
                <p className="mt-5 text-base text-gray-500">
                  เพียงลากและวางไฟล์ PDF ของคุณเพื่อเริ่มอ่านได้ทันที
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
