'use server';

import { prisma } from '@/prisma/db';
import { getServerSession } from 'next-auth';
import authOptions from './auth/authOptions';
import { hash } from 'bcryptjs';
import OpenAI from 'openai';
import { UploadedQuestions } from '@/components/vezerlopult/feladatok/uploadedQuestionsTable/column';
import { Upload } from 'lucide-react';

// USERS
export async function getUsers() {
  return prisma.user.findMany();
}
export async function getUser(username: string) {
  return prisma.user.findUnique({ where: { username } });
}
export async function updateUsernameAndRole(
  username: string,
  newUsername: string,
  role: string
) {
  return prisma.user.update({
    where: { username },
    data: { username: newUsername, role },
  });
}
export async function updateUserRole(username: string, role: string) {
  return prisma.user.update({ where: { username }, data: { role } });
}
export async function deleteUser(username: string) {
  const session = await getServerSession(authOptions);

  if (username === session?.user!.username!) {
    return {
      status: 500,
      message: 'Nem sikerült a törlés, mert saját a fiókja benne volt.',
    };
  }

  return prisma.user.delete({ where: { username } });
}
export async function getTop5Teachers() {
  const topTeachers = await prisma.user.findMany({
    include: {
      questions: true,
    },
    orderBy: {
      questions: {
        _count: 'desc',
      },
    },
    take: 5,
  });

  return topTeachers.map((teacher) => ({
    value: teacher.questions.length,
    name: teacher.username,
    href: `/vezerlopult/felhasznalok/${teacher.username}`,
  }));
}
export async function teacherStatsByYear(name: string) {
  // find the teachers every question and group it by year the schema is the following: [
  // {
  //   name: "x. year",
  //   "Feladatok száma": 2488,
  // },
  // {
  //   name: "y. year",
  //   "Feladatok száma": 1445,
  // },]

  const teacher = await prisma.user.findUnique({
    where: { username: name },
    include: {
      questions: true,
    },
  });

  const questions = teacher!.questions;

  console.log(questions);
  //       question: 'klarinét trombita fuvola oboafajta 7' is in the following format the last element of every question is the year gropud by that

  const years = questions.map((question) => question.question.split(' ')[4]);

  console.log(years);

  const yearsMap: any = new Map();

  years.forEach((year) => {
    if (yearsMap.has(year)) {
      yearsMap.set(year, yearsMap.get(year) + 1);
    } else {
      yearsMap.set(year, 1);
    }
  });

  const yearsArray = [...yearsMap];

  const yearsWithSchema = yearsArray.map((year, index) => ({
    name: year[0],
    'Feladatok száma': year[1],
  }));

  yearsWithSchema.sort((a, b) => {
    if (parseInt(a.name) > parseInt(b.name)) {
      return 1;
    } else if (parseInt(a.name) < parseInt(b.name)) {
      return -1;
    } else {
      return 0;
    }
  });

  return yearsWithSchema;
}

export async function createUser(
  username: string,
  password: string,
  role: string,
  year?: number,
  _class?: string
) {
  const user = await prisma.user.create({ data: { username, password, role } });

  if (role == 'diak') {
    await prisma.competitor.create({
      data: { year: year!, class: _class!, userId: user.id },
    });
  }
}
export async function updateUserPassword(username: string, password: string) {
  const hashedPassword = await hash(password, 10);

  return prisma.user.update({
    where: { username },
    data: { password: hashedPassword },
  });
}

export async function deleteUsers(usernames: string[]) {
  const session = await getServerSession(authOptions);

  if (usernames.includes(session?.user!.username!)) {
    return {
      status: 500,
      message: 'Nem sikerült a törlés, mert saját a fiókja benne volt.',
    };
  }

  return await prisma.user.deleteMany({
    where: { username: { in: usernames } },
  });
}
export async function getUsersWhoAreNotInATeam() {
  return prisma.user.findMany({ where: { Competitor: { is: null } } });
}
export async function getJurys() {
  return prisma.user.findMany({
    where: { role: 'zsuri' },
    select: { username: true },
  });
}
export async function getJurysByCompetionId(competitionId: string) {
  return prisma.user.findMany({
    where: { competitions: { some: { id: competitionId } } },
    select: { username: true },
  });
}

// QUESTIONS
export async function getQuestions() {
  return prisma.question.findMany({
    include: { creator: { select: { username: true } } },
  });
}
export async function getOwnQuestions(username: string) {
  const session = await getServerSession(authOptions);
  return prisma.question.findMany({ where: { creatorId: session?.user.id } });
}
export async function deleteQuestion(id: string) {
  return prisma.question.delete({ where: { id } });
}
export async function deleteQuestions(ids: string[]) {
  await prisma.attempt.deleteMany({ where: { questionId: { in: ids } } });
  return prisma.question.deleteMany({ where: { id: { in: ids } } });
}
export async function updateQuestion(id: string, question: string) {
  return prisma.question.update({ where: { id }, data: { question } });
}
export async function getQuestionsByIds(ids: string[]) {
  return prisma.question.findMany({ where: { id: { in: ids } } });
}
export async function getQuestionsByCompetitionId(competitionId: string) {
  const questions1 = await prisma.question.findMany({
    where: { compatition1s: { some: { id: competitionId } } },
    include: { creator: { select: { username: true } } },
  });
  const questions2 = await prisma.question.findMany({
    where: { compatition2s: { some: { id: competitionId } } },
    include: { creator: { select: { username: true } } },
  });
  const questions3 = await prisma.question.findMany({
    where: { compatition3s: { some: { id: competitionId } } },
    include: { creator: { select: { username: true } } },
  });

  const questions = [...questions1, ...questions2, ...questions3];

  const filteredQuestions: typeof questions = [];
  const ids: string[] = [];

  for (const question of questions) {
    if (!ids.includes(question.id)) {
      ids.push(question.id);
      filteredQuestions.push(question);
    }
  }

  return filteredQuestions;
}

export async function createQuestions(questionsTextArray: string[]) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error('Unauthorized');
  }
  console.log(session.user);
  if (session.user.role !== 'webmester' && session.user.role !== 'tanar') {
    throw new Error('Forbidden');
  }
  await prisma.question.createMany({
    data: questionsTextArray.map((questionText) => ({
      question: questionText,
      creatorId: session.user.id,
    })),
  });
  return { message: 'Questions inserted' };
}

export async function generateQuestions(
  year: number,
  count: number
): Promise<UploadedQuestions[]> {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });
  const systemPrompt = `
    A feladatod, hogy készíts feladatokat egy játékhoz. Minden feladatnak négy különálló szóból és egy számból kell állnia. A szavaknak 3 szótagosnak kell lenniük és nem tartalmazhatnak szóközt. Válassz olyan szavakat, amik egyértelműen egy adott évfolyam számára relevánsak. A szám az évfolyamot jelöli, ami 5, 6, 7, vagy 8 lehet. A feladatoknak tematikusan összefüggőnek kell lenniük. JSON formátumban add vissza a feladatokat.
    
    ### PÉLDA VÁLASZ:
    [{
        "word1": "krokodil",
        "word2": "vipera",
        "word3": "teknősbéka",
        "word4": "aligátor",
        "year": 7
    },
    {
        "word1": "teniszlabda",
        "word2": "jégkorong",
        "word3": "focilabda",
        "word4": "kosárlabda",
        "year": 7
    },
    {
        "word1": "zongorázás",
        "word2": "gitározás",
        "word3": "hegedülés",
        "word4": "szaxofonozás",
        "year": 7
    }]

  `;
  const userPrompt = `
    Generálj ${count} darab feladatot a ${year}. évfolyam számára!
  `;

  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-1106',
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: userPrompt,
      },
    ],

    temperature: 0.6,
    max_tokens: 4095,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  console.log(
    '================================================================='
  );

  const responseString = response.choices[0].message.content;

  if (!responseString) {
    throw new Error('Failed to generate questions');
  }
  try {
    // Find the indices of the first '[' and the last ']'
    const startIndex = responseString.indexOf('[');
    const endIndex = responseString.lastIndexOf(']');

    if (startIndex === -1 || endIndex === -1) {
      throw new Error('Invalid JSON string: No valid array found');
    }

    // Extract the JSON array part of the string
    const validJsonString = responseString.substring(startIndex, endIndex + 1);

    const generatedQuestions: UploadedQuestions[] = JSON.parse(validJsonString);
    return generatedQuestions;
  } catch (error) {
    console.error('Failed to parse JSON string:', error);
    throw error; // or return an empty array, or handle the error as needed
  }
}

// TEAMS
export async function getTeams() {
  return prisma.team.findMany({ include: { competitors: true } });
}
export async function getTeamNamesWhereCompetitionIdNullAndYearEquals(
  year: number
) {
  return prisma.team.findMany({ where: { competitionId: null, year } });
}
export async function getTeamsByCompetitionId(competitionId: string) {
  return prisma.team.findMany({
    where: { competitionId },
    include: { competitors: true },
  });
}
export async function getTeam(name: string) {
  return prisma.team.findUnique({ where: { name } });
}
export async function createTeam(
  name: string,
  description: string,
  year: string,
  _class: string,
  competitors: string[]
) {
  try {
    const users = await prisma.user.findMany({
      where: { username: { in: competitors } },
    });
    const _competitors = await prisma.competitor.findMany({
      where: { userId: { in: users.map((user) => user.id) } },
    });

    const team = await prisma.team.create({
      data: {
        name,
        description,
        year: parseInt(year),
        class: _class,
        competitors: {
          connect: _competitors.map((competitor) => ({ id: competitor.id })),
        },
      },
    });

    const updatedCompetitors = await prisma.competitor.updateMany({
      where: { userId: { in: users.map((user) => user.id) } },
      data: { teamId: team.id },
    });

    return team;
  } catch (error) {
    throw error;
  }
}
export async function deleteTeams(names: string[]) {
  const teams = await prisma.team.findMany({ where: { name: { in: names } } });
  const competitors = await prisma.competitor.findMany({
    where: { teamId: { in: teams.map((team) => team.id) } },
  });
  const competitorIds = competitors.map((competitor) => competitor.id);

  await prisma.attempt.deleteMany({
    where: { competitorId: { in: competitorIds } },
  });

  await prisma.team.updateMany({
    where: { name: { in: names } },
    data: { competitionId: null },
  });

  return prisma.team.deleteMany({ where: { name: { in: names } } });
}
export async function updateTeam(
  oldTeamId: string,
  newName: string,
  newDescription: string,
  newYear: string,
  newClass: string,
  oldCompetitors: string[],
  newCompetitors: string[]
) {
  try {
    const oldTeam = await prisma.team.findUnique({
      where: { id: oldTeamId },
      include: { competitors: true },
    });

    if (!oldTeam) {
      throw new Error(`Team ${oldTeamId} not found`);
    }

    const users = await prisma.user.findMany({
      where: { username: { in: newCompetitors } },
    });
    const newCompetitorIds = await prisma.competitor
      .findMany({ where: { userId: { in: users.map((user) => user.id) } } })
      .then((competitors) => competitors.map((competitor) => competitor.id));

    const updatedTeam = await prisma.team.update({
      where: { id: oldTeam.id },
      data: {
        name: newName,
        description: newDescription,
        year: parseInt(newYear),
        class: newClass,
        competitors: {
          disconnect: oldTeam.competitors
            .filter((competitor) => !newCompetitorIds.includes(competitor.id))
            .map((competitor) => ({ id: competitor.id })),
          connect: newCompetitorIds
            .filter(
              (id) =>
                !oldTeam.competitors.some((competitor) => competitor.id === id)
            )
            .map((id) => ({ id })),
        },
      },
      include: { competitors: true },
    });

    return updatedTeam;
  } catch (error) {
    throw error;
  }
}

export async function getTeamMembersByCompetitorId(competitorId: string) {
  return prisma.team.findFirst({
    where: { competitors: { some: { id: competitorId } } },
    include: { competitors: true },
  });
}

// COMPETITORS
export async function getTeamCreateCompetitors(year: number, _class: string) {
  return prisma.competitor.findMany({
    where: {
      year: year,
      class: _class,
      teamId: null,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
}
export async function getTeamMembers(teamName: string) {
  return prisma.competitor.findMany({
    where: {
      team: {
        name: teamName,
      },
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
}
export async function getCompetitorsByYearAndClass(
  year: number,
  _class: string
) {
  return prisma.competitor.findMany({
    where: {
      year: year,
      class: _class,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });
}

export async function getCompitetorIdByUserId(userId: string) {
  return prisma.competitor.findUnique({
    where: { userId },
    select: { id: true },
  });
}

// COMPETITIONS
// export async function getCompetition(competitionId: string) {
//   return prisma.competition.findMany({ where: { id: competitionId } });
// }
export async function getCompetitionById(competitionId: string) {
  return prisma.competition.findUnique({
    where: {
      id: competitionId,
    },
    include: {
      questions1: true,
      questions2: true,
      questions3: true,
    },
  });
}
export async function getCompetitions() {
  return prisma.competition.findMany();
}
export async function closeCompetitions(names: string[]) {
  return prisma.competition.updateMany({
    where: { name: { in: names } },
    data: { endDate: new Date() },
  });
}
export async function getCompetitionByName(name: string) {
  return prisma.competition.findUnique({ where: { name } });
}
export async function getCompetitionsForZsuri(userId: string) {
  return prisma.competition.findMany({
    where: { jurys: { some: { id: userId } } },
  });
}
export async function getCompetitionsForDiak(userId: string) {
  return prisma.competition.findMany({
    where: { teams: { some: { competitors: { some: { userId } } } } },
  });
}

// ATTEMPTS
export async function didUserFinish(
  competitionId: string,
  competitorId: string
) {
  const competition = await prisma.competition.findUnique({
    where: { id: competitionId },
    include: { questions1: true, questions2: true, questions3: true },
  });
  const questions = [
    ...competition!.questions1,
    ...competition!.questions2,
    ...competition!.questions3,
  ];

  const attempts = await prisma.attempt.findMany({
    where: {
      competitorId,
      questionId: { in: questions.map((question) => question.id) },
    },
  });

  return attempts.length === questions.length;
}

export async function createAttempt({
  competitionId,
  competitorId,
  questionId,
  answer,
  isCorrect,
  timeTaken,
}: {
  competitionId: string;
  competitorId: string;
  questionId: string;
  answer: string;
  isCorrect: boolean;
  timeTaken: number;
}) {
  return prisma.attempt.create({
    data: {
      competitionId,
      competitorId,
      questionId,
      answer,
      isCorrect,
      TimeTaken: timeTaken,
    },
  });
}
export async function createCompetition(
  name: string,
  description: string,
  year: string,
  startDate: Date,
  endDate: Date,
  questions: string[],
  jurys: string[],
  teams: string[]
) {
  try {
    const _questions = await prisma.question.findMany({
      where: { id: { in: questions } },
    });
    const _jurys = await prisma.user.findMany({
      where: { username: { in: jurys } },
    });
    const _teams = await prisma.team.findMany({
      where: { name: { in: teams } },
    });

    const questions1 = _questions
      .slice(0, _questions.length / 3)
      .map((question) => ({ id: question.id }));
    const questions2 = _questions
      .slice(_questions.length / 3, (_questions.length / 3) * 2)
      .map((question) => ({ id: question.id }));
    const questions3 = _questions
      .slice((_questions.length / 3) * 2, _questions.length)
      .map((question) => ({ id: question.id }));

    const competition = await prisma.competition.create({
      data: {
        name,
        description,
        year: year,
        startDate,
        endDate,

        questions1: { connect: questions1 },
        questions2: { connect: questions2 },
        questions3: { connect: questions3 },

        jurys: { connect: _jurys.map((jury) => ({ id: jury.id })) },
        teams: { connect: _teams.map((team) => ({ id: team.id })) },
      },
    });

    let temp = await prisma.team.updateMany({
      where: { id: { in: _teams.map((team) => team.id) } },
      data: { competitionId: competition.id },
    });
    console.log(temp);

    return competition;
  } catch (error) {
    throw error;
  }
}
export async function updateCompetition(
  id: string,
  name: string,
  description: string,
  year: string,
  startDate: Date,
  endDate: Date,
  questions: string[],
  jurys: string[],
  teams: string[]
) {
  try {
    const _questions = await prisma.question.findMany({
      where: { id: { in: questions } },
    });
    const _jurys = await prisma.user.findMany({
      where: { username: { in: jurys } },
    });
    const _teams = await prisma.team.findMany({
      where: { name: { in: teams } },
    });

    const questions1 = _questions
      .slice(0, _questions.length / 3)
      .map((question) => ({ id: question.id }));
    const questions2 = _questions
      .slice(_questions.length / 3, (_questions.length / 3) * 2)
      .map((question) => ({ id: question.id }));
    const questions3 = _questions
      .slice((_questions.length / 3) * 2, _questions.length)
      .map((question) => ({ id: question.id }));

    const competition = await prisma.competition.update({
      where: { id },
      data: {
        name,
        description,
        year: year,
        startDate,
        endDate,

        questions1: { set: questions1 },
        questions2: { set: questions2 },
        questions3: { set: questions3 },

        jurys: { set: _jurys.map((jury) => ({ id: jury.id })) },
        teams: { set: _teams.map((team) => ({ id: team.id })) },
      },
    });

    await prisma.team.updateMany({
      where: { id: { in: _teams.map((team) => team.id) } },
      data: { competitionId: competition.id },
    });

    return competition;
  } catch (error) {
    throw error;
  }
}
export async function getCompetitionsTeamCount(name: string) {
  const competition = await prisma.competition.findUnique({
    where: { name },
    include: { teams: true },
  });

  return competition!.teams.length;
}
export async function getCompetitionData(name: string) {
  const competition = await prisma.competition.findUnique({
    where: { name: name },
    include: {
      teams: true,
      jurys: true,
      questions1: true,
      questions2: true,
      questions3: true,
    },
  });

  const teamNames = competition!.teams.map((team) => team.name);
  const teams = await prisma.team.findMany({
    where: { name: { in: teamNames } },
    include: { competitors: true },
  });

  const juryNames = competition!.jurys.map((jury) => jury.username);
  const jurys = await prisma.user.findMany({
    where: { username: { in: juryNames } },
  });

  const questions = [
    ...competition!.questions1,
    ...competition!.questions2,
    ...competition!.questions3,
  ];

  return { teams, jurys, questions };
}

export async function getAttemptsByTeamId(teamId: string) {
  const competitors = await prisma.competitor.findMany({ where: { teamId } });

  const competitorIds = competitors.map((competitor) => competitor.id);

  return prisma.attempt.findMany({
    where: { competitorId: { in: competitorIds } },
  });
}

export async function getTeamStatsById(teamId: string, competitionId: string) {
  const teamMembersData = await getEveryTeamMembersStatsSeperatelyByTeamId(
    teamId
  );

  let totalAttempts = 0;
  let correctAttempts = 0;
  let averageTimeTaken = 0;
  let points = 0;

  teamMembersData.forEach((teamMemberData) => {
    totalAttempts += teamMemberData.totalAttempts;
    correctAttempts += teamMemberData.correctAttempts;
    averageTimeTaken += teamMemberData.averageTimeTaken;
    points += teamMemberData.points;
  });

  const team = await prisma.team.findUnique({ where: { id: teamId } });

  return {
    teamId,
    team: team,
    totalAttempts,
    correctAttempts,
    averageTimeTaken,
    points,
  };
}
export async function getEveryTeamMembersStatsSeperatelyByTeamId(
  teamId: string
) {
  const competitors = await prisma.competitor.findMany({
    where: { teamId },
    include: { user: true },
  });
  const competitorIds = competitors.map((competitor) => competitor.id);

  const competitor1_attempts = await prisma.attempt.findMany({
    where: { competitorId: competitorIds[0] },
  });
  const competitor2_attempts = await prisma.attempt.findMany({
    where: { competitorId: competitorIds[1] },
  });
  const competitor3_attempts = await prisma.attempt.findMany({
    where: { competitorId: competitorIds[2] },
  });

  const competitor1_correctAttempts = competitor1_attempts.filter(
    (attempt) => attempt.isCorrect
  ).length;

  const competitor2_correctAttempts = competitor2_attempts.filter(
    (attempt) => attempt.isCorrect
  ).length;

  const competitor3_correctAttempts = competitor3_attempts.filter(
    (attempt) => attempt.isCorrect
  ).length;

  const competitor1_totalAttempts = competitor1_attempts.length;
  const competitor2_totalAttempts = competitor2_attempts.length;
  const competitor3_totalAttempts = competitor3_attempts.length;

  const competitor1_totalTimeTaken = competitor1_attempts.reduce(
    (acc, attempt) => acc + attempt.TimeTaken,
    0
  );
  const competitor2_totalTimeTaken = competitor2_attempts.reduce(
    (acc, attempt) => acc + attempt.TimeTaken,
    0
  );
  const competitor3_totalTimeTaken = competitor3_attempts.reduce(
    (acc, attempt) => acc + attempt.TimeTaken,
    0
  );

  const competitor1_averageTimeTaken =
    competitor1_totalAttempts > 0
      ? competitor1_totalTimeTaken / competitor1_totalAttempts
      : 0;
  const competitor2_averageTimeTaken =
    competitor2_totalAttempts > 0
      ? competitor2_totalTimeTaken / competitor2_totalAttempts
      : 0;
  const competitor3_averageTimeTaken =
    competitor3_totalAttempts > 0
      ? competitor3_totalTimeTaken / competitor3_totalAttempts
      : 0;

  const calculatePoints = (
    totalAttempts: number,
    correctAttempts: number,
    averageTimeTaken: number,
    totalTimeTaken: number
  ) => {
    const maxPointsCorrectness = 50; // Maximum possible points for correctness
    const maxPointsEfficiency = 50; // Maximum possible points for efficiency

    // Calculate correctness score
    const correctnessScore =
      (correctAttempts / totalAttempts) * maxPointsCorrectness;

    // Calculate efficiency score
    const efficiencyScore =
      (averageTimeTaken / totalTimeTaken) * maxPointsEfficiency;

    // Total points
    const totalPoints = correctnessScore + efficiencyScore;

    return parseInt(totalPoints.toFixed(2));
  };

  return [
    {
      competitor: competitors[0],
      username: competitors[0].user.username,
      totalAttempts: competitor1_totalAttempts,
      correctAttempts: competitor1_correctAttempts,
      averageTimeTaken: competitor1_averageTimeTaken,
      points: calculatePoints(
        competitor1_totalAttempts,
        competitor1_correctAttempts,
        competitor1_averageTimeTaken,
        competitor1_totalTimeTaken
      ),
    },
    {
      competitor: competitors[1],
      username: competitors[1].user.username,
      totalAttempts: competitor2_totalAttempts,
      correctAttempts: competitor2_correctAttempts,
      averageTimeTaken: competitor2_averageTimeTaken,
      points: calculatePoints(
        competitor2_totalAttempts,
        competitor2_correctAttempts,
        competitor2_averageTimeTaken,
        competitor2_totalTimeTaken
      ),
    },
    {
      competitor: competitors[2],
      username: competitors[2].user.username,
      totalAttempts: competitor3_totalAttempts,
      correctAttempts: competitor3_correctAttempts,
      averageTimeTaken: competitor3_averageTimeTaken,
      points: calculatePoints(
        competitor3_totalAttempts,
        competitor3_correctAttempts,
        competitor3_averageTimeTaken,
        competitor3_totalTimeTaken
      ),
    },
  ];
}

// SiteInfo
export async function uploadHtmlText(htmlText: string) {
  const siteInfo = await prisma.siteInfo.findFirst();

  return prisma.siteInfo.update({
    where: { id: siteInfo!.id },
    data: { htmlText },
  });
}
export async function getHtmlText() {
  const siteInfo = await prisma.siteInfo.findFirst();

  return siteInfo?.htmlText;
}

// stats
// based on competitionId -> get all teams -> get all competitors -> get all attempts | this action should return the stats of a team

// RELEVANT MODELS

// model Attempt {
//   id String @id @default(uuid())

//   competitor   Competitor @relation(fields: [competitorId], references: [id])
//   competitorId String

//   question   Question @relation(fields: [questionId], references: [id])
//   questionId String

//   isCorrect Boolean
//   TimeTaken Int

//   answer String

//   Competition   Competition @relation(fields: [competitionId], references: [id])
//   competitionId String

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }
// model Team {
//   id String @id @default(uuid())

//   year  Int // évfolyam
//   class String // osztály

//   name        String @unique
//   description String

//   // csak 3 versenyző lehet egy csapatban
//   competitors Competitor[]

//   // egyszerre csak egy verseny
//   competition   Competition? @relation(fields: [competitionId], references: [id])
//   competitionId String?

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }

// model Competitor {
//   id String @id @default(uuid())

//   year  Int // évfolyam
//   class String // osztály

//   // csak egy csapatba tartozhat
//   team   Team?   @relation(fields: [teamId], references: [id])
//   teamId String?

//   // csak egy felhasználóhoz tartozhat
//   user   User   @relation(fields: [userId], references: [id])
//   userId String @unique

//   attempts Attempt[]

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }

// model Competition {
//   id String @id @default(uuid())

//   name        String @unique
//   description String

//   // 4 különböző évfolyam
//   year String

//   image_url String @default("")

//   startDate DateTime
//   endDate   DateTime

//   questions1 Question[] @relation(name: "questions1Questions")
//   questions2 Question[] @relation(name: "questions2Questions")
//   questions3 Question[] @relation(name: "questions3Questions")

//   // zsurik
//   jurys User[]

//   teams    Team[]
//   attempts Attempt[]

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }
