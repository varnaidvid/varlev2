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

import GameWrapper from '@/components/verseny/gameWrapper';
import { Competitor, Question } from '@prisma/client';
import {
  getCompetition,
  getTeamMembersByCompetitorId,
  getQuestionsByIds,
} from '@/lib/actions';
import { combineEventHandlers } from 'recharts/types/util/ChartUtils';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth/authOptions';

const scramble = (word: string) => {
  const scrambledWord = word
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
  return scrambledWord;
};

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
  const session = await getServerSession(authOptions);
  const competitions = await getCompetition(params.id);
  //   console.log(competitions);

  //get team members
  const team = await getTeamMembersByCompetitorId(
    session?.user.competitorId as string
  );
  const teamMembers = team?.competitors.map(
    (competitor: Competitor) => competitor.id
  );

  //sort team members abc order
  const sortedTeamMembers = teamMembers?.sort((a: string, b: string) =>
    a.localeCompare(b)
  );

  //find if competitor is the 1st, 2nd or 3rd member in sorterTeamMembers
  const competitorIndex = sortedTeamMembers?.indexOf(
    session?.user.competitorId as string
  );

  // choose the correct questions from questions1 or questions2 and questions3 based on the competitorIndex
  let questions: Question[] = [];
  if (competitorIndex === 0) {
    questions = await getQuestionsByIds(competitions[0].questions1);
  }
  if (competitorIndex === 1) {
    questions = await getQuestionsByIds(competitions[0].questions2);
  }
  if (competitorIndex === 2) {
    questions = await getQuestionsByIds(competitions[0].questions3);
  }

  //   console.log(questions);

  return (
    <div>
      <GameWrapper questions={parseQuestions(questions)}></GameWrapper>
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

// model Attempt {
//     id String @id @default(uuid())
//     competitor   Competitor @relation(fields: [competitorId], references: [id])
//     competitorId String
//     question   Question @relation(fields: [questionId], references: [id])
//     questionId String
//     isCorrect Boolean
//     TimeTaken Int
//     answer String
//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
//   }
