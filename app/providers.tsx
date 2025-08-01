// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";

// This is a client-side component that wraps the app in a SessionProvider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}