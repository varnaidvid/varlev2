'use client';

import { Button } from '@/components/ui/button';
import { getUsers } from '@/lib/actions';
import { vezerloContextType } from '@/types/vezerloContext';
import { ArrowClockwise } from '@phosphor-icons/react';
import { Team, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { createContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export const VezerloContext = createContext<vezerloContextType>({
  user: null as User | null,
  setUser: () => null as any,
  isUserLoading: false,
  setIsUserLoading: () => null as any,

  users: null as User[] | null,
  setUsers: () => null as any,
  isUsersLoading: false,
  setIsUsersLoading: () => null as any,

  draggableItems: null as string[] | null,
  setDraggableItems: () => null as any,
  droppedItems: null as string[] | null,
  setDroppedItems: () => null as any,
  isDragging: false,
  setIsDragging: () => null as any,

  teams: null as Team[] | null,
  setTeams: () => null as any,
  isTeamsLoading: false,
  setIsTeamsLoading: () => null as any,

  team: null as Team | null,
  setTeam: () => null as any,
  isTeamLoading: false,
  setIsTeamLoading: () => null as any,
});

export default function VezerloLayout({
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
      redirect('/bejelentkezes');
    },
  });
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(false);

  const [users, setUsers] = useState<User[] | null>(null);
  const [isUsersLoading, setIsUsersLoading] = useState<boolean>(false);

  const [draggableItems, setDraggableItems] = useState<string[] | null>(null);
  const [droppedItems, setDroppedItems] = useState<string[] | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const [teams, setTeams] = useState<Team[] | null>(null);
  const [isTeamsLoading, setIsTeamsLoading] = useState<boolean>(false);

  const [team, setTeam] = useState<Team | null>(null);
  const [isTeamLoading, setIsTeamLoading] = useState<boolean>(false);

  useEffect(() => {
    if (session && session.user.role == 'diak' && status == 'authenticated') {
      toast.error('Hozzáférés megtagadva');
      redirect('/');
    }
  }, [session, status]);

  if (status === 'authenticated' && session.user.role == 'webmester') {
    return (
      <VezerloContext.Provider
        value={{
          user,
          setUser,
          isUserLoading,
          setIsUserLoading,

          users,
          setUsers,
          isUsersLoading,
          setIsUsersLoading,

          draggableItems,
          setDraggableItems,
          droppedItems,
          setDroppedItems,
          isDragging,
          setIsDragging,

          teams,
          setTeams,
          isTeamsLoading,
          setIsTeamsLoading,

          team,
          setTeam,
          isTeamLoading,
          setIsTeamLoading,
        }}
      >
        <main className="mt-24">{children}</main>
      </VezerloContext.Provider>
    );
  } else {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <ArrowClockwise className="animate-spin h-16 w-16" />
      </div>
    );
  }
}
