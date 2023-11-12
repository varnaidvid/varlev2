import { Competition, Team, User } from '@prisma/client';
import React from 'react';

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
}