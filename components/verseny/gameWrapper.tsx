'use client';

import { useState, useEffect } from 'react';
import GameCore from './gameCore';
import { type QuestionWithScrambledWord } from './gameCore';
import { createAttempt } from '@/lib/actions';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

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

    console.log('session', session);
  }, [status]);

  const submitAnswer = (answer: string) => {
    console.log(answer);
    let correct: boolean = false;
    // check if the answer is correct
    if (
      answer.toLocaleLowerCase() ===
      questions[currentQuestionIndex].answer.toLocaleLowerCase()
    ) {
      console.log('correct');
      correct = true;
    }
    // then upload the attempt to the database
    if (session?.user.competitorId === undefined)
      return console.log('no competitor id');

    console.log(questions[currentQuestionIndex].id);
    createAttempt({
      competitionId: 'c1',
      questionId: questions[currentQuestionIndex].id,
      competitorId: session?.user.competitorId,
      isCorrect: correct,
      timeTaken: 8,
      answer: answer,
    });

    // check if there are still questions left
    if (currentQuestionIndex + 1 >= questions.length) {
      console.log('no more questions');
      setGameEnded(true);
      return;
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  return (
    <div>
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
