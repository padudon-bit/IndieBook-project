import { Providers } from './components/Providers'
import { useState, useEffect } from 'react'
import { BookOpen, ShoppingCart, Library as LibraryIcon, Shield, Store, LogOut } from 'lucide-react'
import HomePage from './pages/HomePage'
import StorePage from './pages/StorePage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import MyBooksPage from './pages/MyBooksPage'
import ReaderPage from './pages/ReaderPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminPage from './pages/AdminPage'
import AdminOrdersPage from './pages/AdminOrdersPage'

type Page = 'home' | 'store' | 'cart' | 'checkout' | 'my-books' | 'reader' | 'admin-login' | 'admin' | 'admin-orders'

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
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)

  useEffect(() => {
    // ตรวจสอบ admin login status
    const adminLoggedIn = localStorage.getItem('admin_logged_in') === 'true'
    setIsAdminLoggedIn(adminLoggedIn)
  }, [])

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

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true)
    setCurrentPage('admin')
  }

  const handleAdminLogout = () => {
    if (confirm('ต้องการออกจากระบบหรือไม่?')) {
      localStorage.removeItem('admin_logged_in')
      localStorage.removeItem('admin_login_time')
      setIsAdminLoggedIn(false)
      setCurrentPage('home')
    }
  }

  const handleNavigate = (page: string) => {
    // ถ้าพยายามเข้าหน้า admin แต่ยังไม่ login
    if (page === 'admin' || page === 'admin-orders') {
      if (!isAdminLoggedIn) {
        setCurrentPage('admin-login')
        return
      }
    }
    setCurrentPage(page as Page)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />
      case 'store':
        return <StorePage onNavigate={handleNavigate} onAddToCart={addToCart} />
      case 'cart':
        return (
          <CartPage
            onNavigate={handleNavigate}
            cartItems={cartItems}
            onRemoveFromCart={removeFromCart}
            onCheckout={handleCheckout}
          />
        )
      case 'checkout':
        return (
          <CheckoutPage
            onNavigate={handleNavigate}
            cartItems={cartItems}
            onPaymentComplete={handlePaymentComplete}
          />
        )
      case 'my-books':
        return <MyBooksPage onNavigate={handleNavigate} onOpenBook={openReader} />
      case 'reader':
        return <ReaderPage bookId={selectedBookId} onNavigate={handleNavigate} />
      case 'admin-login':
        return <AdminLoginPage onLogin={handleAdminLogin} onNavigate={handleNavigate} />
      case 'admin':
        return <AdminPage onNavigate={handleNavigate} />
      case 'admin-orders':
        return <AdminOrdersPage onNavigate={handleNavigate} />
      default:
        return <HomePage onNavigate={handleNavigate} />
    }
  }

  const cartCount = cartItems.length

  return (
    <Providers>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        {currentPage !== 'admin-login' && (
          <header className="bg-white shadow-sm border-b sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavigate('home')}>
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <h1 className="text-2xl font-bold text-gray-900">IndieBook Shop</h1>
                </div>
                <nav className="flex space-x-2">
                  {!isAdminLoggedIn ? (
                    <>
                      <button
                        onClick={() => handleNavigate('store')}
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
                        onClick={() => handleNavigate('my-books')}
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
                        onClick={() => handleNavigate('cart')}
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
                        onClick={() => handleNavigate('admin-login')}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                          currentPage === 'admin' || currentPage === 'admin-orders'
                            ? 'bg-purple-50 text-purple-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Admin
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleNavigate('admin')}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                          currentPage === 'admin'
                            ? 'bg-purple-50 text-purple-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Dashboard
                      </button>
                      <button
                        onClick={() => handleNavigate('admin-orders')}
                        className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                          currentPage === 'admin-orders'
                            ? 'bg-purple-50 text-purple-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        คำสั่งซื้อ
                      </button>
                      <button
                        onClick={handleAdminLogout}
                        className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        ออกจากระบบ
                      </button>
                    </>
                  )}
                </nav>
              </div>
            </div>
          </header>
        )}

        {/* Main Content */}
        <main>
          {renderPage()}
        </main>
      </div>
    </Providers>
  )
}

export default App
