import { SignupFormData } from "@/components/ui/signup-form"
import { api } from "./api"
import { loginFormType } from "@/components/ui/login-form"

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
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Registration failed",
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
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || "Login failed",
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
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Failed to fetch profile")
  }
}
