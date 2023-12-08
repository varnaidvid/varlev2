'use client';

import { Button } from '@/components/ui/button';
import {
  allQuestionsColumns,
  type AllParsedQuestion,
} from '@/components/vezerlopult/feladatok/allQuestionsTable/columns';
import {
  ownQuestionsColumns,
  type OwnParsedQuestion,
} from '@/components/vezerlopult/feladatok/editQuestionsTable/column';
import { useEffect, useState } from 'react';
import { getQuestions, getOwnQuestions } from '@/lib/actions';
import { Question } from '@prisma/client';
import AllQuestionsDataTable from '@/components/vezerlopult/feladatok/allQuestionsTable/dataTable';
import {
  GearSix,
  CaretRight,
  UserCirclePlus,
  UserList,
  Gauge,
  NotePencil,
  FolderNotchPlus,
} from '@phosphor-icons/react';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EditQuestionsTable } from '@/components/vezerlopult/feladatok/editQuestionsTable/dataTable';
import { VezerloContext } from '../layout';
import { redirect } from 'next/navigation';
import { useContext } from 'react';
import { useSession } from 'next-auth/react';

// exetend the Question type with the username of the creator
type QuestionWithUsername = Question & {
  creator: {
    username: string;
  };
};

export default function UserPage() {
  const [ownQuestions, setOwnQuestions] = useState<OwnParsedQuestion[]>([]);
  const [allQuestions, setAllQuestions] = useState<AllParsedQuestion[]>([]);

  const { user, isUserLoading } = useContext(VezerloContext);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') return redirect('/bejelentkezes');
    if (
      session &&
      (session.user.role == 'tanar' || session.user.role == 'webmester')
    ) {
      getOwnQuestions(session.user.id).then((res) => {
        return setOwnQuestions(parseOwnQuestions(res));
      });

      getQuestions().then((res) => setAllQuestions(parseAllQuestions(res)));
    }
  }, [status]);

  //   useEffect(() => {
  // getOwnQuestions(username).then((res) => setOwnQuestions(parseOwnQuestions(res)));
  //     getQuestions().then((res) => setAllQuestions(parseAllQuestions(res)));
  //   }, []);

  const parseOwnQuestions = (questions: Question[]) => {
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

  const parseAllQuestions = (questions: QuestionWithUsername[]) => {
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
          Feladatok kezelése
        </h1>

        <div className="flex items-center gap-4">
          <Link href="/vezerlopult">
            <span className="text-sm hover:underline">
              Vissza a vezérlőpulthoz
            </span>
          </Link>

          <Link href="/vezerlopult/feladatok/letrehozas/">
            <Button variant="default">
              <FolderNotchPlus className="w-6 h-6 mr-2" /> Új feladatok
              feltöltése
            </Button>
          </Link>
        </div>
      </div>

      <span className="leading-none tracking-tight text-base text-gray-500 flex items-center">
        <Link href="/vezerlopult">
          <div className="flex items-center gap-[2px] hover:underline">
            <Gauge className="h-6 w-6" /> Vezérlőpult
          </div>
        </Link>

        <CaretRight className="mx-1 h-4 w-4" />

        <Link href="/feladatok">
          <div className="flex items-center gap-[2px] hover:underline">
            <UserList className="h-6 w-6" /> Feladatok
          </div>
        </Link>
      </span>

      {/* ================================================================== MAIN CONTENT */}

      <div>
        <h2 className="text-xl font-semibold leading-none tracking-tight mb-2 mt-16">
          Saját feladatok szerkesztése
        </h2>
        <EditQuestionsTable columns={ownQuestionsColumns} data={ownQuestions} />

        <h2 className="text-xl font-semibold leading-none tracking-tight mt-16 mb-8">
          Összes feladat
        </h2>
        <Tabs defaultValue="5" className="w-full flex flex-col gap-2">
          <TabsList className="w-fit">
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
            <AllQuestionsDataTable
              columns={allQuestionsColumns}
              data={allQuestions.filter((question) => question.year === 5)}
            />
          </TabsContent>
          <TabsContent value="6">
            <AllQuestionsDataTable
              columns={allQuestionsColumns}
              data={allQuestions.filter((question) => question.year === 6)}
            />
          </TabsContent>
          <TabsContent value="7">
            <AllQuestionsDataTable
              columns={allQuestionsColumns}
              data={allQuestions.filter((question) => question.year === 7)}
            />
          </TabsContent>
          <TabsContent value="8">
            <AllQuestionsDataTable
              columns={allQuestionsColumns}
              data={allQuestions.filter((question) => question.year === 8)}
            />
          </TabsContent>
        </Tabs>
      </div>
      <br />
    </main>
  );
}
