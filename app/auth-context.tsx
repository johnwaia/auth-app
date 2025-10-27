// app/auth-context.tsx
import React, { createContext, useContext, useMemo, useState } from 'react';

type AuthState = {
  email: string | null;
  setEmail: (email: string | null) => void;
  signOut: () => void;
};

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const signOut = () => setEmail(null);
  const value = useMemo(() => ({ email, setEmail, signOut }), [email]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used inside <AuthProvider>');
  return v;
}
