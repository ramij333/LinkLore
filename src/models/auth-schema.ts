import { z } from "zod"

export const authFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Must include at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Must include at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Must include at least one special character" }),
})

export type AuthFormValues = z.infer<typeof authFormSchema>
