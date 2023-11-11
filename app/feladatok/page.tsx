'use client';

import { Button } from '@/components/ui/button';
import {
  columns,
  type ParsedQuestion,
} from '@/components/tanar/questionsTableColumns';
import { useEffect, useState } from 'react';
import { prisma } from '@/prisma/db';
import { getQuestions } from '@/lib/actions';
import { Prisma, Question } from '@prisma/client';
import QuestionsDataTable from '@/components/tanar/questionsDataTable';
import {
  GearSix,
  CaretRight,
  UserCirclePlus,
  UserList,
  Gauge,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// exetend the Question type with the username of the creator
type QuestionWithUsername = Question & {
  creator: {
    username: string;
  };
};

export default function UserPage() {
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);

  useEffect(() => {
    getQuestions().then((res) => setQuestions(parseQuestions(res)));
  }, []);

  const parseQuestions = (questions: QuestionWithUsername[]) => {
    return questions.map((question) => ({
      id: question.id,
      word1: question.question.split(' ')[0],
      word2: question.question.split(' ')[1],
      word3: question.question.split(' ')[2],
      word4: question.question.split(' ')[3],
      year: parseInt(question.question.split(' ')[4]),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      username: question.creator.username,
    }));
  };

  return (
    <main className="mt-32">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold leading-none tracking-tight mb-2">
          Felhasználók kezelése
        </h1>

        <div className="flex items-center gap-4">
          <Link href="/">
            <span className="text-sm hover:underline">Vissza a főoldalra</span>
          </Link>
          <Link href="/feladatok/letrehozas/">
            <Button variant="default">
              {' '}
              <UserCirclePlus className="w-6 h-6 mr-2" color="white" /> Új
              feladatok feltöltése
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
        <Tabs defaultValue="5" className="w-full flex flex-col gap-4">
          <TabsList className="w-fit self-center">
            <TabsTrigger className="px-5" value="5">
              5. Évfolyam
            </TabsTrigger>
            <TabsTrigger className="px-5" value="6">
              6. Évfolyam
            </TabsTrigger>
            <TabsTrigger className="px-5" value="7">
              7. Évfolyam
            </TabsTrigger>
            <TabsTrigger className="px-5" value="8">
              8. Évfolyam
            </TabsTrigger>
          </TabsList>
          <TabsContent value="5">
            <QuestionsDataTable
              columns={columns}
              data={questions.filter((question) => question.year === 5)}
            />
          </TabsContent>
          <TabsContent value="6">
            <QuestionsDataTable
              columns={columns}
              data={questions.filter((question) => question.year === 6)}
            />
          </TabsContent>
          <TabsContent value="7">
            <QuestionsDataTable
              columns={columns}
              data={questions.filter((question) => question.year === 7)}
            />
          </TabsContent>
          <TabsContent value="8">
            <QuestionsDataTable
              columns={columns}
              data={questions.filter((question) => question.year === 8)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
