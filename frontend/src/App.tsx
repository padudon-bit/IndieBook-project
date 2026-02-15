import { Providers } from './components/Providers'
import { useState } from 'react'
import { BookOpen, Upload, Library, Home } from 'lucide-react'
import HomePage from './pages/HomePage'
import LibraryPage from './pages/LibraryPage'
import UploadPage from './pages/UploadPage'
import ReaderPage from './pages/ReaderPage'

type Page = 'home' | 'library' | 'upload' | 'reader'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)

  const openReader = (bookId: string) => {
    setSelectedBookId(bookId)
    setCurrentPage('reader')
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />
      case 'library':
        return <LibraryPage onNavigate={setCurrentPage} onOpenBook={openReader} />
      case 'upload':
        return <UploadPage onNavigate={setCurrentPage} onUploadComplete={openReader} />
      case 'reader':
        return <ReaderPage bookId={selectedBookId} onNavigate={setCurrentPage} />
      default:
        return <HomePage onNavigate={setCurrentPage} />
    }
  }

  return (
    <Providers>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentPage('home')}>
                <BookOpen className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">IndieBook</h1>
              </div>
              <nav className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage('home')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 'home'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Home className="h-4 w-4 mr-1" />
                  Home
                </button>
                <button
                  onClick={() => setCurrentPage('library')}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    currentPage === 'library'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Library className="h-4 w-4 mr-1" />
                  Library
                </button>
                <button
                  onClick={() => setCurrentPage('upload')}
                  className="flex items-center bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium"
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Upload
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
