'use client';

import { getTeam } from '@/lib/actions';
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

export default function TeamLayout({
  params,
  children,
}: {
  params: { name: string };
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { team, setTeam, setIsTeamLoading } = useContext(VezerloContext);

  useEffect(() => {
    setIsTeamLoading(true);

    const fetchTeam = async () => {
      if (!params.name) return;

      const team = await getTeam(decodeURI(params.name));

      if (!team) {
        setIsTeamLoading(false);

        toast.error('A csapat nem található.');
        router.push('/vezerlopult/csapatok');
      } else {
        setTeam(team);

        setIsTeamLoading(false);
      }
    };

    fetchTeam();
  }, []);

  return <>{children}</>;
}
