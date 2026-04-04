import { useEffect, useMemo, useState, type FormEvent } from 'react'
import ReactMarkdown from 'react-markdown'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Header from '@src/components/Header'
import { useAuth } from '@src/context/AuthContext'
import {
  createPostAPI,
  getPostDetailAPI,
  updatePostAPI,
  type PostPayload,
} from '@src/api/post'

interface WriteForm {
  title: string
  categoryId: string
  tags: string
  cover: string
  content: string
}

const CATEGORY_OPTIONS = [
  { id: 1, name: '前端开发' },
  { id: 2, name: '后端开发' },
  { id: 3, name: '系统架构' },
]

function parseTags(tagsText: string): string[] {
  return tagsText
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function normalizeTags(tags: unknown): string {
  if (Array.isArray(tags)) {
    return tags.filter((item): item is string => typeof item === 'string').join(', ')
  }

  if (typeof tags === 'string' && tags.trim()) {
    try {
      const parsed = JSON.parse(tags) as unknown
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string').join(', ')
      }
      return tags
    } catch {
      return tags
    }
  }

  return ''
}

export default function Write() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  const editId = searchParams.get('id')
  const isEditMode = Boolean(editId)

  const [form, setForm] = useState<WriteForm>({
    title: '',
    categoryId: '1',
    tags: '',
    cover: '',
    content: '',
  })
  const [loading, setLoading] = useState(false)
  const [initLoading, setInitLoading] = useState(isEditMode)
  const [error, setError] = useState('')

  useEffect(() => {
    async function initEditData() {
      if (!editId) {
        setInitLoading(false)
        return
      }

      const id = Number(editId)
      if (!Number.isInteger(id) || id <= 0) {
        setError('文章 ID 无效')
        setInitLoading(false)
        return
      }

      try {
        const detail = await getPostDetailAPI(id)

        if (!user || user.id !== detail.author_id) {
          setError('你没有权限编辑这篇文章')
          return
        }

        setForm({
          title: detail.title,
          categoryId: String(detail.category_id),
          tags: normalizeTags(detail.tags),
          cover: detail.cover ?? '',
          content: detail.content,
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : '加载文章失败'
        setError(message)
      } finally {
        setInitLoading(false)
      }
    }

    initEditData()
  }, [editId, user])

  const submitLabel = isEditMode ? '更新' : '发布'

  const canSubmit = useMemo(() => {
    return form.title.trim().length > 0 && form.content.trim().length > 0 && Number(form.categoryId) > 0
  }, [form])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!canSubmit || loading) {
      return
    }

    setError('')

    const payload: PostPayload = {
      title: form.title.trim(),
      content: form.content,
      category_id: Number(form.categoryId),
      tags: parseTags(form.tags),
      cover: form.cover.trim(),
      status: 'published',
    }

    try {
      setLoading(true)

      if (isEditMode && editId) {
        const result = await updatePostAPI(Number(editId), payload)
        navigate(`/post/${result.id}`, { replace: true })
        return
      }

      const result = await createPostAPI(payload)
      navigate(`/post/${result.id}`, { replace: true })
    } catch (err) {
      const message = err instanceof Error ? err.message : `${submitLabel}失败，请稍后重试`
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Header />

      <main className="mx-auto w-full max-w-7xl px-4 pb-6 pt-24 md:px-6 lg:px-8">
        {initLoading ? <div className="rounded-lg border border-gray-100 bg-white px-4 py-3 text-sm text-gray-500">正在加载文章数据...</div> : null}

        {!initLoading && error ? <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

        {!initLoading && (!isEditMode || !error || error !== '你没有权限编辑这篇文章') ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <section className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <input
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  placeholder="请输入文章标题..."
                  className="w-full flex-1 border-none bg-transparent text-3xl font-semibold tracking-tight text-gray-900 outline-none placeholder:text-gray-300"
                />

                <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
                  <select
                    value={form.categoryId}
                    onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-all duration-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  >
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.name}
                      </option>
                    ))}
                  </select>

                  <button
                    type="submit"
                    disabled={!canSubmit || loading}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                  >
                    {loading ? `${submitLabel}中...` : submitLabel}
                  </button>
                </div>
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <input
                  value={form.tags}
                  onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
                  placeholder="标签（多个标签请用逗号分隔）"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-all duration-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
                <input
                  value={form.cover}
                  onChange={(event) => setForm((prev) => ({ ...prev, cover: event.target.value }))}
                  placeholder="封面图 URL（可选）"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition-all duration-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </section>

            <section className="grid h-[calc(100vh-120px)] grid-cols-1 gap-4 md:grid-cols-2">
              <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
                <textarea
                  value={form.content}
                  onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value }))}
                  placeholder="# 在这里输入 Markdown 内容\n\n例如：\n- 技术总结\n- 项目复盘\n- 架构思考"
                  className="h-full w-full resize-none border-none bg-transparent p-4 font-mono text-sm leading-7 text-gray-800 outline-none"
                />
              </div>

              <div className="overflow-y-auto rounded-xl border border-gray-100 bg-white p-4">
                <article className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700">
                  <ReactMarkdown>{form.content || '## 实时预览\n\n开始输入内容后，这里会实时显示渲染效果。'}</ReactMarkdown>
                </article>
              </div>
            </section>
          </form>
        ) : null}
      </main>
    </div>
  )
}
