"use client";

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
      const response = await fetcher<{ access_token: string }>(
        apiEndpoint,
        "POST",
        values
      );
      if (response.access_token) {
        setSubmissionStatus("success");
        form.reset();
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
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
                    <Input {...field} placeholder="********" type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError
            submissionStatus={submissionStatus}
            message="Invalid Credentials"
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
