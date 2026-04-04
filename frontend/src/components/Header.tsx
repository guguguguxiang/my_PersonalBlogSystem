import { Link } from 'react-router-dom'
import { PenSquare } from 'lucide-react'
import { useAuth } from '@src/context/AuthContext'

const NAV_ITEMS = ['最新文章', '专栏系列', '关于作者']

export default function Header() {
  const { user } = useAuth()

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-gray-900">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gray-900 text-xs font-bold text-white">Y</div>
          <span className="text-xl font-bold tracking-tight">我的技术周刊</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-gray-600 md:flex">
          {NAV_ITEMS.map((item) => (
            <a key={item} href="#" className="transition-colors duration-300 hover:text-gray-900">
              {item}
            </a>
          ))}
        </nav>

        {user ? (
          <div className="flex items-center gap-3">
            <Link
              to="/write"
              className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-300 hover:text-gray-900"
            >
              <PenSquare size={16} />
              写文章
            </Link>

            <Link to="/profile" className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors duration-300 hover:bg-gray-100">
              <div className="grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-gray-900 text-xs font-semibold text-white">
                {user.avatar ? <img src={user.avatar} alt={user.username} className="h-full w-full object-cover" /> : user.username.slice(0, 1).toUpperCase()}
              </div>
              <span className="hidden text-sm font-medium text-gray-800 sm:block">{user.username}</span>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-gray-900">
              登录
            </Link>
            <button className="rounded-full bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600">
              订阅更新
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
