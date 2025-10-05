"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { uploadToCloudinary } from "@/lib/cloudinary";
import api from "@/lib/api";
import { useAuth } from "src/context/AuthContext";

export default function UploaderPage() {
  const { user, token } = useAuth();

  if (!user || user.role !== "UPLOADER") {
    return (
      <div className='p-4 text-center text-red-500'>
        You do not have permission to access this page.
      </div>
    );
  }

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [signerEmail, setSignerEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !title || !signerEmail) {
      setAlertType("error");
      setAlertMessage("Please provide all required fields.");
      return;
    }

    setLoading(true);
    setAlertMessage(null);

    try {
      const pdfUrl = await uploadToCloudinary(file);

      await api.post(
        "/documents",
        {
          title,
          description,
          originalUrl: pdfUrl,
          assignedToEmail: signerEmail,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAlertType("success");
      setAlertMessage("Document uploaded and assigned successfully!");
      setFile(null);
      setTitle("");
      setDescription("");
      setSignerEmail("");
    } catch (err) {
      console.error(err);
      setAlertType("error");
      setAlertMessage("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-xl mx-auto p-4 space-y-4'>
      <h1 className='text-2xl font-bold'>Upload & Assign PDF</h1>

      {alertMessage && (
        <Alert
          className={alertType === "error" ? "bg-red-100" : "bg-green-100"}
        >
          <AlertTitle>{alertType === "error" ? "Error" : "Success"}</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <div>
        <Label htmlFor='title'>Title *</Label>
        <Input
          id='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Document title'
        />
      </div>

      <div>
        <Label htmlFor='description'>Description</Label>
        <Input
          id='description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Optional description'
        />
      </div>

      <div>
        <Label htmlFor='signer'>Assign to (Signer Email) *</Label>
        <Input
          id='signer'
          type='email'
          value={signerEmail}
          onChange={(e) => setSignerEmail(e.target.value)}
          placeholder='signer@example.com'
        />
      </div>

      <div>
        <Label htmlFor='file'>Select PDF *</Label>
        <input
          type='file'
          accept='application/pdf'
          id='file'
          onChange={handleFileChange}
          className='mt-1'
        />
      </div>

      <Button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload & Assign"}
      </Button>
    </div>
  );
}
