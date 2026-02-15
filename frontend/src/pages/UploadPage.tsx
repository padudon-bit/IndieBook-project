import { useState } from 'react'
import { Upload } from 'lucide-react'

interface UploadPageProps {
  onNavigate: (page: 'home' | 'library' | 'upload' | 'reader') => void
  onUploadComplete: (bookId: string) => void
}

export default function UploadPage({ onNavigate, onUploadComplete }: UploadPageProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()

      // Store book info in localStorage
      const books = JSON.parse(localStorage.getItem('indiebook_books') || '[]')
      books.push({
        id: data.bookId,
        title: file.name.replace('.pdf', ''),
        fileName: file.name,
        fileUrl: data.fileUrl,
        uploadedAt: new Date().toISOString(),
        pageCount: data.pageCount || 0
      })
      localStorage.setItem('indiebook_books', JSON.stringify(books))

      alert('Book uploaded successfully!')
      onUploadComplete(data.bookId)
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload book. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Upload Your Book</h2>
        <p className="mt-2 text-gray-600">
          Upload a PDF file to add it to your library
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-8">
        <div
          className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className={`mx-auto h-12 w-12 ${dragActive ? 'text-blue-600' : 'text-gray-400'}`} />
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                {dragActive ? 'Drop your PDF here' : 'Drop your PDF here or click to browse'}
              </span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={handleFileInput}
                disabled={uploading}
              />
            </label>
            <p className="mt-1 text-xs text-gray-500">
              PDF files only, up to 50MB
            </p>
          </div>
          {uploading && (
            <div className="mt-4">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-600">Uploading...</p>
            </div>
          )}
        </div>

        <div className="mt-6">
          <button
            onClick={() => onNavigate('library')}
            className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Go to Library
          </button>
        </div>
      </div>
    </div>
  )
}
