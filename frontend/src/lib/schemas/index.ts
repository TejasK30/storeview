import { z } from "zod"

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(16, "Password must be at most 16 characters")
  .regex(/[A-Z]/, "Password must include at least one uppercase letter")
  .regex(/[^A-Za-z0-9]/, "Password must include at least one special character")

const nameSchema = z
  .string()
  .min(20, "Name must be at least 20 characters")
  .max(60, "Name must be at most 60 characters")

const addressSchema = z
  .string()
  .max(400, "Address must be at most 400 characters")

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(8, { message: "Password is required" }),
})

export const signupSchema = z
  .object({
    name: nameSchema,
    email: z.string().email("Invalid email"),
    password: passwordSchema,
    role: z.enum(["system_admin", "store_owner", "user"], {
      errorMap: () => ({ message: "Role is required" }),
    }),
    address: addressSchema.min(1, "Address is required"),
    storeName: z.string().optional(),
    storeAddress: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "store_owner") {
      if (!data.storeName || data.storeName.trim() === "") {
        ctx.addIssue({
          path: ["storeName"],
          code: z.ZodIssueCode.custom,
          message: "Store name is required",
        })
      }
      if (!data.storeAddress || data.storeAddress.trim() === "") {
        ctx.addIssue({
          path: ["storeAddress"],
          code: z.ZodIssueCode.custom,
          message: "Store address is required",
        })
      }
    }
  })

export const addUserSchema = z.object({
  name: nameSchema,
  email: z.string().email("Invalid email"),
  password: passwordSchema,
  address: addressSchema.min(1, "Address is required"),
})

export const AddUserSchema = z
  .object({
    name: nameSchema,
    email: z.string().email("Invalid email"),
    password: passwordSchema,
    address: addressSchema.min(1, "Address is required"),
    role: z.enum(["user", "store_owner", "system_admin"]),
    storeName: z.string().optional(),
    storeAddress: z.string().optional(),
    storeEmail: z.string().email("Invalid email").optional(),
  })
  .refine(
    (data) => {
      if (data.role === "store_owner") {
        return data.storeName && data.storeAddress && data.storeEmail
      }
      return true
    },
    {
      message: "All store details are required for store owner",
      path: ["storeName"],
    }
  )

export const updateProfileSchema = z.object({
  name: nameSchema,
  email: z.string().email("Invalid email address"),
  password: passwordSchema.optional(),
})

export const addStoreSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  storeEmail: z.string().email("Invalid store email"),
  storeAddress: addressSchema.min(1, "Store address is required"),

  ownerName: nameSchema,
  ownerEmail: z.string().email("Invalid owner email"),
  ownerAddress: addressSchema.min(1, "Owner address is required"),
  ownerPassword: passwordSchema,
})
