export const dynamicParams = true;

import GameWrapper from '@/components/verseny/gameWrapper';
import { Competitor, Question } from '@prisma/client';
import {
  getCompetitionById,
  getTeamMembersByCompetitorId,
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
  const competition = await getCompetitionById(params.id);
  // console.log(competition);

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
  console.log(competitorIndex);
  if (competitorIndex === 0) {
    questions = competition?.questions1 as Question[];
  }
  if (competitorIndex === 1) {
    questions = competition?.questions2 as Question[];
  }
  if (competitorIndex === 2) {
    questions = competition?.questions3 as Question[];
  }

  // console.log(questions);
  // console.log(parseQuestions(questions));

  return (
    <div>
      <GameWrapper questions={parseQuestions(questions)}></GameWrapper>
    </div>
  );
}
