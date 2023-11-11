'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function WebMesterLayout({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      toast.error('Hozzáférés megtagadva');
      redirect('/');
    },
  });

  if (status === 'authenticated' && session.user.role != 'webmester') {
    toast.error('Hozzáférés megtagadva');
    redirect('/');
  }

  if (status === 'authenticated' && session.user.role == 'webmester') {
    return <div>{children}</div>;
  }
}
