import { Providers } from './components/Providers'
import { useState } from 'react'
import { BookOpen, ShoppingCart, Library as LibraryIcon, Shield, Store } from 'lucide-react'
import HomePage from './pages/HomePage'
import StorePage from './pages/StorePage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import MyBooksPage from './pages/MyBooksPage'
import ReaderPage from './pages/ReaderPage'
import AdminPage from './pages/AdminPage'

type Page = 'home' | 'store' | 'cart' | 'checkout' | 'my-books' | 'reader' | 'admin'

interface CartItem {
  id: string
  title: string
  author: string
  price: number
  quantity: number
  fileName: string
  fileUrl: string
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  const openReader = (bookId: string) => {
    setSelectedBookId(bookId)
    setCurrentPage('reader')
  }

  const addToCart = (book: any) => {
    const existingItem = cartItems.find(item => item.id === book.id)
    if (existingItem) {
      alert('หนังสือเล่มนี้อยู่ในตระกร้าแล้ว')
      return
    }

    setCartItems([...cartItems, {
      id: book.id,
      title: book.title,
      author: book.author,
      price: book.price,
      quantity: 1,
      fileName: book.fileName,
      fileUrl: book.fileUrl
    }])
  }

  const removeFromCart = (bookId: string) => {
    setCartItems(cartItems.filter(item => item.id !== bookId))
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('ตระกร้าของคุณว่างเปล่า')
      return
    }
    setCurrentPage('checkout')
  }

  const handlePaymentComplete = () => {
    setCartItems([])
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />
      case 'store':
        return <StorePage onNavigate={setCurrentPage} onAddToCart={addToCart} />
      case 'cart':
        return (
          <CartPage
            onNavigate={setCurrentPage}
            cartItems={cartItems}
            onRemoveFromCart={removeFromCart}
            onCheckout={handleCheckout}
          />
        )
      case 'checkout':
        return (
          <CheckoutPage
            onNavigate={setCurrentPage}
            cartItems={cartItems}
            onPaymentComplete={handlePaymentComplete}
          />
        )
      case 'my-books':
        return <MyBooksPage onNavigate={setCurrentPage} onOpenBook={openReader} />
      case 'reader':
        return <ReaderPage bookId={selectedBookId} onNavigate={setCurrentPage} />
      case 'admin':
        return <AdminPage onNavigate={setCurrentPage} />
      default:
        return <HomePage onNavigate={setCurrentPage} />
    }
  }

  const cartCount = cartItems.length

  return (
    <Providers>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
                <BookOpen className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">IndieBook Shop</h1>
              </div>
              <nav className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage('store')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 'store'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Store className="h-4 w-4 mr-1" />
                  ร้านค้า
                </button>
                <button
                  onClick={() => setCurrentPage('my-books')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 'my-books'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <LibraryIcon className="h-4 w-4 mr-1" />
                  หนังสือของฉัน
                </button>
                <button
                  onClick={() => setCurrentPage('cart')}
                  className="flex items-center bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium relative"
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  ตระกร้า
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setCurrentPage('admin')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 'admin'
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Shield className="h-4 w-4 mr-1" />
                  ผู้ดูแล
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          {renderPage()}
        </main>
      </div>
    </Providers>
  )
}

export default App
