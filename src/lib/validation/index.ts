import { z } from 'zod'

export const SignupValidation = z.object({
    fullname: z.string().min(3, { message: "name must be atleast 3 characters long" }).max(50),
    username: z.string().min(3, { message: "name must be atleast 3 characters long" }),
    email: z.string().email(),
    password: z.string().min(8, {message: "Password must contain atleast 8 characters"})
  });