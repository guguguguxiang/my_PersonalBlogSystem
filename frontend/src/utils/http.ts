import type { AxiosError, InternalAxiosRequestConfig } from 'axios'
import axios from 'axios'

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export class ApiError extends Error {
  code: number

  constructor(code: number, message: string) {
    super(message)
    this.code = code
    this.name = 'ApiError'
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const TOKEN_KEY = 'token'

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // 中文注释：请求发出前自动附带本地 JWT，避免每个接口手动传 token
  const token = localStorage.getItem(TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

http.interceptors.response.use(
  (response) => {
    const result = response.data as ApiResponse<unknown>

    if (typeof result?.code === 'number') {
      if (result.code === 0) {
        return result.data
      }

      return Promise.reject(new ApiError(result.code, result.message || '请求失败'))
    }

    return response.data
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem('user')
      window.dispatchEvent(new Event('auth:logout'))
      window.location.href = '/login'
    }

    const message = error.response?.data?.message || error.message || '网络异常'
    return Promise.reject(new ApiError(error.response?.status ?? -1, message))
  },
)

export default http
