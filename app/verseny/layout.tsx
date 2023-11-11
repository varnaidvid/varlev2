'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function VersenyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') return redirect('/bejelentkezes');
    if (session && session.user.role !== 'diak') {
      return redirect('/vezerlopult/');
    }
  }, [status]);

  return <div>{children}</div>;
}
