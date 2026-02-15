import { useState, useEffect } from 'react'
import { BookOpen, Trash2, Search, BarChart3, Bookmark } from 'lucide-react'

interface Book {
  id: string
  title: string
  fileName: string
  fileUrl: string
  uploadedAt: string
  pageCount: number
}

interface LibraryPageProps {
  onNavigate: (page: 'home' | 'library' | 'upload' | 'reader') => void
  onOpenBook: (bookId: string) => void
}

export default function LibraryPage({ onNavigate, onOpenBook }: LibraryPageProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = () => {
    const storedBooks = localStorage.getItem('indiebook_books')
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks))
    }
  }

  const deleteBook = (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบหนังสือเล่มนี้?')) {
      const updatedBooks = books.filter(book => book.id !== bookId)
      setBooks(updatedBooks)
      localStorage.setItem('indiebook_books', JSON.stringify(updatedBooks))
    }
  }

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = books.reduce((sum, book) => sum + (book.pageCount || 0), 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">ห้องสมุดของฉัน</h2>
          <p className="mt-2 text-gray-600">
            {books.length === 0 ? 'ยังไม่มีหนังสือ อัพโหลดหนังสือเล่มแรกของคุณเพื่อเริ่มต้น!' : `มี ${books.length} เล่มในห้องสมุด`}
          </p>
        </div>
        <button
          onClick={() => setShowStats(!showStats)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          {showStats ? 'ซ่อนสถิติ' : 'แสดงสถิติ'}
        </button>
      </div>

      {/* Statistics */}
      {showStats && books.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">หนังสือทั้งหมด</p>
                <p className="text-2xl font-bold text-gray-900">{books.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">จำนวนหน้า</p>
                <p className="text-2xl font-bold text-gray-900">{totalPages}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <Bookmark className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-500">หน้าเฉลี่ย</p>
                <p className="text-2xl font-bold text-gray-900">
                  {books.length > 0 ? Math.round(totalPages / books.length) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {books.length > 0 && (
        <div className="mb-6">
          <div className="relative">
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
      )}

      {books.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">ยังไม่มีหนังสือ</h3>
          <p className="mt-1 text-sm text-gray-500">เริ่มต้นด้วยการอัพโหลดหนังสือ PDF</p>
          <div className="mt-6">
            <button
              onClick={() => onNavigate('upload')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              อัพโหลดหนังสือเล่มแรก
            </button>
          </div>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบหนังสือ</h3>
          <p className="mt-1 text-sm text-gray-500">ลองค้นหาด้วยคำอื่น</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              onClick={() => onOpenBook(book.id)}
              className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-3">
                      <BookOpen className="h-10 w-10 text-blue-600 flex-shrink-0" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 truncate group-hover:text-blue-600">
                      {book.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 truncate">
                      {book.fileName}
                    </p>
                    <p className="mt-2 text-xs text-gray-400">
                      อัพโหลดเมื่อ {new Date(book.uploadedAt).toLocaleDateString('th-TH')}
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteBook(book.id, e)}
                    className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="ลบหนังสือ"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => onOpenBook(book.id)}
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    อ่านหนังสือ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
