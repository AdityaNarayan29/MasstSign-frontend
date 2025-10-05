"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface Document {
  id: number;
  fileUrl: string;
  status: "PENDING" | "SIGNED" | "VERIFIED" | "REJECTED";
  signer?: { email: string };
  uploader?: { email: string };
  signatures?: { signatureUrl: string; signedAt: string }[];
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const role = user?.role ?? "Guest";

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        let res: Response;

        if (role === "UPLOADER") {
          res = await fetch("/documents/uploaded", {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else if (role === "SIGNER") {
          res = await fetch("/documents/assigned", {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          setDocs([]);
          return;
        }

        if (res.ok) {
          const data = await res.json();
          setDocs(data);
        } else {
          setDocs([]);
        }
      } catch (err) {
        console.error("[Dashboard] Error fetching documents:", err);
        setDocs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [user, role]);

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
          {user ? (
            <div className='flex items-center gap-4'>
              <span className='text-gray-700'>Hello, {user.email}</span>
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
          <h3 className='text-lg font-semibold mb-2'>
            {role === "UPLOADER" ? "Uploaded Documents" : "Assigned Documents"}
          </h3>
          {docs.length === 0 ? (
            <p className='text-gray-500'>No documents found.</p>
          ) : (
            <table className='min-w-full table-auto border-collapse border border-gray-200'>
              <thead>
                <tr className='bg-gray-100'>
                  <th className='border px-4 py-2'>ID</th>
                  <th className='border px-4 py-2'>File</th>
                  {role === "SIGNER" && (
                    <th className='border px-4 py-2'>Uploader</th>
                  )}
                  <th className='border px-4 py-2'>Status</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc) => (
                  <tr key={doc.id} className='hover:bg-gray-50'>
                    <td className='border px-4 py-2'>{doc.id}</td>
                    <td className='border px-4 py-2'>
                      <a
                        href={doc.fileUrl}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-blue-600 underline'
                      >
                        View
                      </a>
                    </td>
                    {role === "SIGNER" && (
                      <td className='border px-4 py-2'>
                        {doc.uploader?.email}
                      </td>
                    )}
                    <td className='border px-4 py-2'>
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          doc.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : doc.status === "SIGNED"
                            ? "bg-blue-100 text-blue-800"
                            : doc.status === "VERIFIED"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}
