import { api } from "@/lib/services/api"
import { AxiosError } from "axios"
import { toast } from "sonner"

export const getUsers = async (url: string, params?: URLSearchParams) => {
  try {
    const response = await api.get(`${url}`, { params })
    return response.data
  } catch (error) {
    const msg =
      error instanceof AxiosError
        ? (error.response?.data?.message ?? "An unexpected error occurred")
        : "An unexpected error occurred"
    toast.error(msg)
  }
}
