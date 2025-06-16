"use client"

import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api } from "@/lib/services/api"
import { useAuthContext } from "@/contexts/auth-context"
import { updateProfileSchema } from "@/lib/schemas"

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>

type Props = {
  onClose: () => void
}

export const UpdateProfileForm = ({ onClose }: Props) => {
  const { user } = useAuthContext()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
    },
    mode: "all",
  })

  const mutation = useMutation({
    mutationFn: async (data: UpdateProfileFormValues) => {
      const res = await api.put("/auth/updateprofile", data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["user"] })
      onClose()
    },
    onError: () => {
      toast.error("Failed to update profile.")
    },
  })

  const onSubmit = (data: UpdateProfileFormValues) => {
    mutation.mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input {...register("name")} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input type="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <Input
          type="password"
          {...register("password")}
          placeholder="New Password (optional)"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
