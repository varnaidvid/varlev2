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
import {
  getCompetitions,
  getCompetitionsForZsuri,
  getTeams,
  getUsers,
} from '@/lib/actions';
import { Competition, User } from '@prisma/client';
import UsersDataTable from '@/components/datatable/usersDataTable';
import {
  GearSix,
  CaretRight,
  UserCirclePlus,
  UserList,
  Gauge,
  Flag,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Separator } from '@/components/ui/separator';
import { VezerloContext } from '../layout';
import { CompetitionsDataTable } from '@/components/vezerlopult/versenyek/competitionsDataTable/dataTable';
import TeamsColumns from '@/components/vezerlopult/versenyek/competitionsDataTable/dataTableColumns';
import CompetitionsColumns from '@/components/vezerlopult/versenyek/competitionsDataTable/dataTableColumns';

export default function UserPage() {
  const { data: session, status } = useSession();

  const {
    competitions,
    setCompetitions,
    isCompetitionsLoading,
    setIsCompetitionsLoading,
  } = useContext(VezerloContext);

  useEffect(() => {
    const fetchCompetitions = async () => {
      setIsCompetitionsLoading(true);

      let competitions: Competition[] = [];

      if (session?.user.role == 'zsuri')
        competitions = await getCompetitionsForZsuri(session?.user.id);
      else competitions = await getCompetitions();

      if (!competitions) {
        setIsCompetitionsLoading(false);
        return;
      } else {
        setCompetitions(competitions);
        setIsCompetitionsLoading(false);
      }
    };

    if (
      (session?.user.role == 'webmester' || session?.user.role == 'zsuri') &&
      !isCompetitionsLoading
    )
      fetchCompetitions();
  }, [session]);

  return (
    <>
      <title>VarléV2 - Versenyek kezelése</title>
      <meta name="description" content="VarléV2 - Versenyek kezelése" />

      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold leading-none tracking-tight mb-2">
          Versenyek kezelése
        </h1>

        <div className="flex items-center gap-4">
          <Link href="/vezerlopult">
            <span className="text-sm hover:underline">
              Vissza a vezérlőpulthoz
            </span>
          </Link>
          <Link href="/vezerlopult/versenyek/letrehozas">
            <Button variant="default">
              {' '}
              <Flag className="w-6 h-6 mr-2" color="white" /> Új verseny
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

        <Link href="/vezerlopult/versenyek">
          <div className="flex items-center gap-[2px] hover:underline">
            <Flag className="h-6 w-6 mr-1" /> Versenyek
          </div>
        </Link>
      </span>

      <Separator className="mt-6 mb-8" />

      <>
        {!competitions || competitions?.length == 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>Versenyek</CardTitle>
              <CardDescription>
                {session?.user.role == 'webmester' &&
                  'Jelenleg nincsen verseny az adatbázisban.'}
                {session?.user.role == 'zsuri' &&
                  'Jelenleg nincsen verseny, aminek zsűritagja lennél.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/vezerlopult/versenyek/letrehozas">
                <Button variant="default">
                  <Flag className="w-6 h-6 mr-2" color="white" /> Új verseny
                  létrehozása
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Versenyek</CardTitle>
              <CardDescription>Itt tudod kezelni a csapatokat.</CardDescription>
            </CardHeader>
            <CardContent>
              {competitions && (
                <CompetitionsDataTable
                  columns={CompetitionsColumns}
                  data={competitions}
                />
              )}
            </CardContent>
          </Card>
        )}
      </>
    </>
  );
}
