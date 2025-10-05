"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface ApiUser {
  sub: string;
  email: string;
  role: "UPLOADER" | "SIGNER";
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [apiUser, setApiUser] = useState<ApiUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setApiUser(null);
        } else {
          const data = await res.json();
          setApiUser(data.user);
        }
      } catch (error) {
        console.error("[Dashboard] /api/me error:", error);
        setApiUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const role = apiUser?.role ?? user?.role ?? "Guest";

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-gray-500'>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-5xl mx-auto space-y-6'>
        <header className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Dashboard</h1>
          {apiUser || user ? (
            <div className='flex items-center gap-4'>
              <span className='text-gray-700'>
                Hello, {apiUser?.email || user?.email}
              </span>
              <Button variant='outline' onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <Button onClick={() => router.push("/login")}>Login</Button>
          )}
        </header>

        <section className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-xl font-semibold mb-2'>Welcome, {role}</h2>
          <p className='text-gray-600'>
            {role === "UPLOADER"
              ? "You can upload and assign PDF documents."
              : role === "SIGNER"
              ? "You can view and sign assigned documents."
              : "Please login to see your dashboard."}
          </p>
        </section>

        <section className='bg-white p-6 rounded-lg shadow-md'>
          <h3 className='text-lg font-semibold mb-2'>Quick Actions</h3>
          <div className='space-y-2'>
            {role === "UPLOADER" && (
              <Button onClick={() => router.push("/uploader")}>
                Go to Upload Page
              </Button>
            )}
            {role === "SIGNER" && (
              <Button onClick={() => router.push("/signer")}>
                Go to Signer Page
              </Button>
            )}
            {role === "Guest" && (
              <Button disabled>Login to access features</Button>
            )}
          </div>
        </section>

        <section className='bg-white p-6 rounded-lg shadow-md'>
          <h3 className='text-lg font-semibold mb-2'>Stats</h3>
          <p className='text-gray-500'>Coming soon...</p>
        </section>
      </div>
    </div>
  );
}
