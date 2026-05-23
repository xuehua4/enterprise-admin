import { request } from './request'

export interface User {
  id: number
  username: string
  name: string
  email: string
  role: string
  status: 'active' | 'disabled'
  createdAt: string
}

export interface UserListParams {
  keyword?: string
  status?: string
  page?: number
  pageSize?: number
}

export interface UserListResponse {
  list: User[]
  total: number
}

export const userApi = {
  // Get user list
  getList(params: UserListParams): Promise<UserListResponse> {
    return request.get('/users', { params })
  },

  // Get user detail
  getDetail(id: number): Promise<User> {
    return request.get(`/users/${id}`)
  },

  // Create user
  create(data: Partial<User>): Promise<User> {
    return request.post('/users', data)
  },

  // Update user
  update(id: number, data: Partial<User>): Promise<User> {
    return request.put(`/users/${id}`, data)
  },

  // Delete user
  delete(id: number): Promise<void> {
    return request.delete(`/users/${id}`)
  },

  // Reset password
  resetPassword(id: number): Promise<void> {
    return request.post(`/users/${id}/reset-password`)
  }
}
