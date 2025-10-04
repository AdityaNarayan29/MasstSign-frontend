import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "src/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}) {
  return (
    <html lang='en' className="dark">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
