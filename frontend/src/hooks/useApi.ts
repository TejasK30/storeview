import { api } from "@/lib/services/api"
import { AxiosError } from "axios"
import { useCallback } from "react"
import { toast } from "sonner"

export const useApi = () => {
  const apiCall = useCallback(
    async (url: string, params?: URLSearchParams) => {
      try {
        const response = await api.get(`/admin${url}`, { params })
        return response.data
      } catch (error) {
        const msg =
          error instanceof AxiosError
            ? (error.response?.data?.message ?? "An unexpected error occurred")
            : "An unexpected error occurred"
        toast.error(msg)
      }
    },
    [],
  )

  return { apiCall }
}
