'use client';

import { getCompetition, getCompetitionByName } from '@/lib/actions';
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

export default function CompetitionLayout({
  params,
  children,
}: {
  params: { name: string };
  children: React.ReactNode;
}) {
  const router = useRouter();

  const { competition, setCompetition, setIsCompetitionLoading } =
    useContext(VezerloContext);

  useEffect(() => {
    setIsCompetitionLoading(true);

    const fetchCompetition = async () => {
      if (!params.name) return;

      const competition = await getCompetitionByName(
        decodeURIComponent(params.name)
      );

      if (!competition) {
        setIsCompetitionLoading(false);

        toast.error('A verseny nem található.');
        router.push('/vezerlopult/versenyek');
      } else {
        setCompetition(competition);

        setIsCompetitionLoading(false);
      }
    };

    fetchCompetition();
  }, []);

  return <>{children}</>;
}
