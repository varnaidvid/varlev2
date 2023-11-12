'use client';

import { useState } from 'react';
import GameCore from './gameCore';
import { type QuestionWithScrambledWord } from './gameCore';

export default function GameWrapper({
  questions,
}: {
  questions: QuestionWithScrambledWord[];
}) {
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);

  const submitAnswer = (answer: string) => {
    console.log(answer);
    let correct: boolean = false;
    // check if the answer is correct
    if (answer === currentQuestion.answer) {
      console.log('correct');
      correct = true;
    }
    // then upload the attempt to the database
  };

  return (
    <div>
      <GameCore question={currentQuestion} submitAnswer={submitAnswer} />
    </div>
  );
}
