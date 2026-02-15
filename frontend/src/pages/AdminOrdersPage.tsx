import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock, Image as ImageIcon, ArrowLeft } from 'lucide-react'

interface PendingOrder {
  orderId: string
  customerName: string
  items: Array<{ id: string; title: string; price: number }>
  totalAmount: number
  slipUrl: string
  submitTime: string
  status: 'pending' | 'approved' | 'rejected'
}

interface AdminOrdersPageProps {
  onNavigate: (page: string) => void
}

export default function AdminOrdersPage({ onNavigate }: AdminOrdersPageProps) {
  const [orders, setOrders] = useState<PendingOrder[]>([])
  const [selectedSlip, setSelectedSlip] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = () => {
    const pendingOrders = JSON.parse(localStorage.getItem('indiebook_pending_orders') || '[]')
    setOrders(pendingOrders)
  }

  const approveOrder = (orderId: string) => {
    if (!confirm('ยืนยันการอนุมัติคำสั่งซื้อนี้?')) return

    const pendingOrders = JSON.parse(localStorage.getItem('indiebook_pending_orders') || '[]')
    const order = pendingOrders.find((o: PendingOrder) => o.orderId === orderId)

    if (order) {
      // อัพเดทสถานะเป็น approved
      order.status = 'approved'
      const updatedOrders = pendingOrders.map((o: PendingOrder) =>
        o.orderId === orderId ? order : o
      )
      localStorage.setItem('indiebook_pending_orders', JSON.stringify(updatedOrders))

      // ย้ายไปหนังสือที่ซื้อแล้ว
      const purchasedBooks = JSON.parse(localStorage.getItem('indiebook_purchased') || '[]')
      const newPurchases = order.items.map((item: any) => ({
        ...item,
        purchaseDate: new Date().toISOString(),
        orderId: orderId
      }))
      localStorage.setItem('indiebook_purchased', JSON.stringify([...purchasedBooks, ...newPurchases]))

      alert('✅ อนุมัติคำสั่งซื้อเรียบร้อย! ลูกค้าสามารถอ่านหนังสือได้แล้ว')
      loadOrders()
    }
  }

  const rejectOrder = (orderId: string) => {
    const reason = prompt('เหตุผลในการปฏิเสธ:')
    if (!reason) return

    const pendingOrders = JSON.parse(localStorage.getItem('indiebook_pending_orders') || '[]')
    const updatedOrders = pendingOrders.map((o: PendingOrder) =>
      o.orderId === orderId ? { ...o, status: 'rejected', rejectReason: reason } : o
    )
    localStorage.setItem('indiebook_pending_orders', JSON.stringify(updatedOrders))

    alert('❌ ปฏิเสธคำสั่งซื้อแล้ว')
    loadOrders()
  }

  const pendingCount = orders.filter(o => o.status === 'pending').length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">คำสั่งซื้อรอยืนยัน</h2>
          <p className="mt-2 text-gray-600">
            มี {pendingCount} รายการรอการยืนยัน
          </p>
        </div>
        <button
          onClick={() => onNavigate('admin')}
          className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          กลับ
        </button>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">ไม่มีคำสั่งซื้อ</h3>
          <p className="mt-2 text-sm text-gray-500">ยังไม่มีคำสั่งซื้อรอการยืนยัน</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.orderId}
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
                        คำสั่งซื้อ #{order.orderId}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(order.submitTime).toLocaleString('th-TH')}
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
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm py-1">
                        <span className="text-gray-700">{item.title}</span>
                        <span className="font-medium">฿{item.price.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                      <span>ยอดรวม</span>
                      <span className="text-blue-600">฿{order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  {order.status === 'pending' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => approveOrder(order.orderId)}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        อนุมัติ
                      </button>
                      <button
                        onClick={() => rejectOrder(order.orderId)}
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
                  {order.slipUrl ? (
                    <div
                      className="border-2 border-gray-300 rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 transition-colors"
                      onClick={() => setSelectedSlip(order.slipUrl)}
                    >
                      <img
                        src={order.slipUrl}
                        alt="สลิปการโอนเงิน"
                        className="w-full h-48 object-cover"
                      />
                      <p className="text-xs text-center py-2 bg-gray-50 text-gray-600">
                        คลิกเพื่อดูขนาดเต็ม
                      </p>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">ไม่มีสลิป</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Slip Modal */}
      {selectedSlip && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedSlip(null)}
        >
          <div className="max-w-4xl max-h-full overflow-auto">
            <img src={selectedSlip} alt="สลิปโอนเงิน" className="w-full h-auto" />
          </div>
        </div>
      )}
    </div>
  )
}
