import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import { Textarea } from "./textarea"
import { toast } from "sonner"
import { api } from "@/lib/services/api"
import { AddUserSchema } from "@/lib/schemas"

type AddUserFormProps = {
  onClose: () => void
  onSuccess: () => void
}

type AddUserFormData = z.infer<typeof AddUserSchema>

export const AddUserForm: React.FC<AddUserFormProps> = ({
  onClose,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddUserFormData>({
    resolver: zodResolver(AddUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      address: "",
      role: "user",
    },
    mode: "all",
  })

  const role = watch("role")

  const onSubmit = async (formData: AddUserFormData) => {
    setLoading(true)
    try {
      const response = await api.post("/admin/users", {
        ...formData,
        storeName: role === "store_owner" ? formData.storeName : undefined,
        storeAddress:
          role === "store_owner" ? formData.storeAddress : undefined,
        storeEmail: role === "store_owner" ? formData.storeEmail : undefined,
      })

      if (response.status !== 201 && response.status !== 200) {
        toast.error("Failed to create user")
        throw new Error("Failed to create user")
      }

      toast.success("User created successfully!")
      onSuccess()
      onClose()
    } catch (error) {
      console.error("Error creating user:", error)
      toast.error("Failed to create user. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" {...register("address")} />
        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={role}
          onValueChange={(value) => {
            const event = {
              target: { name: "role", value },
            } as unknown as React.ChangeEvent<HTMLInputElement>
            return register("role").onChange(event)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="store_owner">Store Owner</SelectItem>
            <SelectItem value="system_admin">System Admin</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-red-500">{errors.role.message}</p>
        )}
      </div>

      {/* Store fields only if role is store_owner */}
      {role === "store_owner" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input id="storeName" {...register("storeName")} />
            {errors.storeName && (
              <p className="text-sm text-red-500">{errors.storeName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeAddress">Store Address</Label>
            <Input id="storeAddress" {...register("storeAddress")} />
            {errors.storeAddress && (
              <p className="text-sm text-red-500">
                {errors.storeAddress.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeEmail">Store Email</Label>
            <Input id="storeEmail" {...register("storeEmail")} />
            {errors.storeEmail && (
              <p className="text-sm text-red-500">
                {errors.storeEmail.message}
              </p>
            )}
          </div>
        </>
      )}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Creating..." : "Create User"}
      </Button>
    </form>
  )
}
