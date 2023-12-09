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
  // console.log(competitorIndex);
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
      <GameWrapper
        questions={parseQuestions(questions)}
        competitionId={competition?.id!}
        questionsWithAllWords={questions}
      ></GameWrapper>
    </div>
  );
}
