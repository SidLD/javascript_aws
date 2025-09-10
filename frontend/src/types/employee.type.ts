export interface IEmployee {
  _id: string
  title: string
  createdAt: string
  updatedAt: string
  country: string
  accountType: string
  username: string
  lastName: string
  firstName: string
  email: string
  contact: string
  photo: string | null
}
export interface EmployeeForm {
  country: string
  accountType: string
  username: string
  lastName: string
  firstName: string
  email: string
  contact: string
  photo: string
}

export interface EmployeeListResponse {
  data: IEmployee[]
  pagination: {
    total: number
    page: number
    pages: number
  }
}