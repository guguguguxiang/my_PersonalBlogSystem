import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { Eye } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '@src/components/Header'
import { useAuth } from '@src/context/AuthContext'
import { deletePostAPI, getPostDetailAPI, type PostDetail as PostDetailType } from '@src/api/post'

function formatDate(input: string) {
  const date = new Date(input)
  if (Number.isNaN(date.getTime())) {
    return input
  }
  return format(date, 'yyyy年M月d日')
}

export default function PostDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [post, setPost] = useState<PostDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function fetchPostDetail() {
      if (!id || Number.isNaN(Number(id))) {
        setError('文章 ID 无效')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')
        const data = await getPostDetailAPI(Number(id))
        setPost(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : '获取文章详情失败'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchPostDetail()
  }, [id])

  const canManage = useMemo(() => {
    return Boolean(user && post && user.id === post.author_id)
  }, [user, post])

  const handleEdit = () => {
    if (!post) {
      return
    }
    navigate(`/write?id=${post.id}`)
  }

  const handleDelete = async () => {
    if (!post || deleting) {
      return
    }

    const confirmed = window.confirm('确认删除这篇文章吗？该操作不可撤销。')
    if (!confirmed) {
      return
    }

    try {
      setDeleting(true)
      await deletePostAPI(post.id)
      navigate('/', { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : '删除失败，请稍后重试'
      window.alert(message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      <main className="px-4 pb-12 pt-24 md:px-6">
        <article className="mx-auto w-full max-w-4xl">
          {loading ? <div className="rounded-xl border border-gray-100 bg-white p-6 text-sm text-gray-500">正在加载文章内容...</div> : null}

          {!loading && error ? <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-sm text-red-600">{error}</div> : null}

          {!loading && !error && post ? (
            <>
              <header className="mb-8 border-b border-gray-100 pb-8">
                <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-blue-700">{post.category_name}</span>
                  <span>{formatDate(post.created_at)}</span>
                  <span className="inline-flex items-center gap-1">
                    <Eye size={15} />
                    {post.views}
                  </span>
                  <span>作者：{post.author_name}</span>
                </div>

                <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-5xl">{post.title}</h1>

                {canManage ? (
                  <div className="mt-6 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-gray-400 hover:text-gray-900"
                    >
                      编辑
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleting}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
                    >
                      {deleting ? '删除中...' : '删除'}
                    </button>
                  </div>
                ) : null}
              </header>

              {post.cover ? (
                <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                  <img src={post.cover} alt={post.title} className="h-[420px] w-full object-cover" />
                </div>
              ) : null}

              <section className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-700">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </section>
            </>
          ) : null}
        </article>
      </main>
    </div>
  )
}
