'use client';

import { Progress } from '@/components/ui/progress';
import WordCard from './wordCard';
import LetterCard from './letterCard';
import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { ArrowRight } from '@phosphor-icons/react';

export type QuestionWithScrambledWord = {
  id: string;
  words: string[];
  scrambledWord: string;
  answer: string;
};

// creates a frequency map of the letters in the word for example: {a: 2, b: 1, c:3}
type LetterCount = { [key: string]: number };
const createLetterCounts = (word: string): LetterCount => {
  return word.split('').reduce((acc: LetterCount, letter: string) => {
    acc[letter] = acc[letter] ? acc[letter] + 1 : 1;
    return acc;
  }, {});
};

export default function Game({
  question,
  submitAnswer,
}: {
  question: QuestionWithScrambledWord;
  submitAnswer: (answer: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [letters, setLetters] = useState(
    createLetterCounts(question.scrambledWord)
  );
  const [input, setInput] = useState('');

  const handleInvalidInput = () => {
    console.log('invalid input');
  };

  const preventCursorMovement = (
    e: React.MouseEvent<HTMLInputElement> | React.UIEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    if (inputRef.current) {
      //focus the input
      inputRef.current.focus();
      const len = input.length;
      inputRef.current.setSelectionRange(len, len);
    }
  };

  const handleAnswerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // check if the answer used up all the letters
    if (Object.values(letters).some((count) => count > 0)) {
      handleInvalidInput();
      return;
    }

    submitAnswer(input);
    setInput('');
  };

  useEffect(() => {
    console.log('use effect');
    setLetters(createLetterCounts(question.scrambledWord));
  }, [question]);

  return (
    <div className="w-full items-center mx-auto max-w-screen-xl flex flex-col py-16">
      <Progress value={(7 / 10) * 100} className="h-1 w-full max-w-lg" />
      {/* 3 kész szó container-je */}
      <div className="flex w-fit mx-auto justify-between gap-8 mt-48">
        {question.words.map((word) => (
          <WordCard word={word} key={word} />
        ))}
      </div>
      <form
        onSubmit={handleAnswerSubmit}
        className="flex flex-col w-full max-w-lg"
      >
        <Input
          name="answer"
          ref={inputRef}
          className="mt-16 text-5xl py-10 rounded-xl text-center font-mono uppercase font-bold tracking-widest"
          value={input}
          type="text"
          onMouseDown={preventCursorMovement}
          onSelect={preventCursorMovement}
          onChange={(e) => {
            let value = e.target.value;

            // this is a backspace
            if (value.length < input.length) {
              // add the deleted letter back to the letters
              const deletedLetter = input.charAt(input.length - 1);
              setLetters((prevLetters) => ({
                ...prevLetters,
                [deletedLetter]: prevLetters[deletedLetter] + 1,
              }));
              setInput(value);
              return;
            }

            const lastChar = value.charAt(value.length - 1);

            if (letters[lastChar] > 0) {
              setLetters((prevLetters) => ({
                ...prevLetters,
                [lastChar]: prevLetters[lastChar] - 1,
              }));
              setInput(value);
            } else {
              handleInvalidInput();
            }
          }}
        />
        <Button
          className="mt-4 text-xl font-mono"
          disabled={Object.values(letters).some((count) => count > 0)}
        >
          Következő
          <ArrowRight className="ml-2" size={20} />
        </Button>
      </form>

      {/* betűk container-je */}
      <div className="flex w-fit mx-auto justify-between gap-4 mt-36">
        {
          // render all the letters
          Object.entries(letters).flatMap(([letter, count]) =>
            Array.from({ length: count }, (_, index) => (
              <LetterCard
                letter={letter}
                used={false}
                key={letter + index} // Unique key for each element
              />
            ))
          )
        }
      </div>
    </div>
  );
}
