"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { api } from "@/lib/services/api"
import { toast } from "sonner"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { Textarea } from "./textarea"
import { addStoreSchema } from "@/lib/schemas"

type AddStoreFormProps = {
  onClose: () => void
  onSuccess: () => void
}

type AddStoreFormData = z.infer<typeof addStoreSchema>

export const AddStoreForm: React.FC<AddStoreFormProps> = ({
  onClose,
  onSuccess,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddStoreFormData>({
    resolver: zodResolver(addStoreSchema),
    defaultValues: {
      storeName: "",
      storeEmail: "",
      storeAddress: "",
      ownerName: "",
      ownerEmail: "",
      ownerAddress: "",
      ownerPassword: "",
    },
    mode: "all",
  })

  const onSubmit = async (data: AddStoreFormData) => {
    try {
      const payload = {
        storeName: data.storeName,
        storeEmail: data.storeEmail,
        storeAddress: data.storeAddress,
        newOwner: {
          name: data.ownerName,
          email: data.ownerEmail,
          address: data.ownerAddress,
          password: data.ownerPassword,
        },
      }

      const response = await api.post("/admin/stores", payload)

      if (response.status !== 200 && response.status !== 201) {
        toast.error(response.data?.message || "Failed to create store")
        return
      }

      toast.success("Store created successfully!")
      reset()
      onSuccess()
      onClose()
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "An unexpected error occurred"
      toast.error(msg)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Store Details */}
      <div className="space-y-2">
        <Label htmlFor="storeName">Store Name</Label>
        <Input id="storeName" {...register("storeName")} />
        {errors.storeName && (
          <p className="text-red-500 text-sm">{errors.storeName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="storeEmail">Store Email</Label>
        <Input id="storeEmail" type="email" {...register("storeEmail")} />
        {errors.storeEmail && (
          <p className="text-red-500 text-sm">{errors.storeEmail.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="storeAddress">Store Address</Label>
        <Textarea id="storeAddress" {...register("storeAddress")} />
        {errors.storeAddress && (
          <p className="text-red-500 text-sm">{errors.storeAddress.message}</p>
        )}
      </div>

      {/* Owner Details */}
      <div className="space-y-2">
        <Label htmlFor="ownerName">Owner Name</Label>
        <Input id="ownerName" {...register("ownerName")} />
        {errors.ownerName && (
          <p className="text-red-500 text-sm">{errors.ownerName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ownerEmail">Owner Email</Label>
        <Input id="ownerEmail" type="email" {...register("ownerEmail")} />
        {errors.ownerEmail && (
          <p className="text-red-500 text-sm">{errors.ownerEmail.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ownerAddress">Owner Address</Label>
        <Textarea id="ownerAddress" {...register("ownerAddress")} />
        {errors.ownerAddress && (
          <p className="text-red-500 text-sm">{errors.ownerAddress.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="ownerPassword">Owner Password</Label>
        <Input
          id="ownerPassword"
          type="password"
          {...register("ownerPassword")}
        />
        {errors.ownerPassword && (
          <p className="text-red-500 text-sm">{errors.ownerPassword.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Creating..." : "Create Store"}
      </Button>
    </form>
  )
}
