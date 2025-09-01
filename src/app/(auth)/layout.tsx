import { ClerkProvider, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import "../globals.css";
import AuthNavBar from "@/components/AuthNavBar";

const inter = Inter({ subsets: ["latin"] });

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ClerkLoading>
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        <AuthNavBar />
        <main>{children}</main>
      </ClerkLoaded>
    </>
  );
}
