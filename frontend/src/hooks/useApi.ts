import { api } from "@/lib/services/api"
import { useCallback } from "react"
import { toast } from "sonner"
export const useApi = () => {
  const apiCall = useCallback(
    async (url: string, params?: Record<string, any>) => {
      try {
        const response = await api.get(`/admin${url}`, { params })
        return response.data
      } catch (error: any) {
        const message =
          error?.response?.data?.message || "An unexpected error occurred"
        toast(message)
        throw error
      }
    },
    []
  )

  return { apiCall }
}
