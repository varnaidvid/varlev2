'use client';

import { Question } from '@prisma/client';
import { getOwnQuestions } from '@/lib/actions';
import { use, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { redirect } from 'next/navigation';
import {
  CaretRight,
  Gauge,
  NotePencil,
  UserCirclePlus,
  UserList,
} from '@phosphor-icons/react';
import { EditQuestionsTable } from './dataTable';
import { type ParsedQuestion, columns } from './columns';

export default function FeladatokSzerkesztese() {
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') return redirect('/bejelentkezes');
    if (session) {
      getOwnQuestions(session.user.id).then((res) =>
        setQuestions(parseQuestions(res))
      );
    }
  }, [status]);

  useEffect(() => {
    console.log(questions);
  }, [questions]);

  const parseQuestions = (questions: Question[]) => {
    return questions.map((question) => ({
      word1: question.question.split(' ')[0],
      word2: question.question.split(' ')[1],
      word3: question.question.split(' ')[2],
      word4: question.question.split(' ')[3],
      year: parseInt(question.question.split(' ')[4]),
      updatedAt: question.updatedAt,
      id: question.id,
    }));
  };

  return (
    <main className="mt-32">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold leading-none tracking-tight mb-2">
          Összes feladat
        </h1>

        <div className="flex items-center gap-4">
          <Link href="/">
            <span className="text-sm hover:underline">Vissza a főoldalra</span>
          </Link>
          <Link href="/feladatok/szerkesztes/">
            <Button variant="outline">
              {' '}
              <NotePencil className="w-6 h-6 mr-2" /> Feladatok szerkesztése
            </Button>
          </Link>
          <Link href="/feladatok/letrehozas/">
            <Button variant="default">
              {' '}
              <UserCirclePlus className="w-6 h-6 mr-2" /> Új feladatok
              feltöltése
            </Button>
          </Link>
        </div>
      </div>

      <span className="leading-none tracking-tight text-base text-gray-500 flex items-center">
        <Link href="/">
          <div className="flex items-center gap-[2px] hover:underline">
            <Gauge className="h-6 w-6" /> Főoldal
          </div>
        </Link>

        <CaretRight className="mx-1 h-4 w-4" />

        <Link href="/feladatok">
          <div className="flex items-center gap-[2px] hover:underline">
            <UserList className="h-6 w-6" /> Feladatok
          </div>
        </Link>
      </span>

      <div className="mt-14">
        <EditQuestionsTable columns={columns} data={questions} />
      </div>
    </main>
  );
}
