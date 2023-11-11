'use client';

import columns from '@/components/webmester/datatable/dataTableColumns';
import { useEffect, useState } from 'react';
import { prisma } from '@/prisma/db';
import { getUsers } from '@/lib/actions';
import { User } from '@prisma/client';
import UsersDataTable from '@/components/webmester/datatable/usersDataTable';
import {
  GearSix,
  CaretRight,
  PlusCircle,
  UserCirclePlus,
  UserList,
  Gauge,
} from '@phosphor-icons/react';
import Link from 'next/link';
import SignUpForm from '@/components/webmester/signUpForm';
import { Button } from '@/components/ui/button';

export default function UserPage() {
  return (
    <main className="mt-32">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold leading-none tracking-tight mb-2">
          Fiók létrehozása
        </h1>

        <div className="flex items-center gap-4">
          <Link href="/webmester">
            <span className="text-sm hover:underline">
              Vissza a vezérlőpulthoz
            </span>
          </Link>

          <Link href="/webmester/felhasznalok">
            <Button variant="default">
              {' '}
              <UserList className="w-6 h-6 mr-2" color="white" /> Felhasználók
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

        <Link href="/webmester/regisztracio">
          <div className="flex items-center gap-[2px] hover:underline">
            <UserCirclePlus className="h-6 w-6" /> Regisztráció
          </div>
        </Link>
      </span>

      <div className="mt-14">
        <SignUpForm />
      </div>
    </main>
  );
}
