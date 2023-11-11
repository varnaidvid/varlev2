'use client';

import {
  Gauge,
  GearSix,
  PresentationChart,
  UserCirclePlus,
  UserList,
} from '@phosphor-icons/react';
import Link from 'next/link';
import DashboardCard from '@/components/webmester/dashboardCard';

export default function WebmesterHome() {
  return (
    <main className="mt-32">
      <h1 className="text-2xl font-semibold leading-none tracking-tight mb-2">
        Üdvözöljük a webmesteri vezérlőpulton!
      </h1>

      <span className="leading-none tracking-tight text-base text-gray-500">
        <Link href="/webmester">
          <div className="flex items-center gap-[2px] hover:underline">
            <Gauge className="h-6 w-6" color="gray" /> Vezérlőpult
          </div>
        </Link>
      </span>

      <div className="items-start justify-center gap-4 mt-14 md:grid lg:grid-cols-2 xl:grid-cols-3">
        <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
          <div className="flex items-center justify-center [&>div]:w-full">
            <DashboardCard
              Icon={UserCirclePlus}
              title="Fiók létrehozása"
              description="A kártyára kattintva megtalálja a regisztrációs felületet"
              buttonText="01. Regisztráció"
              link="/webmester/regisztracio"
            />
          </div>
          <div className="flex items-center justify-center [&>div]:w-full mb-12">
            <DashboardCard
              Icon={GearSix}
              title="Alapbeállítások"
              description="A kártyára kattintva módosíthatja az alapbeállításokat"
              buttonText="04. Beállítások"
              link="/webmester/beallitasok"
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
              link="/webmester/felhasznalok"
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
              link="/webmester/bemutatkozo"
            />{' '}
          </div>
          <div className="flex items-center justify-center [&>div]:w-full"></div>
        </div>
      </div>
    </main>
  );
}
