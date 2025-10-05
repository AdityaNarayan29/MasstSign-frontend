"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";
import { useAuth } from "src/context/AuthContext";

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { login, loading, error } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Login failed", err);
      setFormError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className='grid min-h-svh lg:grid-cols-2'>
      <div className='flex flex-col gap-4 p-6 md:p-10'>
        <div className='flex justify-center gap-2 md:justify-start'>
          <Link href='/' className='flex items-center gap-2 font-medium'>
            <div className='bg-primary text-primary-foreground flex items-center justify-center rounded-md'>
              <img src='./favicon.ico' className='w-8 h-8' alt='Logo' />
            </div>
            Masst Sign
          </Link>
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
                  <h1 className='text-2xl font-bold'>Login</h1>
                  <p className='text-sm text-muted-foreground'>
                    Enter your email below to login to your account
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
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </Field>

                {(error || formError) && (
                  <p className='text-red-500 text-sm text-center'>
                    {formError || error}
                  </p>
                )}

                <Field>
                  <FieldDescription className='text-center text-sm'>
                    Don't have an account?{" "}
                    <Link
                      href='/register'
                      className='underline underline-offset-4 hover:text-primary'
                    >
                      Sign up
                    </Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>

      <div className='bg-black relative hidden lg:flex items-center justify-center overflow-hidden'>
        <img
          src='./side.png'
          alt='Side'
          className='w-max h-max object-contain'
        />
        <div className='absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-black/0 to-black/70' />
      </div>
    </div>
  );
}
