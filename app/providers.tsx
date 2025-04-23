"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { SocketProvider } from "@/lib/providers/SocketProvider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <SocketProvider>
        <Toaster position="top-right" richColors />
        {children}
      </SocketProvider>
    </SessionProvider>
  );
}
