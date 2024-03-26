import { z } from 'zod'

export const SignupValidation = z.object({
    fullname: z.string().min(3, { message: "name must be atleast 3 characters long" }).max(50),
    username: z.string().min(3, { message: "name must be atleast 3 characters long" }),
    email: z.string().email(),
    password: z.string().min(8, {message: "Password must contain atleast 8 characters"})
  });

export const SignInValidation = z.object({
  email: z.string().email({message: "Must contain @ and a domain (eg. johndoe@example.com)"}),
  password: z.string().min(8, {message: "Password must contain aleast 8 characters"})
})

export const PostFormValidation = z.object({
  caption: z.string().min(5, {message: "The caption should contain atleast 5 characters"}).max(2200, {message: "Maximum characters allowed: 2200"}),
  file: z.custom<File[]>(),
  location: z.string().min(5, {message: "The location should contain atleast 5 characters"}).max(2200,{ message: "Maximum characters allowed: 2200"}),
  tags: z.string()
})