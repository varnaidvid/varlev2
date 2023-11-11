'use client';

import { Button } from '@/components/ui/button';
import { getUsers } from '@/lib/actions';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { createContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export const WebmesterContext = createContext<webmesterContextType>({
  user: null as User | null,
  setUser: () => null as any,
  isUserLoading: false,
  setIsUserLoading: () => null as any,

  users: null as User[] | null,
  setUsers: () => null as any,
  isUsersLoading: false,
  setIsUsersLoading: () => null as any,
});

export default function WebmesterLayout({
  params,
  children,
}: {
  params: { username: string };
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      toast.error('Hozzáférés megtagadva');
      redirect('/');
    },
  });
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);

  const [users, setUsers] = useState<User[] | null>(null);
  const [isUsersLoading, setIsUsersLoading] = useState<boolean>(false);

  if (status === 'authenticated' && session.user.role != 'webmester') {
    toast.error('Hozzáférés megtagadva');
    redirect('/');
  }

  if (status === 'authenticated' && session.user.role == 'webmester') {
    return (
      <WebmesterContext.Provider
        value={{
          user,
          setUser,
          isUserLoading,
          setIsUserLoading,

          users,
          setUsers,
          isUsersLoading,
          setIsUsersLoading,
        }}
      >
        <main className="mt-24">{children}</main>
      </WebmesterContext.Provider>
    );
  }
}
