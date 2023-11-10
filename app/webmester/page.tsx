'use client';

import SignUpForm from '@/components/webmester/signUpForm';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import columns from '@/components/webmester/dataTableColumns';
import { useEffect, useState } from 'react';
import { prisma } from '@/prisma/db';
import { getUsers } from '@/lib/actions';
import { User } from '@prisma/client';
import UsersDataTable from '@/components/webmester/usersDataTable';
import { CaretRight, GearSix } from '@phosphor-icons/react';
import Link from 'next/link';

export default function WebmesterHome() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then((res) => setUsers(res));
  }, []);

  return (
    <main>
      <h3 className="leading-none tracking-tight">
        <Link href="/webmester">
          <div className="flex items-center gap-[2px]">
            <GearSix className="h-6 w-6" /> Vezérlőpult
          </div>
        </Link>
      </h3>
      <div>
        <UsersDataTable columns={columns} data={users} />
      </div>
      <div className="items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-3">
        <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
          <div className="flex items-center justify-center [&>div]:w-full">
            <Link href="/webmester/regisztracio">
              <Card className="h-[400px] hover:bg-accent hover:shadow-sm transition-all">
                <CardHeader>
                  <CardTitle>Fiók létrehozása</CardTitle>
                  <CardDescription>
                    A kártyára kattintva megtalálja a regisztrációs felületet
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
          <div className="flex items-center justify-center [&>div]:w-full">
            <Card className="h-[400px]">asd2</Card>
          </div>
        </div>
        <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
          <div className="flex items-center justify-center [&>div]:w-full">
            <Card className="h-[400px]">asd3</Card>
          </div>
          <div className="flex items-center justify-center [&>div]:w-full">
            <Card className="h-[400px]">asd4</Card>
          </div>
        </div>
        <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
          <div className="flex items-center justify-center [&>div]:w-full">
            <Card className="h-[400px]">asd5</Card>
          </div>
          <div className="flex items-center justify-center [&>div]:w-full">
            <Card className="h-[400px]">asd6</Card>
          </div>
        </div>
      </div>
      <h1>WebMester</h1>
    </main>
  );
}
