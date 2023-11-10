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
import { GearSix, CaretRight, Users } from '@phosphor-icons/react';
import Link from 'next/link';

export default function UserPage() {
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

        <CaretRight className="space-x-2" />

        <Link href="/felhasznalok">
          <div className="flex items-center gap-[2px]">
            <Users className="h-6 w-6" /> Felhasználók
          </div>
        </Link>
      </h3>

      <div>
        <UsersDataTable columns={columns} data={users} />
      </div>
    </main>
  );
}
