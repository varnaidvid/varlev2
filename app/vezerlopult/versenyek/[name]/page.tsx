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
  UsersFour,
} from '@phosphor-icons/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VezerloContext } from '../../layout';
import { Separator } from '@/components/ui/separator';
import EditTeamForm from './editTeamForm';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { HTML5Backend } from 'react-dnd-html5-backend';

export default function UserPage({ params }: { params: { name: string } }) {
  const router = useRouter();

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  const Backend = isMobile ? TouchBackend : HTML5Backend;

  const { team } = useContext(VezerloContext);

  return (
    <>
      <title>VarléV2 - Csapatok kezelése</title>
      <meta name="description" content="VarléV2 - Csapatok kezelése" />

      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold leading-none tracking-tight mb-2">
          Csapat szerkesztése
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
            <UsersFour className="h-6 w-6" /> Csapatok
          </div>
        </Link>

        <CaretRight className="mx-1 h-4 w-4" />

        <Link
          href={`/vezerlopult/csapatok/${team?.name ? team.name : params.name}`}
        >
          <div className="flex items-center gap-[2px] hover:underline">
            <UsersFour className="h-6 w-6" />{' '}
            {team?.name ? team.name : params.name}
          </div>
        </Link>
      </span>

      <Separator className="mt-6 mb-8" />

      <>
        <DndProvider backend={Backend}>
          <EditTeamForm name={params.name} />
        </DndProvider>
      </>
    </>
  );
}
