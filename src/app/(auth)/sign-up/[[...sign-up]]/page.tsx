"use client";

import React from "react";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage(): React.ReactElement {
  return (
    <main className="mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center px-6">
      <SignUp
        forceRedirectUrl={"/welcome"}
        appearance={{
          elements: {
            card: "bg-neutral-950/80 backdrop-blur border border-white/10",
          },
        }}
      />
    </main>
  );
}
