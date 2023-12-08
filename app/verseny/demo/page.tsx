export const dynamicParams = true;

import GameWrapper from './demoGameWrapper';
import { Competitor, Question } from '@prisma/client';
import { combineEventHandlers } from 'recharts/types/util/ChartUtils';

const scramble = (word: string) => {
  if (word.length <= 2) {
    // For words of length 2 or less, scrambling isn't really meaningful.
    return word;
  }

  // Separate the first and last characters
  const firstChar = word[0];
  const lastChar = word[word.length - 1];
  const middleChars = word.substring(1, word.length - 1);

  // Function to check if a character is a vowel
  const isVowel = (char: string) => 'aeiouAEIOU'.includes(char);

  // Extract vowels and consonants
  const vowels = middleChars.split('').filter((char) => isVowel(char));
  const consonants = middleChars.split('').filter((char) => !isVowel(char));

  // Scramble the vowels and consonants separately
  const scrambleArray = (array: string[]) =>
    array.sort(() => Math.random() - 0.5);

  const scrambledVowels = scrambleArray(vowels);
  const scrambledConsonants = scrambleArray(consonants);

  // Reassemble the word with the first and last characters also scrambled
  const scrambledMiddle = [...scrambledVowels, ...scrambledConsonants].sort(
    () => Math.random() - 0.5
  );
  let scrambledWord = '';
  if (word.length === 3) {
    scrambledWord = lastChar + middleChars + firstChar;
  } else {
    // Reassemble the word with the first and last characters also scrambled
    const scrambledMiddle = [...scrambledVowels, ...scrambledConsonants].sort(
      () => Math.random() - 0.5
    );
    scrambledWord = [firstChar, ...scrambledMiddle, lastChar]
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  return scrambledWord;
};

const dummyQuestions: Question[] = [
  {
    id: '1',
    question: 'narancssárga fekete sötétkék citromsárga 6',
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: 'cr',
  },
  {
    id: '2',
    question: 'krokodil varánusz leguán kaméleon 6',
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: 'cr',
  },
  {
    id: '3',
    question: 'zsiráf oroszlán hiéna elefánt 6',
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: 'cr',
  },
  {
    id: '4',
    question: 'csillag bolygó galaxis égitest 6',
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: 'cr',
  },
  {
    id: '5',
    question: 'számítógép laptop tablet telefon 6',
    createdAt: new Date(),
    updatedAt: new Date(),
    creatorId: 'cr',
  },
];

const parseQuestions = (questions: Question[]) => {
  const parsedQuestions = questions.map((question) => {
    const questionWords = question.question.split(' ').splice(0, 4);
    const words = questionWords.slice(0, 3);
    const scrambledWord = scramble(questionWords[3]);
    return {
      id: question.id,
      words: words,
      scrambledWord: scrambledWord,
      answer: questionWords[3],
    };
  });
  return parsedQuestions;
};

export default async function JatekOldal({
  params,
}: {
  params: { id: string };
}) {
  // choose the correct questions from questions1 or questions2 and questions3 based on the competitorIndex
  let questions: Question[] = dummyQuestions;

  // console.log(questions);
  // console.log(parseQuestions(questions));

  return (
    <div>
      <GameWrapper
        questions={parseQuestions(questions)}
        questionsWithAllWords={questions}
      ></GameWrapper>
    </div>
  );
}
