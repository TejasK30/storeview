"use client"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { signupSchema } from "@/lib/schemas"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { register as registerUser } from "@/lib/services/authService"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export type SignupFormData = z.infer<typeof signupSchema>
export default function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [role, setRole] = useState<SignupFormData["role"]>("user")
  const router = useRouter()
  const { user } = useAuth()

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push(`/dashboard/${user.role}`)
    }
  }, [user])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "user" },
    mode: "all",
  })

  const onSubmit = async (data: SignupFormData) => {
    const res = await registerUser(data)
    if (res.success) {
      toast.success(res.message)
      router.push("/login")
    } else {
      toast.error(res.message)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-3">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="123 Main St"
                {...register("address")}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="role">Select Role</Label>
              <Select
                defaultValue={role}
                onValueChange={(value) => {
                  const r = value as SignupFormData["role"]
                  setRole(r)
                  setValue("role", r)
                }}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Normal User</SelectItem>
                  <SelectItem value="store_owner">Store Owner</SelectItem>
                  <SelectItem value="system_admin">System Admin</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            {/* Store‑only fields */}
            {role === "store_owner" && (
              <>
                {/* storeName */}
                <div className="grid gap-3">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    type="text"
                    {...register("storeName")}
                  />
                  {errors.storeName && (
                    <p className="text-sm text-red-500">
                      {errors.storeName.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="storeAddress">Store Address</Label>
                  <Input
                    id="storeAddress"
                    type="text"
                    {...register("storeAddress")}
                  />
                  {errors.storeAddress && (
                    <p className="text-sm text-red-500">
                      {errors.storeAddress.message}
                    </p>
                  )}
                </div>
              </>
            )}

            <Button type="submit" className="w-full">
              Sign Up
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
