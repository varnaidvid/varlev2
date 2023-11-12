'use client';

import { Progress } from '@/components/ui/progress';
import WordCard from './wordCard';
import LetterCard from './letterCard';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

type QuestionWithShuffledWord = {
  id: string;
  words: string[];
  shuffledWord: string;
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

export default function Jatek({
  questions,
}: {
  questions: QuestionWithShuffledWord[];
}) {
  const [words, setWords] = useState(questions[0].words);
  const [letters, setLetters] = useState(
    createLetterCounts(questions[0].shuffledWord)
  );
  const [answer, setAnswer] = useState(questions[0].answer);
  const [input, setInput] = useState('');

  const handleInvalidInput = () => {
    console.log('invalid input');
  };

  return (
    <div className="w-full items-center mx-auto max-w-screen-xl flex flex-col py-16">
      <Progress value={(7 / 10) * 100} className="h-1 w-full max-w-lg" />
      {/* 3 kész szó container-je */}
      <div className="flex w-fit mx-auto justify-between gap-8 mt-48">
        {words.map((word) => (
          <WordCard word={word} key={word} />
        ))}
      </div>
      <Input
        className="mt-16"
        value={input}
        type="text"
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

      {/* betűk container-je */}
      <div className="flex w-fit mx-auto justify-between gap-4 mt-48">
        {/* {allLetters.map((letter) => (
          <LetterCard letter={letter} used={false} key={letter} />
        ))} */}
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
