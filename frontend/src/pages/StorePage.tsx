import { useState, useEffect } from 'react'
import { BookOpen, ShoppingCart, Search, Tag } from 'lucide-react'

interface Book {
  id: string
  title: string
  author: string
  description: string
  price: number
  coverImage?: string
  fileName: string
  fileUrl: string
  category: string
}

interface StorePageProps {
  onNavigate: (page: string) => void
  onAddToCart: (book: Book) => void
}

export default function StorePage({ onNavigate, onAddToCart }: StorePageProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด')

  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = () => {
    // โหลดหนังสือจาก localStorage (ในระบบจริงจะดึงจาก API)
    const storedBooks = localStorage.getItem('indiebook_store_books')
    if (storedBooks) {
      setBooks(JSON.parse(storedBooks))
    } else {
      // หนังสือตัวอย่าง
      const sampleBooks: Book[] = [
        {
          id: '1',
          title: 'พื้นฐาน JavaScript สำหรับมือใหม่',
          author: 'สมชาย ใจดี',
          description: 'เรียนรู้ JavaScript ตั้งแต่พื้นฐานจนถึงขั้นสูง',
          price: 299,
          category: 'โปรแกรมมิ่ง',
          fileName: 'javascript-basics.pdf',
          fileUrl: '/sample/javascript.pdf'
        },
        {
          id: '2',
          title: 'React ฉบับเข้าใจง่าย',
          author: 'สมหญิง โค้ดดี',
          description: 'สร้าง Web Application ด้วย React',
          price: 399,
          category: 'โปรแกรมมิ่ง',
          fileName: 'react-guide.pdf',
          fileUrl: '/sample/react.pdf'
        },
        {
          id: '3',
          title: 'การบริหารธุรกิจยุคดิจิทัล',
          author: 'ดร.วิทยา ธุรกิจดี',
          description: 'กลยุทธ์การทำธุรกิจในยุค Digital',
          price: 499,
          category: 'ธุรกิจ',
          fileName: 'digital-business.pdf',
          fileUrl: '/sample/business.pdf'
        }
      ]
      localStorage.setItem('indiebook_store_books', JSON.stringify(sampleBooks))
      setBooks(sampleBooks)
    }
  }

  const categories = ['ทั้งหมด', ...new Set(books.map(book => book.category))]

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'ทั้งหมด' || book.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleAddToCart = (book: Book) => {
    onAddToCart(book)
    alert(`เพิ่ม "${book.title}" ลงตระกร้าแล้ว!`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">ร้านหนังสืออิเล็กทรอนิกส์</h1>
        <p className="mt-3 text-lg text-gray-600">
          ค้นพบและซื้อหนังสือดิจิทัลคุณภาพสูง
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="ค้นหาหนังสือ ชื่อหนังสือ หรือชื่อผู้แต่ง..."
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">ไม่พบหนังสือ</h3>
          <p className="mt-1 text-sm text-gray-500">ลองค้นหาด้วยคำอื่นหรือเลือกหมวดหมู่อื่น</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Cover Image */}
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-white opacity-50" />
                </div>
              )}

              {/* Book Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Tag className="h-3 w-3 mr-1" />
                    {book.category}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600">
                  {book.title}
                </h3>

                <p className="text-sm text-gray-600 mb-3">
                  โดย {book.author}
                </p>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {book.description}
                </p>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-2xl font-bold text-blue-600">
                    ฿{book.price}
                  </div>
                  <button
                    onClick={() => handleAddToCart(book)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    เพิ่มลงตระกร้า
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
