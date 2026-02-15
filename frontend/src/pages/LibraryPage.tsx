import { useState, useEffect } from 'react'
import { BookOpen, Trash2 } from 'lucide-react'

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
    if (confirm('Are you sure you want to delete this book?')) {
      const updatedBooks = books.filter(book => book.id !== bookId)
      setBooks(updatedBooks)
      localStorage.setItem('indiebook_books', JSON.stringify(updatedBooks))
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">My Library</h2>
        <p className="mt-2 text-gray-600">
          {books.length === 0 ? 'No books yet. Upload your first book to get started!' : `${books.length} book${books.length > 1 ? 's' : ''} in your library`}
        </p>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No books</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by uploading a PDF book.</p>
          <div className="mt-6">
            <button
              onClick={() => onNavigate('upload')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Upload your first book
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
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
                      Uploaded {new Date(book.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => deleteBook(book.id, e)}
                    className="ml-2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete book"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => onOpenBook(book.id)}
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Read Book
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
