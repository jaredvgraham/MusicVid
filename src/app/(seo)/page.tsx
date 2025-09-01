// app/page.tsx (Server Component)
import { auth } from "@clerk/nextjs/server";

import Main from "@/components/landing/Main";
import { redirect } from "next/navigation";

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return <Main />;
}
