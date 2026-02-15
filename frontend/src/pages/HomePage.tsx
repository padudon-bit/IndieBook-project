import { BookOpen, Upload, Library } from 'lucide-react'

interface HomePageProps {
  onNavigate: (page: 'home' | 'library' | 'upload' | 'reader') => void
}

export default function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero Section */}
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Your Personal <span className="text-blue-600">eBook Library</span>
        </h2>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Upload, read, and manage your PDF books with a beautiful reading experience.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => onNavigate('library')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <Library className="mr-2 h-5 w-5" />
            Browse Library
          </button>
          <button
            onClick={() => onNavigate('upload')}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Upload className="mr-2 h-5 w-5" />
            Upload Book
          </button>
        </div>
      </div>

      {/* Features */}
      <div className="mt-24">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-sm border">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">PDF Reader</h3>
                <p className="mt-5 text-base text-gray-500">
                  Read your PDF books with a smooth, easy-to-use interface.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-sm border">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                  <Library className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Personal Library</h3>
                <p className="mt-5 text-base text-gray-500">
                  Organize and manage all your books in one beautiful interface.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8 shadow-sm border">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-md shadow-lg">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Easy Upload</h3>
                <p className="mt-5 text-base text-gray-500">
                  Simply drag and drop your PDF files to start reading instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
