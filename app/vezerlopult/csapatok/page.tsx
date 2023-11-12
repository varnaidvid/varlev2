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
import { getTeams, getUsers } from '@/lib/actions';
import { User } from '@prisma/client';
import UsersDataTable from '@/components/datatable/usersDataTable';
import {
  GearSix,
  CaretRight,
  UserCirclePlus,
  UserList,
  Gauge,
  UsersFour,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Separator } from '@/components/ui/separator';
import { VezerloContext } from '../layout';
import { TeamsDataTable } from '@/components/vezerlopult/csapatok/teamsDataTable/dataTable';
import TeamsColumns from '@/components/vezerlopult/csapatok/teamsDataTable/dataTableColumns';

export default function UserPage() {
  const { data: session, status } = useSession();

  const { teams, setTeams, isTeamsLoading, setIsTeamsLoading } =
    useContext(VezerloContext);

  useEffect(() => {
    const fetchUser = async () => {
      setIsTeamsLoading(true);

      const teams = await getTeams();

      if (!teams) {
        setIsTeamsLoading(false);
        return;
      } else {
        setTeams(teams);
        setIsTeamsLoading(false);
      }
    };

    if (session?.user.role == 'webmester' && !isTeamsLoading) fetchUser();
  }, [session]);

  return (
    <>
      <title>VarléV2 - Csapatok kezelése</title>
      <meta name="description" content="VarléV2 - Csapatok kezelése" />

      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold leading-none tracking-tight mb-2">
          Csapatok kezelése
        </h1>

        <div className="flex items-center gap-4">
          <Link href="/vezerlopult">
            <span className="text-sm hover:underline">
              Vissza a vezérlőpulthoz
            </span>
          </Link>
          <Link href="/vezerlopult/csapatok/letrehozas">
            <Button variant="default">
              {' '}
              <UsersFour className="w-6 h-6 mr-2" color="white" /> Új csapat
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

        <Link href="/vezerlopult/csapatok">
          <div className="flex items-center gap-[2px] hover:underline">
            <UsersFour className="h-6 w-6 mr-1" /> Csapatok
          </div>
        </Link>
      </span>

      <Separator className="mt-6 mb-8" />

      <>
        {!teams || teams?.length == 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Csapatok</CardTitle>
              <CardDescription>
                Jelenleg nincsen csapat az adatbázisban.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/vezerlopult/csapatok/letrehozas">
                <Button variant="default">
                  <UsersFour className="w-6 h-6 mr-2" color="white" /> Új csapat
                  létrehozása
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Csapatok</CardTitle>
              <CardDescription>Itt tudod kezelni a csapatokat.</CardDescription>
            </CardHeader>
            <CardContent>
              {teams && <TeamsDataTable columns={TeamsColumns} data={teams} />}
            </CardContent>
          </Card>
        )}
      </>
    </>
  );
}
