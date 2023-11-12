'use client';

import { getUser } from '@/lib/actions';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import toast from 'react-hot-toast';
import { VezerloContext } from '../../layout';

export default function UserLayout({
  params,
  children,
}: {
  params: { username: string };
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { user, setUser, setIsUserLoading } = useContext(VezerloContext);

  useEffect(() => {
    setIsUserLoading(true);

    const fetchUser = async () => {
      if (!params.username) return;

      const user = await getUser(params.username);

      if (!user) {
        setIsUserLoading(false);

        toast.error('A felhasználó nem található.');
        router.push('/vezerlopult/felhasznalok');
      } else {
        setUser(user);

        setIsUserLoading(false);
      }
    };

    fetchUser();
  }, []);

  return <>{children}</>;
}
