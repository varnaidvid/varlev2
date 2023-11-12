'use client';

import { useState, useEffect } from 'react';
import GameCore from './gameCore';
import { type QuestionWithScrambledWord } from './gameCore';
import { createAttempt } from '@/lib/actions';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Progress } from '../ui/progress';

export default function GameWrapper({
  questions,
}: {
  questions: QuestionWithScrambledWord[];
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);

  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') return redirect('/bejelentkezes');
    if (session && session.user.role !== 'diak') {
      return redirect('/vezerlopult/');
    }

    // console.log('session', session);
  }, [status]);

  const submitAnswer = (answer: string) => {
    let correct: boolean = false;
    if (
      answer.toLocaleLowerCase() ===
      questions[currentQuestionIndex].answer.toLocaleLowerCase()
    ) {
      correct = true;
    }
    if (session?.user.competitorId === undefined)
      return console.log('no competitor id');
    createAttempt({
      competitionId: 'c1',
      questionId: questions[currentQuestionIndex].id,
      competitorId: session?.user.competitorId,
      isCorrect: correct,
      timeTaken: 8,
      answer: answer,
    });
    if (currentQuestionIndex + 1 >= questions.length) {
      setGameEnded(true);
      return;
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  return (
    <div className="flex flex-col items-center px-6 py-16 max-w-3xl mx-auto gap-8">
      <div className="flex w-full items-center justify-between">
        <span className="text-neutral-500 text-sm font-medium">
          {currentQuestionIndex + 1} / {questions.length} kérdés
        </span>{' '}
        <Progress
          value={((currentQuestionIndex + 1) / questions.length) * 100}
          className="h-2.5 w-full max-w-lg"
        />
        {/* timer */}
        <span className="bg-gray-200 font-bold text-sm rounded-xl px-3 py-1 leading-none">
          00:00
        </span>
      </div>
      <div className="flex flex-col gap-8 items-center mt-12">
        <h1 className="text-3xl font-bold text-gray-800">Szó Tippelő Játék</h1>
        <p className="text-gray-500 font-medium">
          Találd ki a 4. szót az összekevert betűkből! Segít a 3 megadott szó.
        </p>
      </div>
      {!gameEnded ? (
        <GameCore
          question={questions[currentQuestionIndex]}
          submitAnswer={submitAnswer}
        />
      ) : (
        <h1>Game ended</h1>
      )}
    </div>
  );
}
