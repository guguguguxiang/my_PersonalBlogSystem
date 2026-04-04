import { Camera } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Header from '@src/components/Header'
import { updateProfileAPI, uploadImageAPI } from '@src/api/user'
import { useAuth } from '@src/context/AuthContext'

type ToastType = 'success' | 'error'

export default function Profile() {
  const { user, updateUserInfo } = useAuth()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [username, setUsername] = useState(user?.username ?? '')
  const [avatar, setAvatar] = useState(user?.avatar ?? '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null)

  useEffect(() => {
    if (!toast) {
      return
    }

    const timer = window.setTimeout(() => {
      setToast(null)
    }, 2500)

    return () => window.clearTimeout(timer)
  }, [toast])

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message })
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    try {
      setUploading(true)
      const result = await uploadImageAPI(file)
      setAvatar(result.url)
      showToast('success', '头像上传成功')
    } catch (err) {
      const message = err instanceof Error ? err.message : '头像上传失败'
      showToast('error', message)
    } finally {
      setUploading(false)
      event.target.value = ''
    }
  }

  const handleSave = async () => {
    if (!user || saving) {
      return
    }

    try {
      setSaving(true)
      const result = await updateProfileAPI({
        username: username.trim(),
        avatar,
      })
      updateUserInfo(result.user)
      showToast('success', '保存成功')
    } catch (err) {
      const message = err instanceof Error ? err.message : '保存失败，请稍后重试'
      showToast('error', message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      <main className="mx-auto w-full max-w-3xl px-4 pb-10 pt-24 md:px-6">
        <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
          <div className="mb-8 flex flex-col items-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group relative h-32 w-32 overflow-hidden rounded-full border border-gray-200"
            >
              {avatar ? (
                <img src={avatar} alt={username || 'avatar'} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center bg-gray-900 text-3xl font-semibold text-white">
                  {(username || user?.username || 'U').slice(0, 1).toUpperCase()}
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition-all duration-300 group-hover:bg-black/45 group-hover:opacity-100">
                {uploading ? <span className="text-sm">上传中...</span> : <Camera size={24} />}
              </div>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            <p className="mt-3 text-sm text-gray-500">点击头像更换图片（最大 5MB）</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">邮箱（不可修改）</label>
              <input
                value={user?.email ?? ''}
                readOnly
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-gray-500 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">用户名</label>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-gray-800 outline-none transition-all duration-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                placeholder="请输入新用户名"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving || uploading}
            className="mt-8 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {saving ? '保存中...' : '保存修改'}
          </button>
        </section>
      </main>

      {toast ? (
        <div
          className={`fixed right-4 top-20 z-[60] rounded-lg px-4 py-2 text-sm text-white shadow-lg ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      ) : null}
    </div>
  )
}
