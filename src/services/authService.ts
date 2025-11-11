import axiosInstance from '@/lib/axios'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    _id: string
    name: string
    email: string
    avatar?: string | null
    token: string
    refresh_token?: string
    role?: string | null
    createdAt: string
    updatedAt: string
    __v: number
  }
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string | null
}

// Service xử lý authentication
export const authService = {
  // Đăng nhập
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>('/account/login', credentials)
    
    // Lưu token và user info vào localStorage
    const { data } = response.data
    localStorage.setItem('access_token', data.token)
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token)
    }
    localStorage.setItem('user', JSON.stringify({
      id: data._id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      role: data.role ?? null
    }))
    
    return response.data
  },

  // Đăng ký
  async register(registerData: RegisterData): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>('/account/register', registerData)
    
    // Lưu token và user info vào localStorage
    const { data } = response.data
    localStorage.setItem('access_token', data.token)
    if (data.refresh_token) {
      localStorage.setItem('refresh_token', data.refresh_token)
    }
    localStorage.setItem('user', JSON.stringify({
      id: data._id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
      role: data.role ?? null
    }))
    
    return response.data
  },

  // Đăng xuất
  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/auth/logout')
    } finally {
      // Xóa tokens và user info
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }
  },

  // Lấy thông tin user hiện tại
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem('user')
    return userJson ? JSON.parse(userJson) : null
  },

  // Kiểm tra user đã đăng nhập chưa
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token')
  },

  // Refresh token
  async refreshToken(): Promise<string> {
    const refreshToken = localStorage.getItem('refresh_token')
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await axiosInstance.post<{ access_token: string }>('/auth/refresh', {
      refresh_token: refreshToken,
    })

    const { access_token } = response.data
    localStorage.setItem('access_token', access_token)
    
    return access_token
  },

  // Quên mật khẩu
  async forgotPassword(email: string): Promise<void> {
    await axiosInstance.post('/auth/forgot-password', { email })
  },

  // Reset mật khẩu
  async resetPassword(token: string, password: string): Promise<void> {
    await axiosInstance.post('/auth/reset-password', { token, password })
  },
}
