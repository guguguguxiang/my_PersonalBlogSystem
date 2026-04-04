import http from '@src/utils/http'

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface RegisterResponseData {
  id: number
  username: string
  email: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthUser {
  id: number
  username: string
  email: string
  avatar?: string | null
}

export interface LoginResponseData {
  token: string
  user: AuthUser
}

export async function registerAPI(payload: RegisterRequest): Promise<RegisterResponseData> {
  return (await http.post('/auth/register', payload)) as RegisterResponseData
}

export async function loginAPI(payload: LoginRequest): Promise<LoginResponseData> {
  return (await http.post('/auth/login', payload)) as LoginResponseData
}
