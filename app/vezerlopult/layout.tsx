'use client';

import { Button } from '@/components/ui/button';
import { getUsers } from '@/lib/actions';
import { vezerloContextType } from '@/types/vezerloContext';
import { ArrowClockwise } from '@phosphor-icons/react';
import { Competition, Team, User } from '@prisma/client';
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

  competitions: null as Competition[] | null,
  setCompetitions: () => null as any,
  isCompetitionsLoading: false,
  setIsCompetitionsLoading: () => null as any,

  competition: null as Competition | any,
  setCompetition: () => null as any,
  isCompetitionLoading: false,
  setIsCompetitionLoading: () => null as any,

  juryDraggableItems: null as string[] | null,
  setJuryDraggableItems: () => null as any,
  juryDroppedItems: null as string[] | null,
  setJuryDroppedItems: () => null as any,
  isJuryDragging: false,
  setIsJuryDragging: () => null as any,
  isJuryLoading: false,
  setIsJuryLoading: () => null as any,

  teamsDraggableItems: null as string[] | null,
  setTeamsDraggableItems: () => null as any,
  teamsDroppedItems: null as string[] | null,
  setTeamsDroppedItems: () => null as any,
  isTeamsDragging: false,
  setIsTeamsDragging: () => null as any,
  isTeamsDroppableLoading: false,
  setIsTeamsDroppableLoading: () => null as any,

  tasksDataTable: null as any,
  setTasksDataTable: () => null as any,
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

  const [competition, setCompetition] = useState<Competition | null>(null);
  const [isCompetitionLoading, setIsCompetitionLoading] =
    useState<boolean>(false);

  const [competitions, setCompetitions] = useState<Competition[] | null>(null);
  const [isCompetitionsLoading, setIsCompetitionsLoading] =
    useState<boolean>(false);

  const [juryDraggableItems, setJuryDraggableItems] = useState<string[] | null>(
    null
  );
  const [juryDroppedItems, setJuryDroppedItems] = useState<string[] | null>(
    null
  );
  const [isJuryDragging, setIsJuryDragging] = useState<boolean>(false);
  const [isJuryLoading, setIsJuryLoading] = useState<boolean>(false);

  const [teamsDraggableItems, setTeamsDraggableItems] = useState<
    string[] | null
  >(null);
  const [teamsDroppedItems, setTeamsDroppedItems] = useState<string[] | null>(
    null
  );
  const [isTeamsDragging, setIsTeamsDragging] = useState<boolean>(false);
  const [isTeamsDroppableLoading, setIsTeamsDroppableLoading] =
    useState<boolean>(false);

  const [tasksDataTable, setTasksDataTable] = useState<any[]>([]);

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

          competitions,
          setCompetitions,
          isCompetitionsLoading,
          setIsCompetitionsLoading,

          competition,
          setCompetition,
          isCompetitionLoading,
          setIsCompetitionLoading,

          juryDraggableItems,
          setJuryDraggableItems,
          juryDroppedItems,
          setJuryDroppedItems,
          isJuryDragging,
          setIsJuryDragging,
          isJuryLoading,
          setIsJuryLoading,

          teamsDraggableItems,
          setTeamsDraggableItems,
          teamsDroppedItems,
          setTeamsDroppedItems,
          isTeamsDragging,
          setIsTeamsDragging,
          isTeamsDroppableLoading,
          setIsTeamsDroppableLoading,

          tasksDataTable,
          setTasksDataTable,
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
