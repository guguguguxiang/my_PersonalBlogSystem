import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import Header from '@src/components/Header'
import Sidebar from '@src/components/Sidebar'
import { getPostsAPI, type PostItem } from '@src/api/post'

function formatDate(input: string) {
  const date = new Date(input)
  if (Number.isNaN(date.getTime())) {
    return input
  }
  return format(date, 'M月d日')
}

function getSummary(post: PostItem) {
  if (post.content && post.content.trim()) {
    return post.content.slice(0, 140)
  }

  return `这是一篇关于「${post.category_name}」的文章，聚焦实战经验与方法论，帮助你快速建立系统化认知。`
}

export default function Home() {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getPostsAPI({ page: 1, pageSize: 10 })
        setPosts(data.list)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl gap-12 px-4 pb-12 pt-24 md:px-6 lg:px-8">
        <section className="w-full md:w-[68%]">
          {loading ? (
            <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-500">正在加载文章...</div>
          ) : (
            <div className="space-y-10">
              {posts.map((post) => (
                <article key={post.id} className="rounded-2xl border border-transparent p-2 transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-100 hover:bg-white/80">
                  <div className="mb-4 flex items-center gap-3 text-sm text-gray-600">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-500" />
                    <span className="font-medium text-gray-800">{post.author_name}</span>
                    <span>·</span>
                    <span>{formatDate(post.created_at)}</span>
                  </div>

                  <Link to={`/post/${post.id}`} className="group block">
                    <h2 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-blue-700">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="mt-4 text-xl leading-9 text-gray-600">{getSummary(post)}</p>

                  {post.cover ? (
                    <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                      <img src={post.cover} alt={post.title} className="h-72 w-full object-cover" />
                    </div>
                  ) : null}

                  <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                    <span className="rounded-full bg-gray-100 px-3 py-1">{post.category_name}</span>
                    <span>{Math.max(1, Math.ceil(getSummary(post).length / 80))} min read</span>
                    <span className="inline-flex items-center gap-1">
                      <Eye size={15} />
                      {post.views}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside className="hidden md:block md:w-[32%]">
          <Sidebar />
        </aside>
      </main>
    </div>
  )
}
