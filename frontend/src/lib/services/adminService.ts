import { api } from "@/lib/services/api"
import { toast } from "sonner"

export const getUsers = async (url: string, params?: Record<string, any>) => {
  try {
    const response = await api.get(`/admin${url}`, { params })
    return response.data
  } catch (error: any) {
    const message =
      error?.response?.data?.message || "An unexpected error occurred"
    toast(message)
    throw error
  }
}
