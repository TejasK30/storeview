export interface Stats {
  totalUsers: number
  totalStores: number
  totalRatings: number
}

export interface User {
  id: number
  name: string
  email: string
  role: "user" | "store_owner" | "system_admin"
  address: string
  createdAt: string
}

export interface Store {
  id: number
  name: string
  email: string
  address: string
  averageRating: number
  totalRatings: number
  createdAt: string
  owner: {
    name: string
    email: string
  }
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalCount: number
  hasMore: boolean
  limit: number
}

export interface UsersResponse {
  users: User[]
  pagination: PaginationInfo
}

export interface StoresResponse {
  stores: Store[]
  pagination: PaginationInfo
}

export interface UserFilters {
  search: string
  role: string
  sortBy: keyof User
  sortOrder: "asc" | "desc"
}

export interface StoreFilters {
  search: string
  minRating: number
  sortBy: keyof Store
  sortOrder: "asc" | "desc"
}

export interface CreateUserData {
  name: string
  email: string
  password: string
  address: string
  role: "user" | "store_owner" | "system_admin"
}

export interface CreateStoreData {
  name: string
  email: string
  address: string
  ownerId: number
}

export interface PotentialOwner {
  id: number
  name: string
  email: string
}
