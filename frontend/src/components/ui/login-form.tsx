"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { z } from "zod"
import { loginFormSchema } from "@/lib/schemas"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { login, getProfile } from "@/lib/services/authService"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"

export type loginFormType = z.infer<typeof loginFormSchema>

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { user, hasRole } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormType>({
    resolver: zodResolver(loginFormSchema),
    mode: "all",
  })

  useEffect(() => {
    if (user) {
      router.push(`/dashboard/${user.role}`)
    }
  }, [user])

  const { setUser } = useAuthContext()

  const onSubmit = async (data: loginFormType) => {
    setIsLoading(true)
    try {
      const res = await login(data)

      if (res.success) {
        try {
          const profile = await getProfile()
          setUser({
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            ...(profile.role === "store_owner" && {
              storeId: profile.store.id,
            }),
          })
          toast.success(`Success ${res.message}`)
          router.push(`/dashboard/${res.role}`)
        } catch (profileError) {
          console.error("Failed to fetch profile:", profileError)
          toast.error("Login successful but failed to load profile")
          router.push(`/dashboard/${res.role}`)
        }
      } else {
        toast.error(`Error ${res.message}`)
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  required
                  disabled={isLoading}
                />
                {errors.email && (
                  <span className="text-sm text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  required
                  disabled={isLoading}
                />
                {errors.password && (
                  <span className="text-sm text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
