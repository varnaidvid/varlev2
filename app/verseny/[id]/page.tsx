export const dynamicParams = true;

// testing data
const exampleCompetition = {
  id: 'testcompetitionid',
  name: 'Teszt verseny',
  description: 'Ez egy teszt verseny',
  year: 2021,
  startDate: new Date(),
  endDate: new Date(),
  questions: [
    {
      id: '1',
      question: 'alma körte szilva barack 6',
      creatorId: 'alsjfdslkfjasdklfjaé',
    },
    {
      id: '2',
      question: 'ház sátor lakókocsi faház 6',
      creatorId: 'alsjfdslkfjasdklfjaé',
    },
    {
      id: '3',
      question: 'szék asztal szekrény polc 6',
      creatorId: 'alsjfdslkfjasdklfjaé',
    },
    {
      id: '4',
      question: 'kutya macska egér nyúl 6',
      creatorId: 'alsjfdslkfjasdklfjaé',
    },
    {
      id: '5',
      question: 'számítógép laptop tablet telefon 6',
      creatorId: 'alsjfdslkfjasdklfjaé',
    },
  ],
};

import Jatek from '@/components/verseny/jatek';
import { Question } from '@prisma/client';

const shuffle = (word: string) => {
  const shuffledWord = word
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
  return shuffledWord;
};

const parseQuestions = (questions: Question[]) => {
  const parsedQuestions = questions.map((question) => {
    const questionWords = question.question.split(' ').splice(0, 4);
    console.log(questionWords);
    const words = questionWords.slice(0, 3);
    console.log(words);

    const shuffledWord = shuffle(questionWords[3]);
    console.log(shuffledWord);

    console.log(questionWords);
    return {
      id: question.id,
      words: words,
      shuffledWord: shuffledWord.split(''),
      answer: questionWords[3],
    };
  });
  return parsedQuestions;
};

export default function JatekOldal({ params }: { params: { id: string } }) {
  //TODO: fetch real competition data
  const competition = exampleCompetition;
  //@ts-ignore
  const questions = parseQuestions(competition.questions);

  return (
    <div>
      {/* id: {params.id}
      <h1>Játék</h1>
      <p>itt majd legyen a játék</p> */}
      <Jatek questions={questions} />
    </div>
  );
}

// RELEVÁNS SÉMÁK:

// model Competition {
//     id String @id @default(uuid())
//     name        String
//     description String
//     year Int // évfolyam
//     startDate DateTime
//     endDate   DateTime
//     questions Question[]
//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
//   }

//   model Question {
//     id String @id @default(uuid())
//     question String
//     // syntax: word1 word2 word3 word4 6
//     // (4 szó, utolsó szám évfolyam)
//     competitions Competition[]
//     attempts     Attempt[]
//     creator   User   @relation(fields: [creatorId], references: [id])
//     creatorId String
//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
//   }
