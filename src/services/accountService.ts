import axiosInstance from '@/lib/axios'

export interface UpdateAccountData {
  name: string
}

export interface ChangePasswordData {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export interface UpdateAccountResponse {
  success: boolean
  message: string
  data: {
    _id: string
    name: string
    email: string
    avatar?: string | null
    token: string
    createdAt: string
    updatedAt: string
    __v: number
  }
}

export interface UploadAvatarResponse {
  success: boolean
  message: string
  data: {
    avatar: string
  }
}

export interface ChangePasswordResponse {
  success: boolean
  message: string
}

// Service xử lý account management
export const accountService = {
  // Cập nhật tên tài khoản
  async updateAccount(id: string, data: UpdateAccountData): Promise<UpdateAccountResponse> {
    const response = await axiosInstance.put<UpdateAccountResponse>(
      `/account/update/${id}`,
      data
    )
    
    // Cập nhật token mới và user info vào localStorage
    const { data: responseData } = response.data
    if (responseData.token) {
      localStorage.setItem('access_token', responseData.token)
      localStorage.setItem('user', JSON.stringify({
        id: responseData._id,
        name: responseData.name,
        email: responseData.email,
        avatar: responseData.avatar
      }))
    }
    
    return response.data
  },

  // Đổi mật khẩu
  async changePassword(id: string, data: ChangePasswordData): Promise<ChangePasswordResponse> {
    const response = await axiosInstance.put<ChangePasswordResponse>(
      `/account/change-password/${id}`,
      data
    )
    return response.data
  },

  // Upload avatar
  async uploadAvatar(formData: FormData): Promise<UploadAvatarResponse> {
    const response = await axiosInstance.post<UploadAvatarResponse>(
      '/account/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    
    // Cập nhật avatar vào localStorage
    const userJson = localStorage.getItem('user')
    if (userJson) {
      const user = JSON.parse(userJson)
      user.avatar = response.data.data.avatar
      localStorage.setItem('user', JSON.stringify(user))
    }
    
    return response.data
  },

  // Cập nhật avatar (URL)
  async updateAvatar(id: string, avatarUrl: string): Promise<UpdateAccountResponse> {
    const response = await axiosInstance.put<UpdateAccountResponse>(
      `/account/update-avatar/${id}`,
      { avatar: avatarUrl }
    )
    
    // Cập nhật avatar vào localStorage
    const userJson = localStorage.getItem('user')
    if (userJson) {
      const user = JSON.parse(userJson)
      user.avatar = response.data.data.avatar
      localStorage.setItem('user', JSON.stringify(user))
    }
    
    return response.data
  },
}
