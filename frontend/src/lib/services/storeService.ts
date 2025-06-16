import {
  StoreRatingsResponse,
  DashboardSummary,
  StoresResponse,
  Review,
} from "../types"
import { api } from "./api"

export async function getStats() {
  const response = await api.get("/admin/stats")

  return response.data
}

// get store ratings for owner
export async function getStoreRatings(
  storeId: string,
  page = 1,
  limit = 10
): Promise<StoreRatingsResponse> {
  const res = await api.get(
    `/store/${storeId}/ratings?page=${page}&limit=${limit}`
  )

  console.log(res.data)
  return res.data
}

// get dashboard summary for owner
export async function getStoreDashboardSummary(
  storeId: string
): Promise<DashboardSummary> {
  const res = await api.get(`/store/overview`)
  return res.data
}

// get stores to display to user dashboard
export async function getStores({
  search = "",
  page = 1,
  limit = 10,
}: {
  search?: string
  page?: number
  limit?: number
}): Promise<StoresResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
  })

  const res = await api.get(`/store/getstores?${params}`)
  return res.data
}

// get user reviews
export const getUserReviews = async (
  userId: string,
  page: number,
  limit: number
): Promise<{ reviews: Review[] }> => {
  const res = await api.get(
    `/store/reviews/user/${userId}?page=${page}&limit=${limit}`
  )

  return res.data
}

// submit rating
export const submitRating = async (
  storeId: number,
  rating: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await api.post(`/store/reviews/submit`, {
      storeId,
      rating,
    })

    return res.data
  } catch (error: any) {
    const message = error.response?.data?.message || "Failed to submit rating"
    throw new Error(message)
  }
}

//update rating
export const updateRating = async (
  reviewId: number,
  rating: number,
  comment?: string
): Promise<any> => {
  const response = await api.put(`/store/reviews/edit`, {
    reviewId,
    rating,
  })

  return response.data
}
