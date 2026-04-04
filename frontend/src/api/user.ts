import http from '@src/utils/http'

export interface UploadImageResponse {
  url: string
}

export interface UpdateProfileRequest {
  username: string
  avatar?: string
}

export interface UserProfile {
  id: number
  username: string
  email: string
  avatar?: string | null
}

export interface UpdateProfileResponse {
  user: UserProfile
}

export async function uploadImageAPI(file: File): Promise<UploadImageResponse> {
  const formData = new FormData()
  formData.append('file', file)

  return (await http.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })) as UploadImageResponse
}

export async function updateProfileAPI(payload: UpdateProfileRequest): Promise<UpdateProfileResponse> {
  return (await http.put('/users/profile', payload)) as UpdateProfileResponse
}
