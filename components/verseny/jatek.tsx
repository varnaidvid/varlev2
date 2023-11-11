'use client';

import { Progress } from '@/components/ui/progress';
import WordCard from './wordCard';
import LetterCard from './letterCard';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

type QuestionWithShuffledWord = {
  id: string;
  words: string[];
  shuffledWord: string[];
  answer: string;
};

export default function Jatek({
  questions,
}: {
  questions: QuestionWithShuffledWord[];
}) {
  const [words, setWords] = useState(questions[0].words);
  const [allLetters, setAllLetters] = useState(questions[0].shuffledWord);
  const [availableLetters, setAvailableLetters] = useState(allLetters);
  const [answer, setAnswer] = useState(questions[0].answer);
  const [input, setInput] = useState('');

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
          const value = e.target.value;
          const lastLetter = value[value.length - 1];
          // check if the last letter is in the available letters
          // if yes, remove it from the available letters
          // if no, do nothing
          console.log(availableLetters);
          console.log(value);
          console.log(lastLetter);
          if (
            availableLetters.find(
              (letter) => letter === lastLetter.toLocaleLowerCase()
            )
          ) {
            console.log('available');
            // remove a single instance of the letter from the array

            // subtract the value from the available letters
            //hint:
            // let array1 = ["a", "a", "b", "b", "c"];
            // let array2 = ["a", "b"];

            // let freqMap = array2.reduce((acc, e) => {
            //   acc[e] = (acc[e] || 0) + 1;
            //   return acc;
            // }, {});

            // let result = array1.filter(e => {
            //   if (!freqMap[e]) {
            //     return true;
            //   }
            //   freqMap[e]--;
            //   return freqMap[e] >= 0;
            // });

            type FrequencyMap = { [key: string]: number };
            //subtract the value letters from the available letters
            const valueArray = value.split('');
            const freqMap = valueArray.reduce(
              (acc: FrequencyMap, e: string) => {
                acc[e] = (acc[e] || 0) + 1;
                return acc;
              },
              {}
            );

            console.log(freqMap);

            // Filter availableLettersArray based on freqMap
            const result = availableLetters.filter((e: string) => {
              if (!freqMap[e]) {
                return true;
              }
              freqMap[e]--;
              return freqMap[e] >= 0;
            });
            console.log(result);
            setAvailableLetters(result);

            // set the input
            setInput(value.toLocaleLowerCase());
          } else {
            setInput(value.slice(0, value.length - 1));
          }
        }}
      />

      {/* betűk container-je */}
      <div className="flex w-fit mx-auto justify-between gap-4 mt-48">
        {allLetters.map((letter) => (
          <LetterCard letter={letter} used={false} key={letter} />
        ))}
      </div>
    </div>
  );
}
