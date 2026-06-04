"use client";

import React, { createContext, useContext, useState } from "react";
import { AppProvider } from "@shopify/polaris";

type User = {
  name: string;
  email?: string | null;
};

type AuthContextType = {
  user: User | null;
  signIn: (user: User) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = (u: User) => setUser(u);
  const signOut = () => setUser(null);

  return (
    <AppProvider i18n={{}}>
      <AuthContext.Provider value={{ user, signIn, signOut }}>
        {children}
      </AuthContext.Provider>
    </AppProvider>
  );
}
