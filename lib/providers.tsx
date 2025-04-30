"use client";

import { ApolloWrapper } from "@/lib/apollo-provider";
import { AuthProvider } from "@/lib/auth-provider";
import { CookiesProvider } from "react-cookie";
import { Toaster } from "@/components/ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CookiesProvider>
      <AuthProvider>
        <ApolloWrapper>
          {children}
          <Toaster />
        </ApolloWrapper>
      </AuthProvider>
    </CookiesProvider>
  );
}
