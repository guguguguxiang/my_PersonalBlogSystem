import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import bgImage from '@src/assets/IMG/background_image1.png'
import { registerAPI } from '@src/api/auth'

interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState<RegisterForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const canSubmit = useMemo(() => {
    return (
      form.username.trim().length >= 3 &&
      form.username.trim().length <= 20 &&
      form.email.trim().length > 0 &&
      form.password.length >= 6 &&
      form.confirmPassword.length >= 6
    )
  }, [form])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (form.username.trim().length < 3 || form.username.trim().length > 20) {
      setError('用户名需为 3-20 位')
      return
    }

    if (form.password.length < 6) {
      setError('密码长度不能少于 6 位')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    try {
      setLoading(true)
      await registerAPI({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      })
      setSuccess('注册成功')
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 700)
    } catch (err) {
      const message = err instanceof Error ? err.message : '注册失败，请稍后重试'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <img
        src={bgImage}
        alt="register background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white/60 p-8 shadow-xl backdrop-blur-md">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Create Account</h1>
          <p className="mt-2 text-sm text-gray-700">创建你的博客作者账号，开始发布内容。</p>

          {error ? <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div> : null}
          {success ? (
            <div className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-600">{success}</div>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">用户名（3-20位）</label>
              <input
                value={form.username}
                onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 bg-white/80 px-3 py-2 text-gray-900 outline-none transition-all duration-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                placeholder="请输入用户名"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">邮箱</label>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 bg-white/80 px-3 py-2 text-gray-900 outline-none transition-all duration-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                placeholder="请输入邮箱"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">密码（至少6位）</label>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 bg-white/80 px-3 py-2 text-gray-900 outline-none transition-all duration-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                placeholder="请输入密码"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">确认密码</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 bg-white/80 px-3 py-2 text-gray-900 outline-none transition-all duration-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                placeholder="请再次输入密码"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {loading ? '注册中...' : '注册'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-700">
            已有账号？
            <Link to="/login" className="ml-1 font-medium text-blue-600 transition-colors duration-300 hover:text-blue-700">
              去登录
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
