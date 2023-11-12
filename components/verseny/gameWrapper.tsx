'use client';

import { useState } from 'react';
import GameCore from './gameCore';
import { type QuestionWithScrambledWord } from './gameCore';
import { createAttempt } from '@/lib/actions';

export default function GameWrapper({
  questions,
}: {
  questions: QuestionWithScrambledWord[];
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);

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
    createAttempt({
      competitionId: 'c1',
      questionId: questions[currentQuestionIndex].id,
      competitorId: 'c1',
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
