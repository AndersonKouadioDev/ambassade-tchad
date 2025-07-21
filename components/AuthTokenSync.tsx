'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function AuthTokenSync() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.token) {
      localStorage.setItem('auth-token', session.user.token);
    }
  }, [session]);

  return null;
} 