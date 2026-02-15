import { useState, useEffect } from 'react'
import { User, Mail, LogOut, Loader, Save, ArrowLeft } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { signOut, updateProfile } from '../lib/auth'

interface ProfilePageProps {
  onNavigate: (page: string) => void
  onLogout: () => void
}

export default function ProfilePage({ onNavigate, onLogout }: ProfilePageProps) {
  const { user, refreshUser } = useAuth()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.name) {
      setName(user.name)
    }
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!name.trim()) {
      setError('กรุณากรอกชื่อ')
      return
    }

    setLoading(true)

    const { error: updateError } = await updateProfile({ name: name.trim() })

    setLoading(false)

    if (updateError) {
      setError('ไม่สามารถอัพเดทโปรไฟล์ได้')
      return
    }

    await refreshUser()
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  const handleLogout = async () => {
    if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
      await signOut()
      onLogout()
      onNavigate('home')
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('store')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            กลับ
          </button>
          <h1 className="text-3xl font-bold text-gray-900">โปรไฟล์ของฉัน</h1>
          <p className="mt-2 text-gray-600">จัดการข้อมูลส่วนตัวของคุณ</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
          <div className="flex items-center mb-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-blue-600" />
              </div>
            </div>
            <div className="ml-6">
              <h2 className="text-2xl font-bold text-gray-900">{user.name || 'ผู้ใช้'}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                ✓ อัพเดทโปรไฟล์สำเร็จ!
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ชื่อ-นามสกุล
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="กรอกชื่อของคุณ"
                />
              </div>
            </div>

            {/* Email Field (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                อีเมล
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">อีเมลไม่สามารถเปลี่ยนแปลงได้</p>
            </div>

            {/* Update Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  กำลังบันทึก...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  บันทึกการเปลี่ยนแปลง
                </>
              )}
            </button>
          </form>
        </div>

        {/* Account Actions */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">การจัดการบัญชี</h3>

          <div className="space-y-3">
            <button
              onClick={() => onNavigate('my-books')}
              className="w-full px-4 py-3 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-700">หนังสือของฉัน</span>
                <span className="text-gray-400">→</span>
              </div>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition-colors"
            >
              <LogOut className="h-5 w-5 mr-2" />
              ออกจากระบบ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
