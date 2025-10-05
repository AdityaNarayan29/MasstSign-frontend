import { NextResponse } from "next/server";
import * as jwt from "jwt-decode";

interface JwtPayload {
  sub: string;
  email: string;
  role: "UPLOADER" | "SIGNER";
}

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Missing or invalid token" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = (jwt as any).default(token) as JwtPayload;
    return NextResponse.json({ user: decoded });
  } catch (error) {
    console.error("Token decode failed:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
