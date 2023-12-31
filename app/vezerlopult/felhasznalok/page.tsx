'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import columns from '@/components/datatable/dataTableColumns';
import { useContext, useEffect, useState } from 'react';
import { prisma } from '@/prisma/db';
import { getUsers } from '@/lib/actions';
import { User } from '@prisma/client';
import UsersDataTable from '@/components/datatable/usersDataTable';
import {
  GearSix,
  CaretRight,
  UserCirclePlus,
  UserList,
  Gauge,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Separator } from '@/components/ui/separator';
import { VezerloContext } from '../layout';

export default function UserPage() {
  const { data: session, status } = useSession();

  const { users, setUsers, isUsersLoading, setIsUsersLoading } =
    useContext(VezerloContext);

  useEffect(() => {
    const fetchUser = async () => {
      setIsUsersLoading(true);

      const users = await getUsers();

      if (!users) {
        setIsUsersLoading(false);
        return;
      } else {
        setUsers(users);
        setIsUsersLoading(false);
      }
    };

    if (session?.user.role == 'webmester' && !isUsersLoading) fetchUser();
  }, [session]);

  return (
    <>
      <title>VarléV2 - Felhasználók kezelése</title>
      <meta name="description" content="VarléV2 - Felhasználók kezelése" />

      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold leading-none tracking-tight mb-2">
          Felhasználók kezelése
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
            <UserList className="h-6 w-6 mr-1" /> Felhasználók
          </div>
        </Link>
      </span>

      <Separator className="mt-6 mb-8" />

      <>
        {users && users.length == 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Felhasználók</CardTitle>
              <CardDescription>
                Jelenleg nincsenek felhasználók az adatbázisban.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/vezerlopult/regisztracio">
                <Button variant="default">
                  <UserCirclePlus className="w-6 h-6 mr-2" color="white" /> Új
                  fiók létrehozása
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {users && users.length > 0 && (
          <UsersDataTable columns={columns} data={users} />
        )}
      </>
    </>
  );
}
