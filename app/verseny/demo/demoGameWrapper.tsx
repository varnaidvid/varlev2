'use client';

import { useState, useEffect } from 'react';
import GameCore from '@/components/verseny/gameCore';
import { type QuestionWithScrambledWord } from '@/components/verseny/gameCore';
import { createAttempt, getAIHint } from '@/lib/actions';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Lightbulb, Question } from '@phosphor-icons/react';
import type { Question as QuestionType } from '@prisma/client';

export default function GameWrapper({
  questions,
  questionsWithAllWords,
}: {
  questions: QuestionWithScrambledWord[];
  questionsWithAllWords: QuestionType[];
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [questionSeconds, setQuestionSeconds] = useState(0);
  const [hint, setHint] = useState('' as string);
  const [hintUsed, setHintUsed] = useState(false as boolean);

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
    // const savedQuestionIndex = localStorage.getItem('current_question_index');

    // if current_question_index is exists set the state
    // console.log(savedQuestionIndex);
    //     if (savedQuestionIndex) {
    //       if (parseInt(savedQuestionIndex) + 1 >= questions.length) {
    //         return setGameEnded(true);
    //       }
    //       setCurrentQuestionIndex(parseInt(savedQuestionIndex));
    //     }
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

  //   useEffect(() => {
  //     if (currentQuestionIndex === 0) return;
  //     localStorage.setItem(
  //       'current_question_index',
  //       currentQuestionIndex.toString()
  //     );
  //   }, [currentQuestionIndex]);

  const submitAnswer = (answer: string) => {
    let correct: boolean = false;

    // válasz helyességének ellenőrzése
    if (
      answer.toLocaleLowerCase() ===
      questions[currentQuestionIndex].answer.toLocaleLowerCase()
    ) {
      correct = true;
    }

    setQuestionSeconds(0);
    if (currentQuestionIndex + 1 >= questions.length) {
      //   localStorage.setItem(
      //     'current_question_index',
      //     (currentQuestionIndex + 1).toString()
      //   );
      setGameEnded(true);
      return;
    }
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setHintUsed(false);
    setHint('');
  };

  return (
    <div className="flex flex-col items-center px-6 py-16 max-w-3xl mx-auto gap-8">
      {!gameEnded ? (
        <>
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
          {/* AI HINT */}
          <Button
            className=" bg-gradient-to-r from-violet-600 to-blue-500 hover:scale-[102%] active:scale-95 hover:brightness-105 transition "
            onClick={async () => {
              setHintUsed(true);
              // remove the number from the end of the current question
              const justWords = questionsWithAllWords[
                currentQuestionIndex
              ].question
                .split(' ')
                .slice(0, 4)
                .join(' ');
              //   console.log(justWords);
              const hint = await getAIHint(justWords);
              if (!hint) return;
              setHint(hint);
            }}
            disabled={hintUsed}
          >
            <Lightbulb className="w-5 h-5 mr-2" />
            Kérek segítséget
          </Button>
          {hint && (
            <p className="flex flex-col gap-2 items-center font-medium text-zinc-700 text-center">
              Segítség:{' '}
              <span className="text-lg font-normal text-zinc-900">{hint}</span>
            </p>
          )}
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
