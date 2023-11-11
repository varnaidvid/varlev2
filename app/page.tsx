'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import MyPieChart from '@/components/Chart';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  const { data: session, status } = useSession();

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    // Improvement idea: append the name of the user to the greeting
    // Example: Jó reggelt, {name}!

    switch (true) {
      case currentHour >= 3 && currentHour < 12:
        return 'Jó reggelt!';
      case currentHour >= 12 && currentHour < 18:
        return 'Jó napot!';
      case currentHour >= 18 && currentHour < 22:
        return 'Jó estét!';
      default:
        return 'Jó éjszakát!';
    }
  };

  const leaderboard = [
    {
      name: 'Julika',
      year1: '29',
      year2: '31',
      year3: '22',
      year4: '17',
      sum: '99',
    },
    {
      name: 'Sanyi',
      year1: '24',
      year2: '33',
      year3: '15',
      year4: '9',
      sum: '81',
    },
    {
      name: 'Tündi',
      year1: '20',
      year2: '21',
      year3: '11',
      year4: '5',
      sum: '57',
    },
  ];

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <main className="container mt-10 overflow-hidden">
      <div>
        <h1 className="font-bold tracking-tight mb-2">{getGreeting()}</h1>
        <div className="tracking-light text-sm text-gray-400">
          Tekintsd meg az aktuális versenyeket és feladatokat!
        </div>

        <div className="flex flex-row max-w-full overflow-x-auto">
          <div className="my-4 flex flex-nowrap">
            <Card className="mr-6 min-w-[1/3] w-1/3">
              <CardHeader>
                <CardTitle>Example Feladat I.</CardTitle>
                <CardDescription>Ismeretterjesztő</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
              </CardContent>
            </Card>

            <Card className="mr-6 min-w-[1/3] w-1/3">
              <CardHeader>
                <CardTitle>Example Feladat II.</CardTitle>
                <CardDescription>Ismeretterjesztő</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
              </CardContent>
            </Card>

            <Card className="mr-6 min-w-[1/3] w-1/3">
              <CardHeader>
                <CardTitle>Example Feladat III.</CardTitle>
                <CardDescription>Ismeretterjesztő</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="my-10">
        <h1 className="mb-2">Aktivitás</h1>
        <div className="flex flex-row">
          <div className="w-3/4">
            <Table>
              <TableCaption>
                Kiadott feladatok száma évfolyamonként
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Tanár neve</TableHead>
                  <TableHead>Évfolyam I.</TableHead>
                  <TableHead>Évfolyam II.</TableHead>
                  <TableHead>Évfolyam III.</TableHead>
                  <TableHead>Évfolyam IIII.</TableHead>
                  <TableHead>Összesen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((name) => (
                  <TableRow key={name.name}>
                    <TableCell>{name.name}</TableCell>
                    <TableCell>{name.year1}</TableCell>
                    <TableCell>{name.year2}</TableCell>
                    <TableCell>{name.year3}</TableCell>
                    <TableCell>{name.year4}</TableCell>
                    <TableCell>{name.sum}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="w-1/4 pl-6">
            {isClient && (
              <MyPieChart
                data={[
                  {
                    name: leaderboard[0].name,
                    value: parseInt(leaderboard[0].sum),
                  },
                  {
                    name: leaderboard[1].name,
                    value: parseInt(leaderboard[1].sum),
                  },
                  {
                    name: leaderboard[2].name,
                    value: parseInt(leaderboard[2].sum),
                  },
                ]}
              />
            )}
          </div>
        </div>

        <div className="my-12">
          <h3 className="mb-2">Évfolyamonkénti aktivitás</h3>
          <div className="flex flex-row my-2 justify-between mt-6">
            <div className="flex flex-col text-center">
              <span className="font-bold">Évfolyam I.</span>
              {isClient && (
                <MyPieChart
                  data={[
                    {
                      name: leaderboard[0].name,
                      value: parseInt(leaderboard[0].sum),
                    },
                    {
                      name: leaderboard[1].name,
                      value: parseInt(leaderboard[1].sum),
                    },
                    {
                      name: leaderboard[2].name,
                      value: parseInt(leaderboard[2].sum),
                    },
                  ]}
                />
              )}
            </div>
            <div className="flex flex-col text-center">
              <span className="font-bold">Évfolyam II.</span>
              {isClient && (
                <MyPieChart
                  data={[
                    {
                      name: 'Péter',
                      value: 15,
                    },
                    {
                      name: 'Tamás',
                      value: 20,
                    },
                    {
                      name: 'Julika',
                      value: 9,
                    },
                  ]}
                />
              )}
            </div>
            <div className="flex flex-col text-center">
              <span className="font-bold">Évfolyam III.</span>
              {isClient && (
                <MyPieChart
                  data={[
                    {
                      name: 'Emese',
                      value: 18,
                    },
                    {
                      name: 'Viktor',
                      value: 19,
                    },
                    {
                      name: 'Eszter',
                      value: 23,
                    },
                  ]}
                />
              )}
            </div>
            <div className="flex flex-col text-center">
              <span className="font-bold">Évfolyam IIII.</span>
              {isClient && (
                <MyPieChart
                  data={[
                    {
                      name: 'Tündi',
                      value: 19,
                    },
                    {
                      name: 'Ági',
                      value: 31,
                    },
                    {
                      name: 'Tibi',
                      value: 22,
                    },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="my-14">
        <div>
          <h1 className="mb-2">Pár szó a csapatunkról</h1>
          <p className="text-justify">
            Elkötelezettek és szakmailag felkészültek vagyunk alkalmazásunk
            fejlesztésében. A csapat most intenzíven dolgozik a verseny idején,
            és minden erőfeszítésünket arra összpontosítjuk, hogy az
            alkalmazásunk a lehető legjobb teljesítményt nyújtsa a versenyen. A
            csapatunk tagjai szorosan együttműködnek, és kitartóan törekszünk a
            kiválóságra, hogy bizonyítsuk elhivatottságunkat és tehetségünket a
            versenyen.
          </p>
          <div className="my-4 w-full text-right text-lg">
            <a href="/bemutatkozás">
              <Button size="lg">Tovább</Button>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
