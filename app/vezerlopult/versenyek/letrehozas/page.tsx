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
  Flag,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Separator } from '@/components/ui/separator';
import { VezerloContext } from '../../layout';
import NewCompetitionForm from '@/components/vezerlopult/versenyek/newCompetitionForm';

export default function CsapatLetrehozas() {
  return (
    <>
      <title>VarléV2 - Új verseny létrehozás</title>
      <meta name="description" content="VarléV2 - Új verseny létrehozás" />

      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold leading-none tracking-tight mb-2">
          Új verseny regisztrálás
        </h1>

        <div className="flex items-center gap-4">
          <Link href="/vezerlopult">
            <span className="text-sm hover:underline">
              Vissza a vezérlőpulthoz
            </span>
          </Link>
          <Link href="/vezerlopult/versenyek">
            <Button variant="default">
              {' '}
              <Flag className="w-6 h-6 mr-2" color="white" /> Versenyek
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

        <Link href="/vezerlopult/versenyek/letrehozas">
          <div className="flex items-center gap-[2px] hover:underline">
            <Flag className="h-6 w-6 mr-1" /> Új verseny
          </div>
        </Link>
      </span>

      <Separator className="mt-6 mb-8" />

      <>
        <NewCompetitionForm />
      </>
    </>
  );
}
