import { SignupFormData } from "@/components/ui/signup-form"
import { api } from "./api"
import { loginFormType } from "@/components/ui/login-form"
import { AxiosError } from "axios"

export const register = async (data: SignupFormData) => {
  try {
    const response = await api.post("/auth/register", data)

    if (response.status === 201 || response.status === 200) {
      return {
        success: true,
        message: response.data?.message || "Registration successful",
      }
    } else {
      return {
        success: false,
        message: "Unexpected response status",
      }
    }
  } catch (error) {
    const axiosError = error instanceof AxiosError ? error : null
    return {
      success: false,
      message: axiosError?.response?.data?.message ?? "Registration failed",
      error,
    }
  }
}

export const login = async (data: loginFormType) => {
  try {
    const response = await api.post("/auth/login", data)

    if (response.status === 201 || response.status === 200) {
      return {
        success: true,
        message: response.data?.message || "Login successful",
        role: response.data.role,
      }
    } else {
      return {
        success: false,
        message: "Unexpected response status",
      }
    }
  } catch (error) {
    const axiosError = error instanceof AxiosError ? error : null
    return {
      success: false,
      message: axiosError?.response?.data?.message ?? "Login failed",
      error,
    }
  }
}

export const getProfile = async () => {
  try {
    const res = await api.get("/auth/profile", {
      withCredentials: true,
    })

    return res.data.user
  } catch (error) {
    if (error instanceof AxiosError && error.response?.status === 401) {
      return null
    }
    console.log(error)
  }
}