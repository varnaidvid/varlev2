'use client';

import {
  Gauge,
  GearSix,
  PresentationChart,
  SlidersHorizontal,
  UserCirclePlus,
  UserList,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import MainAccountsCards from '@/components/vezerlopult/felhasznalok/mainAccountsCards';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import MainTeamCards from '@/components/vezerlopult/csapatok/mainTeamCards';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import MainCompetitonCards from '@/components/vezerlopult/versenyek/mainCompetitionCards';
import MainTasksCards from '@/components/vezerlopult/feladatok/mainTasksCards';

export default function VezerloHome() {
  const { data: session, status, update } = useSession();

  const [view, setView] = useState('normal');

  return (
    <>
      <title>VarléV2 - Vezérlőpult</title>
      <meta name="description" content="VarléV2 - Vezérlőpult" />

      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Üdvözöljük a vezérlőpultján!
        </h1>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto hidden h-8 lg:flex"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Nézet
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={view} onValueChange={setView}>
              <DropdownMenuRadioItem value="normal">
                Normál
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="compact">
                Kompakt
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <span className="tracking-tight text-base text-gray-500">
        <Link href="/vezerlopult">
          <div className="flex items-center gap-[2px] hover:underline">
            <Gauge className="h-6 w-6" color="gray" /> Vezérlőpult
          </div>
        </Link>
      </span>

      <Separator className="mt-6 mb-8" />

      {session?.user.role == 'webmester' && (
        <div className="mt-6">
          <h3 className="text-xl font-medium tracking-tight mb-2">
            Felhasználók
          </h3>

          <MainAccountsCards />

          <Separator className="my-8" />
        </div>
      )}

      {session?.user.role == 'webmester' && (
        <div className="mt-6">
          <h3 className="text-xl font-medium tracking-tight mb-2">Csapatok</h3>

          <MainTeamCards />

          <Separator className="my-8" />
        </div>
      )}

      {session?.user.role == 'webmester' || session?.user.role == 'zsuri' ? (
        <div className="mt-6">
          <h3 className="text-xl font-medium tracking-tight mb-2">Versenyek</h3>

          <MainCompetitonCards />

          <Separator className="my-8" />
        </div>
      ) : (
        ''
      )}

      {session?.user.role == 'webmester' || session?.user.role == 'tanar' ? (
        <div className="mt-6">
          <h3 className="text-xl font-medium tracking-tight mb-2">Feladatok</h3>

          <MainTasksCards />

          <Separator className="my-8" />
        </div>
      ) : (
        ''
      )}
      {/* 
      <div className="items-start justify-center gap-4 my-4 md:grid lg:grid-cols-2 xl:grid-cols-3">
        <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
          <div className="flex items-center justify-center [&>div]:w-full">
            <DashboardCard
              Icon={UserCirclePlus}
              title="Fiók létrehozása"
              description="A kártyára kattintva megtalálja a regisztrációs felületet"
              buttonText="01. Regisztráció"
              link="/vezerlopult/regisztracio"
            />
          </div>
          <div className="flex items-center justify-center [&>div]:w-full mb-12">
            <DashboardCard
              Icon={GearSix}
              title="Alapbeállítások"
              description="A kártyára kattintva módosíthatja az alapbeállításokat"
              buttonText="04. Beállítások"
              link="/vezerlopult/beallitasok"
            />
          </div>
        </div>
        <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
          <div className="flex items-center justify-center [&>div]:w-full">
            <DashboardCard
              Icon={UserList}
              title="Felhasználók kezelése"
              description="A kártyára kattintva megtalálja a felhasználók kezelői felületet"
              buttonText="02. Felhasználók"
              link="/vezerlopult/felhasznalok"
            />
          </div>
          <div className="flex items-center justify-center [&>div]:w-full"></div>
        </div>
        <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
          <div className="flex items-center justify-center [&>div]:w-full">
            <DashboardCard
              Icon={PresentationChart}
              title="Bemutatkozó oldal"
              description="A kártyára kattintva megtalálja szerkesztheti a bemutató oldalt"
              buttonText="03. Szerkesztés"
              link="/vezerlopult/bemutatkozo"
            />{' '}
          </div>
          <div className="flex items-center justify-center [&>div]:w-full"></div>
        </div> 
      </div> */}
    </>
  );
}
