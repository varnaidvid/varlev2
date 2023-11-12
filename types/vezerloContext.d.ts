import { Competition, Question, Team, User } from '@prisma/client';
import React from 'react';

export type AllParsedQuestion = Array<{
    id: string;
    word1: string;
    word2: string;
    word3: string;
    word4: string;
    year: number;
    createdAt: Date;
    updatedAt: Date;
    username: string;
}>;



export interface vezerloContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isUserLoading: boolean;
    setIsUserLoading: React.Dispatch<React.SetStateAction<boolean>>;

    users: Users[] | null;
    setUsers: React.Dispatch<React.SetStateAction<User[] | null>>;
    isUsersLoading: boolean;
    setIsUsersLoading: React.Dispatch<React.SetStateAction<boolean>>;

    draggableItems: string[] | null;
    setDraggableItems: React.Dispatch<React.SetStateAction<string[] | null>>;
    droppedItems: string[] | null;
    setDroppedItems: React.Dispatch<React.SetStateAction<string[] | null>>;
    isDragging: boolean;
    setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;

    teams: Team[] | null;
    setTeams: React.Dispatch<React.SetStateAction<Team[] | null>>;
    isTeamsLoading: boolean;
    setIsTeamsLoading: React.Dispatch<React.SetStateAction<boolean>>;

    team: Team | null;
    setTeam: React.Dispatch<React.SetStateAction<Team | null>>;
    isTeamLoading: boolean;
    setIsTeamLoading: React.Dispatch<React.SetStateAction<boolean>>;

    competitions: Competition[] | null;
    setCompetitions: React.Dispatch<React.SetStateAction<Competition[] | null>>;
    isCompetitionsLoading: boolean;
    setIsCompetitionsLoading: React.Dispatch<React.SetStateAction<boolean>>;

    competition: Competition | null;
    setCompetition: React.Dispatch<React.SetStateAction<Competition | null>>;
    isCompetitionLoading: boolean;
    setIsCompetitionLoading: React.Dispatch<React.SetStateAction<boolean>>;

    juryDraggableItems: string[] | null;
    setJuryDraggableItems: React.Dispatch<React.SetStateAction<string[] | null>>;
    juryDroppedItems: string[] | null;
    setJuryDroppedItems: React.Dispatch<React.SetStateAction<string[] | null>>;
    isJuryDragging: boolean;
    setIsJuryDragging: React.Dispatch<React.SetStateAction<boolean>>;
    isJuryLoading: boolean;
    setIsJuryLoading: React.Dispatch<React.SetStateAction<boolean>>;

    teamsDraggableItems: string[] | null;
    setTeamsDraggableItems: React.Dispatch<React.SetStateAction<string[] | null>>;
    teamsDroppedItems: string[] | null;
    setTeamsDroppedItems: React.Dispatch<React.SetStateAction<string[] | null>>;
    isTeamsDragging: boolean;
    setIsTeamsDragging: React.Dispatch<React.SetStateAction<boolean>>;
    isTeamsDroppableLoading: boolean;
    setIsTeamsDroppableLoading: React.Dispatch<React.SetStateAction<boolean>>;

    tasksDataTable: any | null;
    setTasksDataTable: React.Dispatch<React.SetStateAction<any | null>>;
}