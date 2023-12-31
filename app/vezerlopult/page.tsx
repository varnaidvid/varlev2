'use client';

import {
  Check,
  Clock,
  Flag,
  Gauge,
  GearSix,
  Monitor,
  NumberCircleFive,
  NumberCircleFour,
  NumberCircleOne,
  NumberCircleThree,
  NumberCircleTwo,
  Pencil,
  PresentationChart,
  Question,
  SlidersHorizontal,
  UserCircle,
  UserCirclePlus,
  UserList,
  UsersFour,
  X,
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
import { useContext, useEffect, useState } from 'react';
import DashboardCard from '@/components/vezerlopult/dashboardCard';
import { VezerloContext } from './layout';
import { didUserFinish, getTop5Teachers } from '@/lib/actions';
import columns from '@/components/datatable/dataTableColumns';
import UsersDataTable from '@/components/datatable/usersDataTable';
import { BarList, Bold, Flex, Text, Title } from '@tremor/react';

export function humanizeTime(futureDate: Date) {
  const diff = futureDate.getTime() - new Date().getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(diff / 1000 / 60 / 60);
  const days = Math.floor(diff / 1000 / 60 / 60 / 24);

  if (minutes < 60) {
    return minutes + ' perc';
  } else if (hours < 24) {
    return hours + ' óra';
  } else {
    return days + ' nap';
  }
}
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function VezerloHome() {
  const { data: session, status, update } = useSession();

  const [isUserFinished, setIsUserFinished] = useState(false);
  const [topTeachers, setTopTeachers] = useState<any>();
  const [isTopTeachersLoading, setIsTopTeachersLoading] = useState(false);

  const { competitions } = useContext(VezerloContext);

  useEffect(() => {
    const fetchUser = async () => {
      setIsTopTeachersLoading(true);

      const topTeachers = await getTop5Teachers();

      const iconMap: any = {
        0: NumberCircleOne,
        1: NumberCircleTwo,
        2: NumberCircleThree,
        3: NumberCircleFour,
        4: NumberCircleFive,
      };

      if (!topTeachers) {
        setIsTopTeachersLoading(false);
        return;
      } else {
        const data: any = topTeachers.map((teacher, index) => {
          return {
            name: teacher.name,
            value: teacher.value,
            href: teacher.href,
            icon: () => {
              const Icon = iconMap[index];
              return <Icon className="h-6 w-6 mr-1" weight="bold" />;
            },
          };
        });

        setTopTeachers(data);
        setIsTopTeachersLoading(false);
      }
    };

    if (session?.user.role == 'webmester' && !isTopTeachersLoading) fetchUser();
  }, [session]);

  useEffect(() => {
    async function checkUser() {
      const temp = await didUserFinish(
        competitions![0].id,
        session!.user.competitorId!
      );

      setIsUserFinished(temp);
    }

    if (
      competitions &&
      competitions.length > 0 &&
      session &&
      session.user.role == 'diak'
    ) {
      checkUser();
    }
  }, [competitions, session]);

  return (
    <>
      <title>VarléV2 - Vezérlőpult</title>
      <meta name="description" content="VarléV2 - Vezérlőpult" />

      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">
          Üdvözöljük a vezérlőpultján!
        </h1>

        <div className="flex gap-2">
          {session?.user.role == 'webmester' && (
            <>
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto hidden h-8 lg:flex"
                  >
                    <GearSix className="mr-2 h-4 w-4" />
                    Beállítások
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="">
                    <Input className="mb-6" />
                    <Input />
                  </div>
                </PopoverContent>
              </Popover>
            </>
          )}
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

      {session?.user.role == 'diak' && (
        // competitions is the list of competitions that the student is in which can only be one

        <div className="mt-6">
          {competitions?.length == 0 || !competitions ? (
            <h3>Nincs elkövetkezendő versenyed!</h3>
          ) : (
            <>
              <h3 className="text-lg mb-4">{competitions[0].name}</h3>

              <div className="flex gap-4">
                {!isUserFinished && (
                  <Button
                    variant="outline"
                    type="button"
                    size="sm"
                    className="hidden h-8 lg:flex mb-4 hover:cursor-default"
                  >
                    <Clock color="blue" className="mr-2 h-4 w-4" />
                    {humanizeTime(competitions[0].endDate)} kitöltésig
                  </Button>
                )}

                {isUserFinished ? (
                  <Button
                    variant="outline"
                    type="button"
                    size="sm"
                    className="hidden h-8 lg:flex mb-4 hover:cursor-default"
                  >
                    <Check className="mr-2 h-4 w-4" color="green" />
                    Kitöltve
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    type="button"
                    size="sm"
                    className="hidden h-8 lg:flex mb-4 hover:cursor-default"
                  >
                    <X className="mr-2 h-4 w-4" color="red" />
                    Még nem lett kitöltve
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <h3 className="text-base">Rövid leírása:</h3>

                <span className="text-base font-light">
                  {competitions[0].description}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <h3 className="text-base">Kezdés:</h3>

                <span className="text-base font-light">
                  {new Date(competitions[0].startDate).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <h3 className="text-base">Zárás:</h3>

                <span className="text-base font-light">
                  {new Date(competitions[0].endDate).toLocaleString()}
                </span>
              </div>

              {/* if date is between startDate and endDate */}
              {!isUserFinished &&
              new Date() < new Date(competitions[0].endDate) ? (
                <div className="mt-4">
                  <Link href={`/verseny/${competitions[0].id}`}>
                    <Button className="flex gap-2">
                      <Pencil className="h-6 w-6" />
                      Kitöltés
                    </Button>
                  </Link>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Megjegyzés: amennyiben kezdésen belül vagy és még nem
                  töltötted ki és nem jelenik meg a kitöltés gomb, frissíts rá
                  az oldalra!
                </p>
              )}
            </>
          )}
        </div>
      )}

      {session?.user.role == 'tanar' && (
        <div className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <DashboardCard
              Icon={Question}
              title="Feladatok"
              description="Itt található a feladatok kezelő felülete, ahol új feladatok hozhat létre, illetve meglévőket módosíthat."
              buttonText="Feladatok"
              link="/vezerlopult/feladatok"
              secondLink="/vezerlopult/feladatok/letrehozas"
              secondLinkText="Új feladat"
            />
          </div>
        </div>
      )}

      {session?.user.role == 'zsuri' && (
        <div className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <DashboardCard
              Icon={Flag}
              title="Versenyek"
              description="Itt található a versenyek kezelő felülete, ahol új versenyek hozhat létre, illetve meglévőket módosíthat."
              buttonText="Versenyek"
              link="/vezerlopult/versenyek"
              secondLink="/vezerlopult/versenyek/letrehozas"
              secondLinkText="Új verseny"
            />
          </div>
        </div>
      )}

      {session?.user.role == 'webmester' && (
        <div className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <DashboardCard
              Icon={UserCircle}
              title="Felhasználók"
              description="Itt található a felhasználók kezelő 
              felülete, ahol új felhasználókat hozhat létre, 
              illetve meglévőket módosíthat."
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
          </div>
          <Separator className="my-8" />
          <h1 className="text-2xl font-semibold tracking-tight mb-2 -mt-1">
            Legaktívabb tanárok
          </h1>
          {isTopTeachersLoading ? (
            <div className="flex justify-center items-center">
              <div className="animate-pulse text-2xl font-semibold text-black">
                Keresés alatt..
              </div>
            </div>
          ) : (
            <Card className="rounded-md hover:shadow-sm transition-all p-3">
              <Flex>
                <Text>
                  <Bold className="text-gray-800">Név</Bold>
                </Text>
                <Text>
                  <Bold className="text-gray-800">Feladat mennyiség</Bold>
                </Text>
              </Flex>
              <BarList data={topTeachers} className="mt-2" />
            </Card>
          )}{' '}
        </div>
      )}
      <br />
      <br />
    </>
  );
}
