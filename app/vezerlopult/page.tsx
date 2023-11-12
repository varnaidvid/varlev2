'use client';

import {
  Flag,
  Gauge,
  GearSix,
  Monitor,
  PresentationChart,
  Question,
  SlidersHorizontal,
  UserCircle,
  UserCirclePlus,
  UserList,
  UsersFour,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import DashboardCard from '@/components/vezerlopult/dashboardCard';

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

        <div className="flex gap-2">
          <Link href="/vezerlopult/bemutatkozo">
            <Button
              variant="outline"
              size="sm"
              className="ml-auto hidden h-8 lg:flex"
            >
              <Monitor className="mr-2 h-4 w-4" />
              Bemutatkozó oldal szerkesztése
            </Button>
          </Link>
          <Link href="/beallitasok">
            <Button
              variant="outline"
              size="sm"
              className="ml-auto hidden h-8 lg:flex"
            >
              <GearSix className="mr-2 h-4 w-4" />
              Beállítások
            </Button>
          </Link>
        </div>
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
          <div className="grid md:grid-cols-2 gap-4">
            <DashboardCard
              Icon={UserCircle}
              title="Felhasználók"
              description="Itt található a felhasználók kezelő felülete, ahol új felhasználókat hozhat létre, illetve meglévőket módosíthat."
              buttonText="Felhasználók"
              link="/vezerlopult/felhasznalok"
              secondLink="/vezerlopult/regisztracio"
              secondLinkText="Új felhasználó"
            />
            <DashboardCard
              Icon={UsersFour}
              title="Csapatok"
              description="Itt található a csapatok kezelő felülete, ahol új csapatokat hozhat létre, illetve meglévőket módosíthat."
              buttonText="Csapatok"
              link="/vezerlopult/csapatok"
              secondLink="/vezerlopult/csapatok/letrehozas"
              secondLinkText="Új csapat"
            />
            <DashboardCard
              Icon={Flag}
              title="Versenyek"
              description="Itt található a versenyek kezelő felülete, ahol új versenyek hozhat létre, illetve meglévőket módosíthat."
              buttonText="Versenyek"
              link="/vezerlopult/versenyek"
              secondLink="/vezerlopult/versenyek/letrehozas"
              secondLinkText="Új verseny"
            />
            <DashboardCard
              Icon={Question}
              title="Feladatok"
              description="Itt található a feladatok kezelő felülete, ahol új feladatok hozhat létre, illetve meglévőket módosíthat."
              buttonText="Feladatok"
              link="/vezerlopult/feladatok"
              secondLink="/vezerlopult/feladatok/letrehozas"
              secondLinkText="Új feladat"
            />

            <Separator className="my-8" />
          </div>
        </div>
      )}
    </>
  );
}
