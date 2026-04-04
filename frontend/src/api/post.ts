import http from '@src/utils/http'

export interface GetPostsParams {
  page?: number
  pageSize?: number
  keyword?: string
  categoryId?: number
}

export interface PostPayload {
  title: string
  content: string
  category_id: number
  tags?: string[]
  cover?: string
  status?: 'published' | 'draft'
}

export interface PostItem {
  id: number
  title: string
  content?: string
  cover: string | null
  tags: string | null
  views: number
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
  author_id: number
  author_name: string
  category_id: number
  category_name: string
}

export interface PostDetail {
  id: number
  title: string
  content: string
  cover: string | null
  tags: string | null
  views: number
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
  author_id: number
  author_name: string
  category_id: number
  category_name: string
}

export interface PostListResponse {
  list: PostItem[]
  total: number
  page: number
  pageSize: number
}

export async function getPostsAPI(params: GetPostsParams): Promise<PostListResponse> {
  return (await http.get('/posts', { params })) as PostListResponse
}

export async function getPostDetailAPI(id: number): Promise<PostDetail> {
  return (await http.get(`/posts/${id}`)) as PostDetail
}

export async function createPostAPI(payload: PostPayload): Promise<{ id: number }> {
  return (await http.post('/posts', payload)) as { id: number }
}

export async function updatePostAPI(id: number, payload: PostPayload): Promise<{ id: number }> {
  return (await http.put(`/posts/${id}`, payload)) as { id: number }
}

export async function deletePostAPI(id: number): Promise<{ id: number }> {
  return (await http.delete(`/posts/${id}`)) as { id: number }
}
