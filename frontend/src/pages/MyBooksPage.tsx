import { BookOpen, Calendar, Loader } from 'lucide-react'
import { usePurchasedBooks } from '../hooks/useOrders'

interface MyBooksPageProps {
  onNavigate: (page: string) => void
  onOpenBook: (bookId: string) => void
  customerEmail?: string
}

export default function MyBooksPage({ onNavigate, onOpenBook, customerEmail = 'guest@example.com' }: MyBooksPageProps) {
  const { purchasedBooks, loading } = usePurchasedBooks(customerEmail)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">หนังสือของฉัน</h2>
        <p className="mt-2 text-gray-600">
          {purchasedBooks.length === 0
            ? 'คุณยังไม่มีหนังสือ เริ่มเลือกซื้อหนังสือกันเลย!'
            : `คุณมีหนังสือ ${purchasedBooks.length} เล่ม`}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <Loader className="mx-auto h-12 w-12 text-blue-600 animate-spin" />
          <p className="mt-3 text-gray-600">กำลังโหลดหนังสือของคุณ...</p>
        </div>
      ) : purchasedBooks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <BookOpen className="mx-auto h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">คุณยังไม่มีหนังสือ</h3>
          <p className="mt-2 text-sm text-gray-500">
            เลือกซื้อหนังสือที่คุณสนใจและเริ่มอ่านได้ทันที!
          </p>
          <button
            onClick={() => onNavigate('store')}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            เริ่มเลือกซื้อหนังสือ
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {purchasedBooks.map((item) => {
            const book = item.books
            if (!book) return null

            return (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
                onClick={() => onOpenBook(book.id)}
            >
                {/* Cover */}
                {book.cover_image_url ? (
                  <img
                    src={book.cover_image_url}
                    alt={book.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="h-48 bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-white opacity-50" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ ซื้อแล้ว
                  </span>
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600">
                    {book.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-3">โดย {book.author}</p>

                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Calendar className="h-3 w-3 mr-1" />
                    ซื้อเมื่อ {new Date(item.purchased_at).toLocaleDateString('th-TH')}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onOpenBook(book.id)
                    }}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    เปิดอ่าน
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Stats */}
      {purchasedBooks.length > 0 && (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">หนังสือทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{purchasedBooks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">ซื้อล่าสุด</p>
                <p className="text-sm font-medium text-gray-900">
                  {purchasedBooks.length > 0
                    ? new Date(purchasedBooks[0].purchased_at).toLocaleDateString('th-TH')
                    : '-'
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">💰</div>
              <div>
                <p className="text-sm text-gray-500">มูลค่าทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">
                  ฿{purchasedBooks.reduce((sum: number, item: any) => sum + (item.books?.price || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
