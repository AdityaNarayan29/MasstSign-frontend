"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRegister } from "src/hooks/useRegister";

export default function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const router = useRouter();

  const { mutate: register, isPending, error } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(
      { email, password, role },
      {
        onSuccess: () => {
          router.push("/dashboard");
        },
      }
    );
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
                  <h1 className='text-2xl font-bold'>Register</h1>
                  <p className='text-sm text-muted-foreground'>
                    Enter your details to create an account
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
                  <FieldLabel htmlFor='role'>Role</FieldLabel>
                  <Select onValueChange={(val) => setRole(val)} value={role}>
                    <SelectTrigger id='role'>
                      <SelectValue placeholder='Select your role' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='UPLOADER'>Uploader</SelectItem>
                      <SelectItem value='SIGNER'>Signer</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor='password'>Password</FieldLabel>
                  <Input
                    id='password'
                    type='password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Field>

                <Field>
                  <Button type='submit' disabled={isPending}>
                    {isPending ? "Registering..." : "Register"}
                  </Button>
                </Field>

                {error && (
                  <p className='text-red-500 text-sm text-center'>
                    {(error as any)?.response?.data?.message ||
                      "Register failed"}
                  </p>
                )}

                <Field>
                  <FieldDescription className='text-center text-sm'>
                    Already have an account?{" "}
                    <Link
                      href='/login'
                      className='underline underline-offset-4 hover:text-primary'
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
