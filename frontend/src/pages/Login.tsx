import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import bgImage from '@src/assets/IMG/background_image2.jpg'
import { loginAPI } from '@src/api/auth'
import { useAuth } from '@src/context/AuthContext'

interface LoginForm {
  username: string
  password: string
}

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState<LoginForm>({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const canSubmit = useMemo(() => {
    return form.username.trim().length > 0 && form.password.length > 0
  }, [form])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    try {
      setLoading(true)
      const result = await loginAPI({
        username: form.username.trim(),
        password: form.password,
      })

      login({
        token: result.token,
        user: result.user,
      })

      navigate('/', { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : '登录失败，请稍后重试'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <img
        src={bgImage}
        alt="login background"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-black/45" />

      <section className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-xl border border-gray-100 bg-white/60 p-8 shadow-xl backdrop-blur-md">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-gray-700">登录后继续管理你的博客内容。</p>

          {error ? <div className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</div> : null}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">用户名</label>
              <input
                value={form.username}
                onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 bg-white/80 px-3 py-2 text-gray-900 outline-none transition-all duration-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                placeholder="请输入用户名"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-800">密码</label>
              <input
                type="password"
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full rounded-lg border border-gray-300 bg-white/80 px-3 py-2 text-gray-900 outline-none transition-all duration-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                placeholder="请输入密码"
              />
            </div>

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-700">
            没有账号？
            <Link to="/register" className="ml-1 font-medium text-blue-600 transition-colors duration-300 hover:text-blue-700">
              去注册
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}
