import { useState, useEffect } from 'react'
import { QrCode, CheckCircle, Upload, ArrowLeft } from 'lucide-react'

interface CartItem {
  id: string
  title: string
  price: number
}

interface CheckoutPageProps {
  onNavigate: (page: string) => void
  cartItems: CartItem[]
  onPaymentComplete: () => void
}

export default function CheckoutPage({ onNavigate, cartItems, onPaymentComplete }: CheckoutPageProps) {
  const [paymentStep, setPaymentStep] = useState<'qr' | 'upload' | 'success'>('qr')
  const [slip, setSlip] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0)

  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSlip(file)
    }
  }

  const handleConfirmPayment = () => {
    if (!slip) {
      alert('กรุณาอัพโหลดหลักฐานการชำระเงิน')
      return
    }

    setUploading(true)

    // จำลองการอัพโหลดและตรวจสอบ (ในระบบจริงจะส่งไป backend)
    setTimeout(() => {
      setUploading(false)
      setPaymentStep('success')

      // บันทึกหนังสือที่ซื้อลง localStorage
      const purchasedBooks = JSON.parse(localStorage.getItem('indiebook_purchased') || '[]')
      const newPurchases = cartItems.map(item => ({
        ...item,
        purchaseDate: new Date().toISOString(),
        orderId: `ORD-${Date.now()}`
      }))
      localStorage.setItem('indiebook_purchased', JSON.stringify([...purchasedBooks, ...newPurchases]))

      // รอ 2 วินาทีแล้วไปหน้าหนังสือของฉัน
      setTimeout(() => {
        onPaymentComplete()
        onNavigate('my-books')
      }, 2000)
    }, 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {paymentStep === 'qr' && (
        <>
          <button
            onClick={() => onNavigate('cart')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            กลับไปตระกร้า
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">ชำระเงินผ่าน PromptPay</h2>
            <p className="mt-2 text-gray-600">สแกน QR Code เพื่อชำระเงิน</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg border p-8">
            {/* Order Summary */}
            <div className="mb-8 pb-8 border-b">
              <h3 className="font-semibold text-lg mb-4">รายการสั่งซื้อ</h3>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between mb-2">
                  <span className="text-gray-700">{item.title}</span>
                  <span className="font-medium">฿{item.price.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between mt-4 pt-4 border-t text-lg font-bold">
                <span>ยอดรวมทั้งหมด</span>
                <span className="text-blue-600">฿{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="text-center">
              <div className="inline-block p-8 bg-gray-50 rounded-lg mb-6">
                <div className="w-64 h-64 bg-white border-4 border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="h-32 w-32 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-500">QR Code PromptPay</p>
                    <p className="text-xs text-gray-400 mt-2">จำนวน ฿{totalPrice.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                หมายเลข PromptPay: <span className="font-mono font-semibold">0812345678</span>
              </p>

              <button
                onClick={() => setPaymentStep('upload')}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                ชำระเงินแล้ว - อัพโหลดสลิป
              </button>
            </div>
          </div>
        </>
      )}

      {paymentStep === 'upload' && (
        <>
          <button
            onClick={() => setPaymentStep('qr')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            กลับ
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">อัพโหลดหลักฐานการชำระเงิน</h2>
            <p className="mt-2 text-gray-600">แนบสลิปการโอนเงินของคุณ</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg border p-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                หลักฐานการชำระเงิน (สลิป)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="slip-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>อัพโหลดไฟล์</span>
                      <input
                        id="slip-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleSlipUpload}
                      />
                    </label>
                    <p className="pl-1">หรือลากไฟล์มาวาง</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF ขนาดไม่เกิน 10MB</p>
                </div>
              </div>
            </div>

            {slip && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  ✓ อัพโหลดไฟล์: {slip.name}
                </p>
              </div>
            )}

            <button
              onClick={handleConfirmPayment}
              disabled={!slip || uploading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? 'กำลังตรวจสอบ...' : 'ยืนยันการชำระเงิน'}
            </button>
          </div>
        </>
      )}

      {paymentStep === 'success' && (
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg border p-12">
            <div className="mb-6">
              <CheckCircle className="h-24 w-24 text-green-500 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">ชำระเงินสำเร็จ!</h2>
            <p className="text-gray-600 mb-2">
              ขอบคุณที่ซื้อหนังสือกับเรา
            </p>
            <p className="text-sm text-gray-500 mb-8">
              กำลังพาคุณไปยังหน้าหนังสือของฉัน...
            </p>
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      )}
    </div>
  )
}
