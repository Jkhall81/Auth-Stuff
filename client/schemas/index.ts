import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required!" }),
  password: z.string().min(1, {
    message: "Password is required!",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({ message: "Email is required!" }),
  password: z.string().min(6, {
    message: "Minimum of 6 characters is required!",
  }),
  password2: z.string().min(6, {
    message: "Minimum of 6 characters is required!",
  }),
  first_name: z.string().min(1, {
    message: "First name is required",
  }),
  last_name: z.string().min(1, {
    message: "Last name is required!",
  }),
});
