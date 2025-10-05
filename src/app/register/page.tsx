"use client";

import { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";
import Link from "next/link";

export default function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/auth/register", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.access_token);
    } catch (err: any) {
      setError(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex justify-center gap-2 md:justify-start'>
          <a href='#' className='flex items-center gap-2 font-medium'>
            <div className='bg-primary text-primary-foreground flex items-center justify-center rounded-md'>
              <img src='./favicon.ico' className='w-8 h-8' />
            </div>
            Masst Sign
          </a>
        </div>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs'>
            <form
              className={cn("flex flex-col gap-6", className)}
              onSubmit={handleSubmit}
              {...props}
            >
              <FieldGroup>
                <div className='flex flex-col items-center gap-6 text-center'>
                  <h1 className='text-2xl font-bold'>Register</h1>
                  <p className='text-sm text-muted-foreground'>
                    Enter your email below to register your account
                  </p>
                </div>
                <Field>
                  <FieldLabel htmlFor='email'>Email</FieldLabel>
                  <Input
                    id='email'
                    type='email'
                    placeholder='m@example.com'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
                <Field>
                  <div className='flex items-center'>
                    <FieldLabel htmlFor='password'>Password</FieldLabel>
                    <a
                      href='#'
                      className='ml-auto text-sm underline-offset-4 hover:underline'
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id='password'
                    type='password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Field>
                <Field>
                  <Button type='submit' disabled={loading}>
                    {loading ? "Logging in..." : "Register"}
                  </Button>
                </Field>
                {error && (
                  <p className='text-red-500 text-sm text-center'>{error}</p>
                )}
                <Field>
                  <FieldDescription className='text-center text-sm'>
                    Already have an account?{" "}
                    <Link
                      href='/login'
                      className='underline underline-offset-4'
                    >
                      Login
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
      <div className='bg-muted relative hidden lg:flex items-center justify-center'>
        <img
          src='./side.png'
          alt='Image'
          className='w-max h-max object-contain'
        />
        <div className='absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-black/0 to-black/60 rounded-lg'></div>
      </div>
    </div>
  );
}
