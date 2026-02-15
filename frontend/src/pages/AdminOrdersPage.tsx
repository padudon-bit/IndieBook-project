import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, Image as ImageIcon, ArrowLeft, Loader } from 'lucide-react'
import { useOrders } from '../hooks/useOrders'

interface AdminOrdersPageProps {
  onNavigate: (page: string) => void
}

export default function AdminOrdersPage({ onNavigate }: AdminOrdersPageProps) {
  const { orders, loading, approveOrder, rejectOrder, getOrderItems } = useOrders()
  const [selectedSlip, setSelectedSlip] = useState<string | null>(null)
  const [orderItems, setOrderItems] = useState<{ [key: string]: any[] }>({})

  useEffect(() => {
    // Load order items for all orders
    orders.forEach(async (order) => {
      const { data } = await getOrderItems(order.id)
      if (data) {
        setOrderItems(prev => ({ ...prev, [order.id]: data }))
      }
    })
  }, [orders])

  const handleApprove = async (orderId: string) => {
    if (!confirm('ยืนยันการอนุมัติคำสั่งซื้อนี้?')) return

    const { error } = await approveOrder(orderId)
    if (error) {
      alert(`❌ เกิดข้อผิดพลาด: ${error}`)
    } else {
      alert('✅ อนุมัติคำสั่งซื้อเรียบร้อย! ลูกค้าสามารถอ่านหนังสือได้แล้ว')
    }
  }

  const handleReject = async (orderId: string) => {
    const reason = prompt('เหตุผลในการปฏิเสธ:')
    if (!reason) return

    const { error } = await rejectOrder(orderId, reason)
    if (error) {
      alert(`❌ เกิดข้อผิดพลาด: ${error}`)
    } else {
      alert('❌ ปฏิเสธคำสั่งซื้อแล้ว')
    }
  }

  const pendingCount = orders.filter(o => o.status === 'pending').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">คำสั่งซื้อรอยืนยัน</h2>
          <p className="mt-2 text-gray-600">ตรวจสอบและอนุมัติคำสั่งซื้อจากลูกค้า</p>
        </div>
        <button
          onClick={() => onNavigate('admin')}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          กลับ
        </button>
      </div>

      {/* Pending Count */}
      {pendingCount > 0 && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <Clock className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                มีคำสั่งซื้อรอยืนยัน <span className="font-bold">{pendingCount}</span> รายการ
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Orders List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12">
            <Loader className="mx-auto h-12 w-12 text-blue-600 animate-spin" />
            <p className="mt-3 text-gray-600">กำลังโหลดคำสั่งซื้อ...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่มีคำสั่งซื้อ</h3>
            <p className="mt-1 text-sm text-gray-500">รอคำสั่งซื้อจากลูกค้า</p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className={`bg-white rounded-lg shadow-sm border p-6 ${
                order.status === 'approved'
                  ? 'border-green-300 bg-green-50'
                  : order.status === 'rejected'
                  ? 'border-red-300 bg-red-50'
                  : ''
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        #{order.id.slice(0, 8)}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.customer_name} ({order.customer_phone})
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleString('th-TH')}
                      </p>
                    </div>
                    {order.status === 'pending' && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                        รอยืนยัน
                      </span>
                    )}
                    {order.status === 'approved' && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        อนุมัติแล้ว
                      </span>
                    )}
                    {order.status === 'rejected' && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                        ปฏิเสธแล้ว
                      </span>
                    )}
                  </div>

                  {/* Items */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">รายการสินค้า:</h4>
                    {orderItems[order.id]?.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm py-1">
                        <span className="text-gray-700">{item.books?.title || 'หนังสือ'}</span>
                        <span className="font-medium">฿{item.price.toLocaleString()}</span>
                      </div>
                    )) || <p className="text-sm text-gray-500">กำลังโหลด...</p>}
                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                      <span>ยอดรวม</span>
                      <span className="text-blue-600">฿{order.total_amount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Rejection Reason */}
                  {order.status === 'rejected' && order.rejection_reason && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-medium text-red-800">เหตุผลที่ปฏิเสธ:</p>
                      <p className="text-sm text-red-700">{order.rejection_reason}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {order.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(order.id)}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        อนุมัติ
                      </button>
                      <button
                        onClick={() => handleReject(order.id)}
                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        ปฏิเสธ
                      </button>
                    </div>
                  )}
                </div>

                {/* Payment Slip */}
                <div className="lg:col-span-1">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">หลักฐานการชำระเงิน:</h4>
                  {order.slip_image ? (
                    <div
                      className="border-2 border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => setSelectedSlip(order.slip_image)}
                    >
                      <img
                        src={order.slip_image}
                        alt="Payment Slip"
                        className="w-full h-auto object-cover"
                      />
                      <p className="text-xs text-center text-gray-500 p-2 bg-gray-50">
                        คลิกเพื่อดูขนาดเต็ม
                      </p>
                    </div>
                  ) : (
                    <div className="border-2 border-gray-200 rounded-lg p-4 text-center">
                      <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                      <p className="text-xs text-gray-500 mt-2">ไม่มีหลักฐาน</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Fullscreen Slip Modal */}
      {selectedSlip && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSlip(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedSlip}
              alt="Payment Slip"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setSelectedSlip(null)}
              className="absolute top-4 right-4 bg-white text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
