import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight, ArrowLeft, ZoomIn, ZoomOut } from 'lucide-react'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface ReaderPageProps {
  bookId: string | null
  onNavigate: (page: 'home' | 'library' | 'upload' | 'reader') => void
}

export default function ReaderPage({ bookId, onNavigate }: ReaderPageProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [book, setBook] = useState<any>(null)

  useEffect(() => {
    if (bookId) {
      const books = JSON.parse(localStorage.getItem('indiebook_books') || '[]')
      const foundBook = books.find((b: any) => b.id === bookId)
      setBook(foundBook)
    }
  }, [bookId])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    setPageNumber(1)
  }

  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(1, prev - 1))
  }

  const goToNextPage = () => {
    setPageNumber(prev => Math.min(numPages, prev + 1))
  }

  const zoomIn = () => {
    setScale(prev => Math.min(2.0, prev + 0.1))
  }

  const zoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.1))
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-gray-600">ไม่พบหนังสือ</p>
        <button
          onClick={() => onNavigate('library')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          กลับไปห้องสมุด
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Reader Controls */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-16 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => onNavigate('library')}
              className="flex items-center text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              กลับ
            </button>

            <div className="flex-1 text-center">
              <h3 className="text-white font-medium truncate max-w-md mx-auto">
                {book.title}
              </h3>
            </div>

            <div className="flex items-center space-x-4">
              {/* Zoom Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={zoomOut}
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                  title="ซูมออก"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-gray-300 text-sm">{Math.round(scale * 100)}%</span>
                <button
                  onClick={zoomIn}
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                  title="ซูมเข้า"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
              </div>

              {/* Page Navigation */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPrevPage}
                  disabled={pageNumber <= 1}
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-gray-300 text-sm">
                  {pageNumber} / {numPages || '?'}
                </span>
                <button
                  onClick={goToNextPage}
                  disabled={pageNumber >= numPages}
                  className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex justify-center items-start py-8 px-4">
        <div className="bg-white shadow-2xl">
          <Document
            file={book.fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center h-96 w-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            }
            error={
              <div className="flex items-center justify-center h-96 w-96 text-red-600">
                ไม่สามารถโหลด PDF ได้
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </Document>
        </div>
      </div>
    </div>
  )
}
