'use client';

import { Button } from '@/components/ui/button';
import { createContext, useContext, useEffect, useState } from 'react';
import { prisma } from '@/prisma/db';
import { getUser, getUsers } from '@/lib/actions';
import { User } from '@prisma/client';
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
import { VezerloContext } from '../../layout';
import { Separator } from '@/components/ui/separator';
import TanarForm from './tanarForm';

export default function UserPage({ params }: { params: { username: string } }) {
  const router = useRouter();

  const { user, setUser, isUserLoading } = useContext(VezerloContext);

  return (
    <>
      <title>VarléV2 - Felhasználók kezelése</title>
      <meta name="description" content="VarléV2 - Felhasználók kezelése" />

      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold leading-none tracking-tight mb-2">
          Felhasználó szerkesztése
        </h1>

        <div className="flex items-center gap-4">
          <Link href="/vezerlopult">
            <span className="text-sm hover:underline">
              Vissza a vezérlőpulthoz
            </span>
          </Link>
          <Link href="/vezerlopult/regisztracio">
            <Button variant="default">
              {' '}
              <UserCirclePlus className="w-6 h-6 mr-2" color="white" /> Új fiók
              létrehozása
            </Button>
          </Link>
        </div>
      </div>

      <span className="leading-none tracking-tight text-base text-gray-500 flex items-center">
        <Link href="/vezerlopult">
          <div className="flex items-center gap-[2px] hover:underline">
            <Gauge className="h-6 w-6" /> Vezérlőpult
          </div>
        </Link>

        <CaretRight className="mx-1 h-4 w-4" />

        <Link href="/vezerlopult/felhasznalok">
          <div className="flex items-center gap-[2px] hover:underline">
            <UserList className="h-6 w-6" /> Felhasználók
          </div>
        </Link>

        <CaretRight className="mx-1 h-4 w-4" />

        <Link
          href={`/vezerlopult/felhasznalok/${
            user?.username ? user.username : decodeURIComponent(params.username)
          }`}
        >
          <div className="flex items-center gap-[2px] hover:underline">
            <UserCircle className="h-6 w-6" />{' '}
            {user?.username
              ? user.username
              : decodeURIComponent(params.username)}
          </div>
        </Link>
      </span>

      <Separator className="mt-6 mb-8" />

      <>
        <Tabs defaultValue="account">
          <TabsList className="mb-4">
            {user?.role == 'tanar' && (
              <TabsTrigger value="stats">Statisztika</TabsTrigger>
            )}
            <TabsTrigger value="account">Általános adatok</TabsTrigger>
            <TabsTrigger value="password">Jelszó módosítása</TabsTrigger>
          </TabsList>
          {user?.role == 'tanar' && (
            <TabsContent value="stats">
              <TanarForm />
            </TabsContent>
          )}
          <TabsContent value="account">
            <UserForm />
          </TabsContent>
          <TabsContent value="password">
            <PasswordForm />
          </TabsContent>
        </Tabs>
      </>
    </>
  );
}
