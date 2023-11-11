'use client';

import SignUpForm from '@/components/webmester/signUpForm';
import { Button } from '@/components/ui/button';
import columns from '@/components/webmester/datatable/dataTableColumns';
import { createContext, useContext, useEffect, useState } from 'react';
import { prisma } from '@/prisma/db';
import { getUser, getUsers } from '@/lib/actions';
import { User } from '@prisma/client';
import UsersDataTable from '@/components/webmester/datatable/usersDataTable';
import {
  GearSix,
  CaretRight,
  UserCirclePlus,
  UserList,
  Gauge,
  UserCircle,
} from '@phosphor-icons/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserForm from './userForm';
import PasswordForm from './passwordForm';
import { WebmesterContext } from '../../layout';
import { webmesterContextType } from '@/types/webmesterContext';

export default function UserPage({ params }: { params: { username: string } }) {
  const router = useRouter();

  const { user, setUser, isUserLoading } = useContext(WebmesterContext);

  return (
    <main className="mt-32">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold leading-none tracking-tight mb-2">
          Felhasználó frissítése
        </h1>

        <div className="flex items-center gap-4">
          <Link href="/webmester">
            <span className="text-sm hover:underline">
              Vissza a vezérlőpulthoz
            </span>
          </Link>
          <Link href="/webmester/regisztracio">
            <Button variant="default">
              {' '}
              <UserCirclePlus className="w-6 h-6 mr-2" color="white" /> Új fiók
              létrehozása
            </Button>
          </Link>
        </div>
      </div>

      <span className="leading-none tracking-tight text-base text-gray-500 flex items-center">
        <Link href="/webmester">
          <div className="flex items-center gap-[2px] hover:underline">
            <Gauge className="h-6 w-6" /> Vezérlőpult
          </div>
        </Link>

        <CaretRight className="mx-1 h-4 w-4" />

        <Link href="/webmester/felhasznalok">
          <div className="flex items-center gap-[2px] hover:underline">
            <UserList className="h-6 w-6" /> Felhasználók
          </div>
        </Link>

        <CaretRight className="mx-1 h-4 w-4" />

        <Link
          href={`/webmester/felhasznalok/${
            user?.username ? user.username : params.username
          }`}
        >
          <div className="flex items-center gap-[2px] hover:underline">
            <UserCircle className="h-6 w-6" />{' '}
            {user?.username ? user.username : params.username}
          </div>
        </Link>
      </span>

      <div className="mt-14">
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="account">Adatok</TabsTrigger>
            <TabsTrigger value="password">Jelszó</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <UserForm />
          </TabsContent>
          <TabsContent value="password">
            <PasswordForm />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
