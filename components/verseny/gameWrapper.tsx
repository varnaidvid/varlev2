'use client';

import { useState, useEffect } from 'react';
import GameCore from './gameCore';
import { type QuestionWithScrambledWord } from './gameCore';
import { createAttempt } from '@/lib/actions';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { set } from 'date-fns';

export default function GameWrapper({
  questions,
}: {
  questions: QuestionWithScrambledWord[];
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [questionSeconds, setQuestionSeconds] = useState(0);

  const { data: session, status } = useSession();
  useEffect(() => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') return redirect('/bejelentkezes');
    if (session && session.user.role !== 'diak') {
      return redirect('/vezerlopult/');
    }

    // console.log('session', session);
  }, [status]);

  useEffect(() => {
    const savedSeconds = sessionStorage.getItem('seconds');
    const savedMinutes = sessionStorage.getItem('minutes');
    setSeconds(savedSeconds ? parseInt(savedSeconds) : 0);
    setMinutes(savedMinutes ? parseInt(savedMinutes) : 0);

    //get currentQuestionIndex from local storage
    const savedQuestionIndex = localStorage.getItem('current_question_index');

    // if current_question_index is exists set the state
    console.log(savedQuestionIndex);
    if (savedQuestionIndex) {
      if (parseInt(savedQuestionIndex) + 1 >= questions.length) {
        return setGameEnded(true);
      }
      setCurrentQuestionIndex(parseInt(savedQuestionIndex));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        const newSeconds = prevSeconds === 59 ? 0 : prevSeconds + 1;
        sessionStorage.setItem('seconds', newSeconds.toString());
        return newSeconds;
      });
      setMinutes((prevMinutes) => {
        if (prevMinutes === 59) {
          const newMinutes = prevMinutes + 1;
          sessionStorage.setItem('minutes', newMinutes.toString());
          return newMinutes;
        }
        return prevMinutes;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentQuestionIndex === 0) return;
    localStorage.setItem(
      'current_question_index',
      currentQuestionIndex.toString()
    );
  }, [currentQuestionIndex]);

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
      timeTaken: questionSeconds,
      answer: answer,
    });
    setQuestionSeconds(0);
    if (currentQuestionIndex + 1 >= questions.length) {
      // set item in local storage
      localStorage.setItem(
        'current_question_index',
        (currentQuestionIndex + 1).toString()
      );
      setGameEnded(true);
      return;
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  return (
    <div className="flex flex-col items-center px-6 py-16 max-w-3xl mx-auto gap-8">
      {!gameEnded ? (
        <>
          {' '}
          <div className="flex w-full items-center justify-between">
            <span className="text-neutral-500 text-sm font-medium">
              {currentQuestionIndex + 1} / {questions.length} kérdés
            </span>{' '}
            <Progress
              value={((currentQuestionIndex + 1) / questions.length) * 100}
              className="h-2.5 w-full max-w-lg bg-gray-200"
            />
            {/* timer */}
            <span className="bg-gray-200 font-bold text-sm rounded-xl px-3 py-1 leading-none">
              {minutes < 10 ? '0' + minutes : minutes}:
              {seconds < 10 ? '0' + seconds : seconds}
            </span>
          </div>
          <div className="flex flex-col gap-8 items-center mt-12">
            <h1 className="text-3xl font-bold text-gray-800">
              Szó Tippelő Játék
            </h1>
            <p className="text-gray-500 font-medium">
              Találd ki a 4. szót az összekevert betűkből! Segít a 3 megadott
              szó.
            </p>
          </div>
          <GameCore
            question={questions[currentQuestionIndex]}
            submitAnswer={submitAnswer}
          />
        </>
      ) : (
        <div className="w-full items-center flex flex-col text-center gap-8">
          <h2 className="text-gray-500 font-medium">Játék vége</h2>
          <h1>Gratulálunk, az összes kérdést megoldottad!</h1>
          <Button>Eredmények megtekintése</Button>
        </div>
      )}
    </div>
  );
}
