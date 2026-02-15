import { useState, useEffect } from 'react'
import { ShoppingCart, Trash2, ArrowLeft, CreditCard } from 'lucide-react'

interface CartItem {
  id: string
  title: string
  author: string
  price: number
  quantity: number
}

interface CartPageProps {
  onNavigate: (page: string) => void
  cartItems: CartItem[]
  onRemoveFromCart: (bookId: string) => void
  onCheckout: () => void
}

export default function CartPage({ onNavigate, cartItems, onRemoveFromCart, onCheckout }: CartPageProps) {
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => onNavigate('store')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          กลับไปเลือกหนังสือ
        </button>
        <h2 className="text-3xl font-bold text-gray-900">ตระกร้าสินค้า</h2>
        <p className="mt-2 text-gray-600">
          {totalItems > 0 ? `คุณมี ${totalItems} รายการในตระกร้า` : 'ตระกร้าของคุณว่างเปล่า'}
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <ShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">ตระกร้าของคุณว่างเปล่า</h3>
          <p className="mt-2 text-sm text-gray-500">เริ่มเลือกซื้อหนังสือที่คุณสนใจกันเถอะ!</p>
          <button
            onClick={() => onNavigate('store')}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            เริ่มเลือกหนังสือ
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border p-6 flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">โดย {item.author}</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">฿{item.price.toLocaleString()}</p>
                </div>
                <button
                  onClick={() => onRemoveFromCart(item.id)}
                  className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="ลบออกจากตระกร้า"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">สรุปคำสั่งซื้อ</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>จำนวนรายการ</span>
                  <span>{totalItems} รายการ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>ยอดรวม</span>
                  <span>฿{totalPrice.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>ยอดที่ต้องชำระ</span>
                  <span className="text-blue-600">฿{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                ดำเนินการชำระเงิน
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                ชำระผ่าน PromptPay QR Code
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
