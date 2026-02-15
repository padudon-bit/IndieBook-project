import { BookOpen, ShoppingCart, Zap, Shield, CreditCard } from 'lucide-react'

interface HomePageProps {
  onNavigate: (page: string) => void
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h2 className="text-5xl font-extrabold text-gray-900 sm:text-6xl mb-6">
          ร้านหนังสือ<span className="text-blue-600">อิเล็กทรอนิกส์</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          ซื้อและอ่านหนังสือดิจิทัลคุณภาพสูง<br />
          ชำระเงินง่ายผ่าน PromptPay อ่านได้ทันที
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => onNavigate('store')}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 shadow-lg transform hover:scale-105 transition-all"
          >
            <ShoppingCart className="mr-2 h-6 w-6" />
            เริ่มเลือกซื้อหนังสือ
          </button>
          <button
            onClick={() => onNavigate('my-books')}
            className="inline-flex items-center px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transform hover:scale-105 transition-all"
          >
            <BookOpen className="mr-2 h-6 w-6" />
            หนังสือของฉัน
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="text-center p-6 bg-blue-50 rounded-lg">
          <div className="text-4xl font-bold text-blue-600 mb-2">1,000+</div>
          <div className="text-gray-600">หนังสืออิเล็กทรอนิกส์</div>
        </div>
        <div className="text-center p-6 bg-green-50 rounded-lg">
          <div className="text-4xl font-bold text-green-600 mb-2">10,000+</div>
          <div className="text-gray-600">ผู้ใช้งานทั่วประเทศ</div>
        </div>
        <div className="text-center p-6 bg-purple-50 rounded-lg">
          <div className="text-4xl font-bold text-purple-600 mb-2">4.8⭐</div>
          <div className="text-gray-600">คะแนนเฉลี่ย</div>
        </div>
      </div>

      {/* Features */}
      <div className="mt-24">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">ทำไมต้องเลือกเรา</h3>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center p-6 bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">อ่านได้ทันที</h4>
            <p className="text-gray-600 text-sm">
              ชำระเงินแล้วเข้าอ่านได้ทันที ไม่ต้องรอ
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">ชำระง่าย</h4>
            <p className="text-gray-600 text-sm">
              รองรับ PromptPay QR Code สแกนจ่ายง่ายๆ
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">คุณภาพสูง</h4>
            <p className="text-gray-600 text-sm">
              หนังสือคุณภาพสูง อัพเดทเนื้อหาใหม่ทุกวัน
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-sm border hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">ปลอดภัย</h4>
            <p className="text-gray-600 text-sm">
              ระบบปลอดภัย ข้อมูลเข้ารหัส มั่นใจได้
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
        <h3 className="text-3xl font-bold mb-4">พร้อมเริ่มอ่านหนังสือแล้วหรือยัง?</h3>
        <p className="text-xl mb-8 opacity-90">
          เลือกซื้อหนังสือที่คุณสนใจและเริ่มอ่านได้ทันที
        </p>
        <button
          onClick={() => onNavigate('store')}
          className="inline-flex items-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 shadow-lg transform hover:scale-105 transition-all"
        >
          <ShoppingCart className="mr-2 h-6 w-6" />
          เข้าสู่ร้านค้า
        </button>
      </div>
    </div>
  )
}
