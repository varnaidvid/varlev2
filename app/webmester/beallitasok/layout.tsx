import { Metadata } from 'next';
import Image from 'next/image';

import { Separator } from '@/components/ui/separator';
import { SidebarNav } from '@/app/webmester/beallitasok/components/sidebar-nav';

import Link from 'next/link';

/*import {
  GearSix,
  CaretRight,
  UserCirclePlus,
  UserList,
  Gauge,
} from '@phosphor-icons/react';*/

export const metadata: Metadata = {
  title: 'Forms',
  description: 'Advanced form example using react-hook-form and Zod.',
};

const sidebarNavItems = [
  {
    title: 'Profil',
    href: '/webmester/beallitasok',
  },
  {
    title: 'Fiók',
    href: '/webmester/beallitasok/account',
  },
  {
    title: 'Megjelenés',
    href: '/webmester/beallitasok/appearance',
  },
  {
    title: 'Értesítések',
    href: '/webmester/beallitasok/notifications',
  },
  {
    title: 'Egyéb',
    href: '/webmester/beallitasok/display',
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="flex justify-between w-full mt-12">
        <h1 className="text-2xl font-semibold leading-none tracking-tight mb-2">
          Alapbeállítások módosítása
        </h1>
        <div className="flex items-center gap-4">
          <Link href="/webmester">
            <span className="text-sm hover:underline">
              Vissza a vezérlőpulthoz
            </span>
          </Link>
          {/* <Link href="/webmester/regisztracio">
            <Button variant="default">
              {' '}
              <UserCirclePlus className="w-6 h-6 mr-2" color="white" /> Új fiók
              létrehozása
            </Button>
          </Link> */}
        </div>
      </div>

      <span className="leading-none tracking-tight text-base text-gray-500 flex items-center">
        <Link href="/webmester">
          <div className="flex items-center gap-[2px] hover:underline">
            {/*<Gauge className="h-6 w-6" /> Vezérlőpult*/}
          </div>
        </Link>

        {/*<CaretRight className="mx-1 h-4 w-4" />*/}

        <Link href="/webmester/beallitasok">
          <div className="flex items-center gap-[2px] hover:underline">
            {/*<GearSix className="h-6 w-6" /> Beállítások*/}
          </div>
        </Link>
      </span>

      <div className="md:hidden">
        <Image
          src="/examples/forms-light.png"
          width={1280}
          height={791}
          alt="Forms"
          className="block dark:hidden"
        />
        <Image
          src="/examples/forms-dark.png"
          width={1280}
          height={791}
          alt="Forms"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden space-y-6 pb-16 md:block">
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  );
}
