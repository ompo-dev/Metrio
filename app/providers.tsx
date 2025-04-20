"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <Toaster position="top-right" richColors />
      {children}
    </SessionProvider>
  );
}
