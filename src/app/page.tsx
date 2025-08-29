// app/page.tsx (Server Component)
import { auth } from "@clerk/nextjs/server";
import Dashboard from "@/components/dash/Dashboard";
import Main from "@/components/landing/Main";

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    return <Dashboard />;
  }

  return <Main />;
}
