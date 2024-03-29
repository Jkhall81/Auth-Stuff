"use client";

import { signIn } from "next-auth/react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { fetcher } from "@/lib/apiUtils";
import { CardWrapper } from "./card-wrapper";
import { LoginSchema } from "@/schemas";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

export const LoginForm = () => {
  const router = useRouter();
  const [emailUnverified, setEmailUnverified] = useState<boolean | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<
    "none" | "success" | "error"
  >("none");
  const apiEndpoint = "login/";
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    try {
      const response = await fetcher<{
        role: string;
        user_id: string;
        email: string;
        access_token: string;
        refresh_token: string;
        full_name: string;
      }>(apiEndpoint, "POST", values);

      if (response.access_token) {
        setSubmissionStatus("success");
        const userObjString = JSON.stringify({
          user_id: response.user_id,
          email: response.email,
          full_name: response.full_name,
          access_token: response.access_token,
          refresh_token: response.refresh_token,
          role: response.role,
        });
        Cookies.set("userObj", userObjString);
        signIn("credentials", response);
        form.reset();
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error: any) {
      console.error("login form:", error.response?.data);
      if (error.response?.data.detail === "Email is not verified!") {
        setEmailUnverified(true);
      }
      setSubmissionStatus("error");
    }
  };

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="john.doe@example.com"
                      type="email"
                      autoComplete="username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="********"
                      type="password"
                      autoComplete="current-password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError
            submissionStatus={submissionStatus}
            message={
              emailUnverified
                ? "Email has not been verified!"
                : "Invalid Credentials"
            }
          />
          <FormSuccess
            submissionStatus={submissionStatus}
            message="Login Successful!"
          />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
