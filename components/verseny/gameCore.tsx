'use client';

import { Progress } from '@/components/ui/progress';
import WordCard from './wordCard';
import LetterCard from './letterCard';
import { useState, useRef, useEffect, use } from 'react';
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
    //focus on the input field
    inputRef.current?.focus();
    setLetters(createLetterCounts(question.scrambledWord));
  }, [question]);

  return (
    <div className="w-full items-center flex flex-col gap-8">
      {/* 3 kész szó container-je */}
      <div className="w-full justify-between gap-6 grid grid-cols-1 sm:grid-cols-3">
        {question.words.map((word) => (
          <WordCard word={word} key={word} />
        ))}
      </div>
      <form
        onSubmit={handleAnswerSubmit}
        className="flex flex-col w-full gap-2"
      >
        <label htmlFor="answer" className="font-medium text-gray-500">
          Megoldás:
        </label>
        <Input
          name="answer"
          title="megoldás"
          ref={inputRef}
          placeholder="megoldás"
          className="text-4xl border-blue-600 border-[2px] rounded-lg text-center font-mono py-8 font-bold tracking-widest placeholder:text-gray-300 ring-0 focus:!ring-[5px] !ring-offset-0 !ring-blue-400"
          value={input}
          type="text"
          onMouseDown={preventCursorMovement}
          onSelect={preventCursorMovement}
          onChange={(e) => {
            let value = e.target.value.toLocaleLowerCase();

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
          size={'lg'}
          className="mt-4 group bg-blue-600 hover:bg-blue-700 font-bold text-white text-base disabled:bg-blue-400 disabled:opacity-100 disabled:cursor-not-allowed"
          disabled={Object.values(letters).some((count) => count > 0)}
        >
          Következő
          <ArrowRight
            className="ml-2 group-hover:translate-x-3 transition-transform"
            weight="bold"
            size={18}
          />
        </Button>
      </form>

      {/* betűk container-je */}
      <div className="flex flex-col gap-4 items-center font-semibold text-gray-500 mt-6">
        {
          //if all letter are used up
        }
        <span className="">Betűk:</span>
        <div className="flex w-fit mx-auto justify-between gap-4">
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
    </div>
  );
}
