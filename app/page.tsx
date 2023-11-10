'use client';

import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth/authOptions';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

import pieChart from '@/components/pieChart';

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
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    // Improvement idea: append the name of the user to the greeting

    switch (true) {
      case currentHour >= 5 && currentHour < 12:
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
          <Table>
            <TableCaption>Kiadott feladatok száma évfolyamonként</TableCaption>
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
          <div className="ml-5">
            // Chart helye
          </div>
        </div>
        <div className="my-6">
          <h3>Évfolyamonként</h3>
          <div className="flex flex-col my-2">
            <div className="flex flex-row">
              <span>Évfolyam I.</span>
              // Chart helye
            </div>
            <div className="flex flex-row">
              <span>Évfolyam II.</span>
              // Chart helye
            </div>
            <div className="flex flex-row">
              <span>Évfolyam III.</span>
              // Chart helye
            </div>
            <div className="flex flex-row">
              <span>Évfolyam IIII.</span>
              // Chart helye
            </div>
          </div>
        </div>
      </div>

      <div className="my-10">
        <div>
          <h1 className="mb-2">Pár szó a csapatunkrol</h1>
          <p className="text-justify">
            Elkötelezettek és szakmailag felkészültek vagyunk alkalmazásunk
            fejlesztésében. A csapat most intenzíven dolgozik a verseny idején,
            és minden erőfeszítésünket arra összpontosítjuk, hogy az
            alkalmazásunk a lehető legjobb teljesítményt nyújtsa a versenyen. A
            csapatunk tagjai szorosan együttműködnek, és kitartóan törekszünk a
            kiválóságra, hogy bizonyítsuk elhivatottságunkat és tehetségünket a
            versenyen.
          </p>
        </div>
      </div>
    </main>
  );
}
