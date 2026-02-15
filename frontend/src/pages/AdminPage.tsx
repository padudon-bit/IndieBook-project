import { useState } from 'react'
import { BarChart3, BookOpen, Trash2, Search, ShoppingBag, Bell, Plus, Loader } from 'lucide-react'
import { useBooks } from '../hooks/useBooks'
import { useOrders } from '../hooks/useOrders'

interface AdminPageProps {
  onNavigate: (page: string) => void
}

export default function AdminPage({ onNavigate }: AdminPageProps) {
  const { books, loading: booksLoading, deleteBook: deleteBookFromDB } = useBooks()
  const { orders } = useOrders()
  const [searchQuery, setSearchQuery] = useState('')

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length

  const handleDeleteBook = async (bookId: string) => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบหนังสือเล่มนี้?')) {
      const { error } = await deleteBookFromDB(bookId)
      if (error) {
        alert(`❌ เกิดข้อผิดพลาด: ${error}`)
      } else {
        alert('✅ ลบหนังสือเรียบร้อยแล้ว')
      }
    }
  }

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.file_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">แดชบอร์ดผู้ดูแลระบบ</h2>
          <p className="mt-2 text-gray-600">
            จัดการหนังสือและดูสถิติการใช้งาน
          </p>
        </div>
        <button
          onClick={() => onNavigate('admin-upload')}
          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          เพิ่มหนังสือใหม่
        </button>
      </div>

      {/* Pending Orders Alert */}
      {pendingOrdersCount > 0 && (
        <div className="mb-6 bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-yellow-600 mr-3 animate-bounce" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900">
                  มีคำสั่งซื้อรอยืนยัน {pendingOrdersCount} รายการ!
                </h3>
                <p className="text-sm text-yellow-700">
                  กรุณาตรวจสอบและอนุมัติคำสั่งซื้อ
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('admin-orders')}
              className="flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              ดูคำสั่งซื้อ
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">หนังสือทั้งหมด</dt>
                <dd className="text-3xl font-semibold text-gray-900">{books.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">คำสั่งซื้อทั้งหมด</dt>
                <dd className="text-3xl font-semibold text-gray-900">{orders.length}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">รออนุมัติ</dt>
                <dd className="text-3xl font-semibold text-gray-900">{pendingOrdersCount}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="ค้นหาหนังสือ..."
          />
        </div>
      </div>

      {/* Books Table */}
      {booksLoading ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <Loader className="mx-auto h-12 w-12 text-blue-600 animate-spin" />
          <p className="mt-3 text-gray-600">กำลังโหลดหนังสือ...</p>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  หนังสือ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ผู้แต่ง
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  หมวดหมู่
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ราคา
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  วันที่อัพโหลด
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery ? 'ไม่พบหนังสือที่ค้นหา' : 'ยังไม่มีหนังสือ'}
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <BookOpen className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                        <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{book.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">฿{book.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(book.uploaded_at).toLocaleDateString('th-TH')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteBook(book.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-6">
        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          กลับหน้าหลัก
        </button>
      </div>
    </div>
  )
}
