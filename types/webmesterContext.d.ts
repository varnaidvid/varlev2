import { User } from '@prisma/client';
import React from 'react';

export interface webmesterContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    isUserLoading: boolean;
    setIsUserLoading: React.Dispatch<React.SetStateAction<boolean>>;

    users: Users[] | null;
    setUsers: React.Dispatch<React.SetStateAction<User[] | null>>;
    isUsersLoading: boolean;
    setIsUsersLoading: React.Dispatch<React.SetStateAction<boolean>>;
}