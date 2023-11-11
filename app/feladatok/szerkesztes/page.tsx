'use client';

import { Question } from '@prisma/client';
import { getOwnQuestions } from '@/lib/actions';
import { use, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

type ParsedQuestion = {
  word1: string;
  word2: string;
  word3: string;
  word4: string;
  year: number;
  updatedAt: Date;
};

export default function FeladatokSzerkesztese() {
  const [questions, setQuestions] = useState<ParsedQuestion[]>([]);

  const { data: session, status } = useSession();

  if (!session) {
    const router = useRouter();
    router.replace('/bejelentkezes');
    toast.error('Nincs bejelentkezve!');
    return;
  } else if (
    session.user.role !== 'tanar' &&
    session.user.role !== 'webmester'
  ) {
    const router = useRouter();
    router.replace('/');
    toast.error('Nincs jogosultsága ehhez az oldalhoz!');
    return;
  }

  useEffect(() => {
    getOwnQuestions(session.user.id).then((res) =>
      setQuestions(parseQuestions(res))
    );
  }, []);

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
    }));
  };
}
