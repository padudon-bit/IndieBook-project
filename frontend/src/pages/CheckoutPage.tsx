import { useState } from 'react'
import { QrCode, CheckCircle, Upload, ArrowLeft } from 'lucide-react'

interface CartItem {
  id: string
  title: string
  author: string
  price: number
  fileName: string
  fileUrl: string
}

interface CheckoutPageProps {
  onNavigate: (page: string) => void
  cartItems: CartItem[]
  onPaymentComplete: () => void
}

export default function CheckoutPage({ onNavigate, cartItems, onPaymentComplete }: CheckoutPageProps) {
  const [paymentStep, setPaymentStep] = useState<'qr' | 'upload' | 'waiting'>('qr')
  const [slip, setSlip] = useState<File | null>(null)
  const [slipPreview, setSlipPreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0)

  const handleSlipUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSlip(file)

      // สร้าง preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setSlipPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleConfirmPayment = () => {
    if (!slip) {
      alert('กรุณาอัพโหลดหลักฐานการชำระเงิน')
      return
    }

    setUploading(true)

    // จำลองการอัพโหลด
    setTimeout(() => {
      setUploading(false)

      // สร้าง order ID
      const orderId = `ORD-${Date.now()}`

      // บันทึกคำสั่งซื้อรอยืนยัน
      const pendingOrders = JSON.parse(localStorage.getItem('indiebook_pending_orders') || '[]')
      const newOrder = {
        orderId,
        customerName: 'ลูกค้า', // ในระบบจริงจะมี user login
        items: cartItems,
        totalAmount: totalPrice,
        slipUrl: slipPreview, // ใช้ base64 เพื่อ demo (ในระบบจริงอัพโหลดไป server)
        submitTime: new Date().toISOString(),
        status: 'pending'
      }
      pendingOrders.push(newOrder)
      localStorage.setItem('indiebook_pending_orders', JSON.stringify(pendingOrders))

      // เคลียร์ตระกร้า
      onPaymentComplete()

      // ไปหน้ารอยืนยัน
      setPaymentStep('waiting')
    }, 1500)
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
                <div className="w-64 h-64 bg-white border-4 border-blue-200 rounded-lg overflow-hidden">
                  <img
                    src={`https://promptpay.io/0864739692/${totalPrice}.png`}
                    alt="QR Code PromptPay"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // ถ้าโหลดไม่ได้ ให้แสดง fallback
                      e.currentTarget.src = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=0864739692`
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">สแกน QR Code เพื่อชำระเงิน</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700 mb-1">โอนเงินไปที่:</p>
                <p className="text-lg font-bold text-blue-600">0864739692</p>
                <p className="text-xs text-gray-500 mt-1">PromptPay</p>
              </div>

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
                  {slipPreview ? (
                    <div className="mb-4">
                      <img
                        src={slipPreview}
                        alt="Preview"
                        className="max-h-64 mx-auto rounded-lg shadow-md"
                      />
                    </div>
                  ) : (
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="slip-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>{slipPreview ? 'เปลี่ยนไฟล์' : 'อัพโหลดไฟล์'}</span>
                      <input
                        id="slip-upload"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleSlipUpload}
                      />
                    </label>
                    {!slipPreview && <p className="pl-1">หรือลากไฟล์มาวาง</p>}
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

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-yellow-800">
                ⚠️ <strong>โปรดทราบ:</strong> คำสั่งซื้อของคุณจะรอการยืนยันจาก Admin
                <br />เมื่อ Admin ตรวจสอบและอนุมัติแล้ว คุณจะสามารถเข้าอ่านหนังสือได้ทันที
              </p>
            </div>

            <button
              onClick={handleConfirmPayment}
              disabled={!slip || uploading}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploading ? 'กำลังส่งข้อมูล...' : 'ยืนยันและส่งข้อมูล'}
            </button>
          </div>
        </>
      )}

      {paymentStep === 'waiting' && (
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-lg border p-12">
            <div className="mb-6">
              <CheckCircle className="h-24 w-24 text-blue-500 mx-auto" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">ส่งข้อมูลสำเร็จ!</h2>
            <p className="text-gray-600 mb-2">
              คำสั่งซื้อของคุณกำลังรอการยืนยันจาก Admin
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
              <p className="text-sm text-blue-800">
                <strong>ขั้นตอนต่อไป:</strong>
                <br />1. Admin จะตรวจสอบหลักฐานการชำระเงิน
                <br />2. เมื่ออนุมัติแล้ว หนังสือจะปรากฏในหน้า "หนังสือของฉัน"
                <br />3. คุณสามารถเข้าอ่านได้ทันที
              </p>
            </div>
            <p className="text-sm text-gray-500 mb-8">
              โปรดรอ Admin ตรวจสอบ (ประมาณ 5-30 นาที)
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => onNavigate('store')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                กลับไปร้านค้า
              </button>
              <button
                onClick={() => onNavigate('my-books')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                ดูหนังสือของฉัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
