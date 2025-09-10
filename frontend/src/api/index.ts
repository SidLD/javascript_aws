import axios, { AxiosError, AxiosInstance } from 'axios'
import { auth } from '@/lib/auth'
import { EmployeeListResponse, IEmployee, EmployeeForm } from '@/types/employee.type'
import { LoginParams, RegisterUserParams } from '@/types/user.type'

const baseURL =
  (typeof window !== 'undefined' && (window as any).__API_BASE_URL__) || 'http://localhost:3000'

// Create Axios instance
const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

api.interceptors.request.use((config) => {
  const token = auth.getToken()
  if (token) {
    if (!config.headers) {
      ;(config as any).headers = {}
    }
    ;(config.headers as any).Authorization = `Bearer ${token}`
  }
  return config
})

export const loginAdmin = async (params: LoginParams): Promise<string> => {
  const { data } = await api.post('/users/login', params)
  if (data?.token) auth.storeToken(data.token)
  return data?.token
}

export const registerUser = async (params: RegisterUserParams): Promise<string> => {
  const { data } = await api.post('/users/register', params)
  if (data?.token) auth.storeToken(data.token)
  return data?.token
}

export const deleteUser = async (userId: string): Promise<void> => {
  await api.delete(`/users/${userId}`)
}

export const getEmployees = async (page = 1, limit = 10): Promise<EmployeeListResponse> => {
  try {
    const { data } = await api.get(`/employee?page=${page}&limit=${limit}`)
    return data
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Failed to fetch employees')
  }
}

export const getEmployeeById = async (id: string): Promise<IEmployee> => {
  try {
    const { data } = await api.get(`/employee/${id}`)
    return data
  } catch (err: any) {
    throw new Error(err.response?.data?.message || `Failed to fetch employee with ID ${id}`)
  }
}

export const updateEmployee = async (
  id: string,
  payload: Partial<IEmployee>,
): Promise<IEmployee> => {
  try {
    const { data } = await api.put(`/employee/${id}`, payload)
    return data
  } catch (err: any) {
    throw new Error(err.response?.data?.message || `Failed to update employee with ID ${id}`)
  }
}

export const deleteEmployee = async (id: string): Promise<void> => {
  try {
    await api.delete(`/employee/${id}`)
  } catch (err: any) {
    throw new Error(err.response?.data?.message || `Failed to delete employee with ID ${id}`)
  }
}

export const createEmployee = async (payload: EmployeeForm, file?: File): Promise<any> => {
  const formData = new FormData()
  Object.entries(payload).forEach(([k, v]) => {
    if (v !== undefined && v !== null) formData.append(k, String(v))
  })
  if (file) formData.append('file', file)
  const { data } = await api.post('/employee', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export default api
