'use client';

import { getUser } from '@/lib/actions';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';
import toast from 'react-hot-toast';

export const userContext = createContext({
  user: undefined as User | undefined,
  setUser: undefined as Dispatch<SetStateAction<User | undefined>> | undefined,
  isUserLoading: undefined as boolean | undefined,
});

export default function UserLayout({
  params,
  children,
}: {
  params: { username: string };
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [user, setUser] = useState<User>();
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsUserLoading(true);

    const fetchUser = async () => {
      if (!params.username) return;

      const user = await getUser(params.username);

      if (!user) {
        setIsUserLoading(false);
        toast.error('A felhasználó nem található.');
        router.push('/');
      } else {
        setUser(user);

        setIsUserLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <userContext.Provider value={{ user, setUser, isUserLoading }}>
      {children}
    </userContext.Provider>
  );
}
