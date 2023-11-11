import { Separator } from '@/components/ui/separator';
import { ProfileForm } from '@/app/webmester/beallitasok/profile-form';

<<<<<<< HEAD:app/vezerlopult/beallitasok/page.tsx
import SignUpForm from '@/components/vezerlopult/signUpForm';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import columns from '@/components/vezerlopult/datatable/dataTableColumns';
import { useEffect, useState } from 'react';
import { prisma } from '@/prisma/db';
import { getUsers } from '@/lib/actions';
import { User } from '@prisma/client';
import UsersDataTable from '@/components/vezerlopult/datatable/usersDataTable';
import {
  GearSix,
  CaretRight,
  UserCirclePlus,
  UserList,
  Gauge,
} from '@phosphor-icons/react';
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <main className="mt-32">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold leading-none tracking-tight mb-2">
          Alapbeállítások módosítása
        </h1>

        <div className="flex items-center gap-4">
          <Link href="/vezerlopult">
            <span className="text-sm hover:underline">
              Vissza a vezérlőpulthoz
            </span>
          </Link>
          {/* <Link href="/vezerlopult/regisztracio">
            <Button variant="default">
              {' '}
              <UserCirclePlus className="w-6 h-6 mr-2" color="white" /> Új fiók
              létrehozása
            </Button>
          </Link> */}
        </div>
      </div>

      <span className="leading-none tracking-tight text-base text-gray-500 flex items-center">
        <Link href="/vezerlopult">
          <div className="flex items-center gap-[2px] hover:underline">
            <Gauge className="h-6 w-6" /> Vezérlőpult
          </div>
        </Link>

        <CaretRight className="mx-1 h-4 w-4" />

        <Link href="/vezerlopult/beallitasok">
          <div className="flex items-center gap-[2px] hover:underline">
            <GearSix className="h-6 w-6" /> Beállítások
          </div>
        </Link>
      </span>

      <div className="mt-14">
        <h1>SETTINGS FORM</h1>
      </div>
    </main>
=======
export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profil</h3>
        <p className="text-sm text-muted-foreground">Így fognak mások látni.</p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
>>>>>>> c24c6d526a1cd66673fd8c88fca997629dc22fdc:app/webmester/beallitasok/page.tsx
  );
}
