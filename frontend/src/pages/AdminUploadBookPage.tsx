import { useState } from 'react'
import { Upload, BookOpen, DollarSign, Image as ImageIcon, ArrowLeft, Tag } from 'lucide-react'
import { uploadFile } from '../lib/supabase'
import { useBooks } from '../hooks/useBooks'

interface AdminUploadBookPageProps {
  onNavigate: (page: string) => void
}

export default function AdminUploadBookPage({ onNavigate }: AdminUploadBookPageProps) {
  const { addBook } = useBooks()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('โปรแกรมมิ่ง')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string>('')
  const [uploading, setUploading] = useState(false)

  const categories = [
    'โปรแกรมมิ่ง',
    'ธุรกิจ',
    'การตลาด',
    'การออกแบบ',
    'วิทยาศาสตร์',
    'เทคโนโลยี',
    'จิตวิทยา',
    'การพัฒนาตนเอง'
  ]

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('กรุณาเลือกไฟล์รูปภาพ (JPG, PNG, etc.)')
        return
      }
      setCoverImage(file)

      // สร้าง preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('กรุณาเลือกไฟล์ PDF เท่านั้น')
        return
      }
      setPdfFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // ตรวจสอบข้อมูล
    if (!title || !author || !description || !price || !pdfFile || !coverImage) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน')
      return
    }

    if (parseFloat(price) <= 0) {
      alert('กรุณากำหนดราคาที่มากกว่า 0')
      return
    }

    setUploading(true)

    try {
      // 1. อัพโหลด PDF ไป Supabase Storage
      const timestamp = Date.now()
      const pdfFileName = `${timestamp}-${pdfFile.name}`
      const { url: pdfUrl, error: pdfError } = await uploadFile('book-files', pdfFile, pdfFileName)

      if (pdfError || !pdfUrl) {
        throw new Error('ไม่สามารถอัพโหลดไฟล์ PDF ได้: ' + pdfError?.message)
      }

      // 2. อัพโหลดรูปปกไป Supabase Storage
      const coverFileName = `${timestamp}-${coverImage.name}`
      const { url: coverUrl, error: coverError } = await uploadFile('book-covers', coverImage, coverFileName)

      if (coverError || !coverUrl) {
        throw new Error('ไม่สามารถอัพโหลดรูปปกได้: ' + coverError?.message)
      }

      // 3. บันทึกข้อมูลหนังสือลง database
      const { error: dbError } = await addBook({
        title,
        author,
        description,
        price: parseFloat(price),
        category,
        file_name: pdfFile.name,
        file_url: pdfUrl,
        cover_image_url: coverUrl
      })

      if (dbError) {
        throw new Error('ไม่สามารถบันทึกข้อมูลหนังสือได้: ' + dbError)
      }

      alert(`✅ เพิ่มหนังสือ "${title}" เรียบร้อยแล้ว!`)

      // Reset form
      setTitle('')
      setAuthor('')
      setDescription('')
      setPrice('')
      setCategory('โปรแกรมมิ่ง')
      setPdfFile(null)
      setCoverImage(null)
      setCoverPreview('')

      // กลับไป Admin
      onNavigate('admin')
    } catch (error) {
      alert(`❌ เกิดข้อผิดพลาด: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => onNavigate('admin')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          กลับ
        </button>
        <h2 className="text-3xl font-bold text-gray-900">เพิ่มหนังสือใหม่</h2>
        <p className="mt-2 text-gray-600">กรอกข้อมูลหนังสือและอัพโหลดไฟล์</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-8 space-y-6">
        {/* ชื่อหนังสือ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ชื่อหนังสือ <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="เช่น พื้นฐาน JavaScript สำหรับมือใหม่"
            required
          />
        </div>

        {/* ผู้แต่ง */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ผู้แต่ง <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="เช่น สมชาย ใจดี"
            required
          />
        </div>

        {/* รายละเอียด */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            รายละเอียดหนังสือ <span className="text-red-500">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="เขียนรายละเอียดหนังสือ เนื้อหาที่น่าสนใจ..."
            required
          />
        </div>

        {/* ราคา และ หมวดหมู่ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ราคา (บาท) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="1"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="299"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              หมวดหมู่ <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* อัพโหลดปกหนังสือ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            รูปปกหนังสือ <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <label htmlFor="cover-upload" className="mt-4 cursor-pointer block">
                    <span className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-500">
                      {coverImage ? 'เปลี่ยนรูปปก' : 'เลือกรูปปก'}
                    </span>
                    <input
                      id="cover-upload"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleCoverUpload}
                      required={!coverImage}
                    />
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    JPG, PNG, GIF (แนะนำ 400x600px)
                  </p>
                  {coverImage && (
                    <p className="mt-2 text-xs text-green-600">✓ {coverImage.name}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Preview */}
            {coverPreview && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">ตัวอย่างปก:</p>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={coverPreview}
                    alt="Preview"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* อัพโหลดไฟล์ PDF */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ไฟล์หนังสือ (PDF) <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <label htmlFor="pdf-upload" className="mt-4 cursor-pointer block">
                <span className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-500">
                  {pdfFile ? 'เปลี่ยนไฟล์ PDF' : 'เลือกไฟล์ PDF'}
                </span>
                <input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  className="sr-only"
                  onChange={handlePdfUpload}
                  required={!pdfFile}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                ไฟล์ PDF เท่านั้น (ไม่เกิน 150MB)
              </p>
              {pdfFile && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✓ {pdfFile.name} ({(pdfFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ปุ่มส่ง */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                กำลังอัพโหลด...
              </>
            ) : (
              <>
                <BookOpen className="h-5 w-5 mr-2" />
                เพิ่มหนังสือ
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
