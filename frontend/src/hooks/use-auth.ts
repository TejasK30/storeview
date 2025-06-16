import { useAuthContext } from "@/contexts/auth-context"

export const useAuth = () => {
  const { user, loading, logout, isAuthenticated } = useAuthContext()

  const hasRole = (role: "user" | "store_owner" | "system_admin"): boolean => {
    if (loading || !user) {
      return false
    }

    return user.role === role
  }

  return {
    user,
    loading,
    logout,
    isAuthenticated,
    hasRole,
  }
}
