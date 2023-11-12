"use server";

import { prisma } from "@/prisma/db";
import { getServerSession } from "next-auth";
import authOptions from "./auth/authOptions";
import { hash } from "bcryptjs";

// USERS
export async function getUsers() { return prisma.user.findMany() }
export async function getUser(username: string) { return prisma.user.findUnique({ where: { username } }) }
export async function updateUsernameAndRole(username: string, newUsername: string, role: string) { return prisma.user.update({ where: { username }, data: { username: newUsername, role } }) }
export async function updateUserRole(username: string, role: string) { return prisma.user.update({ where: { username }, data: { role } }) }
export async function deleteUser(username: string) {
  const session = await getServerSession(authOptions);

  if (username === session?.user!.username!) {
    return {
      status: 500,
      message: "Nem sikerült a törlés, mert saját a fiókja benne volt."
    }
  }

  return prisma.user.delete({ where: { username } })
}

export async function createUser(username: string, password: string, role: string, year?: number, _class?: string) {
  const user = await prisma.user.create({ data: { username, password, role } })

  if (role == "diak") {
    await prisma.competitor.create({ data: { year: year!, class: _class!, userId: user.id } })
  }
}
export async function updateUserPassword(username: string, password: string) {
  const hashedPassword = await hash(password, 10);

  return prisma.user.update({ where: { username }, data: { password: hashedPassword } })
}

export async function deleteUsers(usernames: string[]) {
  const session = await getServerSession(authOptions);

  if (usernames.includes(session?.user!.username!)) {
    return {
      status: 500,
      message: "Nem sikerült a törlés, mert saját a fiókja benne volt."
    }
  }

  return await prisma.user.deleteMany({ where: { username: { in: usernames } } });
}
export async function getUsersWhoAreNotInATeam() { return prisma.user.findMany({ where: { Competitor: { is: null } } }) }
export async function getJurys() { return prisma.user.findMany({ where: { role: "zsuri" }, select: { username: true } }) }
export async function getJurysByCompetionId(competitionId: string) { return prisma.user.findMany({ where: { competitions: { some: { id: competitionId } } }, select: { username: true } }) }

// QUESTIONS
export async function getQuestions() { return prisma.question.findMany({ include: { creator: { select: { username: true, }, }, }, }); }
export async function getOwnQuestions(username: string) { const session = await getServerSession(authOptions); return prisma.question.findMany({ where: { creatorId: session?.user.id } }); }
export async function deleteQuestion(id: string) { return prisma.question.delete({ where: { id } }); }
export async function deleteQuestions(ids: string[]) {
  await prisma.attempt.deleteMany({ where: { questionId: { in: ids } } });
  return prisma.question.deleteMany({ where: { id: { in: ids } } });
}
export async function updateQuestion(id: string, question: string) { return prisma.question.update({ where: { id }, data: { question } }); }
export async function getQuestionsByIds(ids: string[]) { return prisma.question.findMany({ where: { id: { in: ids } } }); }
export async function getQuestionsByCompetitionId(competitionId: string) {
  const questions1 = await prisma.question.findMany({ where: { compatition1s: { some: { id: competitionId } } }, include: { creator: { select: { username: true } } } })
  const questions2 = await prisma.question.findMany({ where: { compatition2s: { some: { id: competitionId } } }, include: { creator: { select: { username: true } } } })
  const questions3 = await prisma.question.findMany({ where: { compatition3s: { some: { id: competitionId } } }, include: { creator: { select: { username: true } } } });

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


// TEAMS
export async function getTeams() { return prisma.team.findMany({ include: { competitors: true } }); }
export async function getTeamNamesWhereCompetitionIdNullAndYearEquals(year: number) { return prisma.team.findMany({ where: { competitionId: null, year } }); }
export async function getTeamsByCompetitionId(competitionId: string) { return prisma.team.findMany({ where: { competitionId }, include: { competitors: true } }); }
export async function getTeam(name: string) { return prisma.team.findUnique({ where: { name } }); }
export async function createTeam(name: string, description: string, year: string, _class: string, competitors: string[]) {
  try {
    const users = await prisma.user.findMany({ where: { username: { in: competitors } } });
    const _competitors = await prisma.competitor.findMany({ where: { userId: { in: users.map(user => user.id) } } });

    const team = await prisma.team.create({ data: { name, description, year: parseInt(year), class: _class, competitors: { connect: _competitors.map(competitor => ({ id: competitor.id })) } } });

    const updatedCompetitors = await prisma.competitor.updateMany({ where: { userId: { in: users.map(user => user.id) } }, data: { teamId: team.id } });

    return team;
  } catch (error) {
    throw error;
  }
}
export async function deleteTeams(names: string[]) {
  const teams = await prisma.team.findMany({ where: { name: { in: names } } });
  const competitors = await prisma.competitor.findMany({ where: { teamId: { in: teams.map(team => team.id) } } });
  const competitorIds = competitors.map(competitor => competitor.id);

  await prisma.attempt.deleteMany({ where: { competitorId: { in: competitorIds } } });

  await prisma.team.updateMany({ where: { name: { in: names } }, data: { competitionId: null } });

  return prisma.team.deleteMany({ where: { name: { in: names } } });
}
export async function updateTeam(oldTeamId: string, newName: string, newDescription: string, newYear: string, newClass: string, oldCompetitors: string[], newCompetitors: string[]) {
  try {
    const oldTeam = await prisma.team.findUnique({ where: { id: oldTeamId }, include: { competitors: true } });

    if (!oldTeam) {
      throw new Error(`Team ${oldTeamId} not found`);
    }

    const users = await prisma.user.findMany({ where: { username: { in: newCompetitors } } });
    const newCompetitorIds = await prisma.competitor.findMany({ where: { userId: { in: users.map(user => user.id) } } }).then(competitors => competitors.map(competitor => competitor.id));

    const updatedTeam = await prisma.team.update({
      where: { id: oldTeam.id },
      data: {
        name: newName,
        description: newDescription,
        year: parseInt(newYear),
        class: newClass,
        competitors: {
          disconnect: oldTeam.competitors.filter(competitor => !newCompetitorIds.includes(competitor.id)).map(competitor => ({ id: competitor.id })),
          connect: newCompetitorIds.filter(id => !oldTeam.competitors.some(competitor => competitor.id === id)).map(id => ({ id })),
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
  return prisma.team.findFirst({ where: { competitors: { some: { id: competitorId } } }, include: { competitors: true } });
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
export async function getCompetitorsByYearAndClass(year: number, _class: string) {
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
  return prisma.competitor.findUnique({ where: { userId }, select: { id: true } });
}


// COMPETITIONS
// export async function getCompetition(competitionId: string) {
//   return prisma.competition.findMany({ where: { id: competitionId } });
// }
export async function getCompetitionById(competitionId: string) {
  return prisma.competition.findUnique(
    {
      where: {
        id:
          competitionId
      }
      ,
      include: {
        questions1: true,
        questions2: true,
        questions3: true,
      }
    }
  )
}
export async function getCompetitions() { return prisma.competition.findMany() }
export async function deleteCompetitions(names: string[]) {
  await prisma.team.updateMany({ where: { competitionId: { in: names } }, data: { competitionId: null } });

  return prisma.competition.deleteMany({ where: { name: { in: names } } })
}
export async function getCompetitionByName(name: string) {
  return prisma.competition.findUnique({ where: { name } });
}
export async function getCompetitionsForZsuri(userId: string) {
  return prisma.competition.findMany({ where: { jurys: { some: { id: userId } } } });
}
export async function getCompetitionsForDiak(userId: string) {
  return prisma.competition.findMany({ where: { teams: { some: { competitors: { some: { userId } } } } } });
}

// ATTEMPTS
export async function didUserFinish(competitionId: string, competitorId: string) {
  const competition = await prisma.competition.findUnique({ where: { id: competitionId }, include: { questions1: true, questions2: true, questions3: true } });
  const questions = [...competition!.questions1, ...competition!.questions2, ...competition!.questions3];

  const attempts = await prisma.attempt.findMany({ where: { competitorId, questionId: { in: questions.map(question => question.id) } } });

  return attempts.length === questions.length;
}

export async function createAttempt({ competitionId, competitorId, questionId, answer, isCorrect, timeTaken }: { competitionId: string, competitorId: string, questionId: string, answer: string, isCorrect: boolean, timeTaken: number }) {
  return prisma.attempt.create({ data: { competitionId, competitorId, questionId, answer, isCorrect, TimeTaken: timeTaken } })
}
export async function createCompetition(
  name: string,
  description: string,
  year: string,
  startDate: Date,
  endDate: Date,
  questions: string[],
  jurys: string[],
  teams: string[]) {
  try {
    const _questions = await prisma.question.findMany({ where: { id: { in: questions } } });
    const _jurys = await prisma.user.findMany({ where: { username: { in: jurys } } });
    const _teams = await prisma.team.findMany({ where: { name: { in: teams } } });

    const questions1 = _questions.slice(0, _questions.length / 3).map(question => ({ id: question.id }));
    const questions2 = _questions.slice(_questions.length / 3, _questions.length / 3 * 2).map(question => ({ id: question.id }));
    const questions3 = _questions.slice(_questions.length / 3 * 2, _questions.length).map(question => ({ id: question.id }));

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

        jurys: { connect: _jurys.map(jury => ({ id: jury.id })) },
        teams: { connect: _teams.map(team => ({ id: team.id })) },
      },
    });

    let temp = await prisma.team.updateMany({ where: { id: { in: _teams.map(team => team.id) } }, data: { competitionId: competition.id } });
    console.log(temp)

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
  teams: string[]) {
  try {
    const _questions = await prisma.question.findMany({ where: { id: { in: questions } } });
    const _jurys = await prisma.user.findMany({ where: { username: { in: jurys } } });
    const _teams = await prisma.team.findMany({ where: { name: { in: teams } } });

    const questions1 = _questions.slice(0, _questions.length / 3).map(question => ({ id: question.id }));
    const questions2 = _questions.slice(_questions.length / 3, _questions.length / 3 * 2).map(question => ({ id: question.id }));
    const questions3 = _questions.slice(_questions.length / 3 * 2, _questions.length).map(question => ({ id: question.id }));

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

        jurys: { set: _jurys.map(jury => ({ id: jury.id })) },
        teams: { set: _teams.map(team => ({ id: team.id })) },
      },
    });

    await prisma.team.updateMany({ where: { id: { in: _teams.map(team => team.id) } }, data: { competitionId: competition.id } });

    return competition;
  } catch (error) {
    throw error;

  }
}
export async function getCompetitionData(name: string) {
  const competition = await prisma.competition.findUnique({ where: { name: name }, include: { teams: true, jurys: true, questions1: true, questions2: true, questions3: true } });

  const teamNames = competition!.teams.map(team => team.name);
  const teams = await prisma.team.findMany({ where: { name: { in: teamNames } }, include: { competitors: true } });

  const juryNames = competition!.jurys.map(jury => jury.username);
  const jurys = await prisma.user.findMany({ where: { username: { in: juryNames } } });

  const questions = [...competition!.questions1, ...competition!.questions2, ...competition!.questions3];

  return { teams, jurys, questions };
}

export async function getAttemptsByTeamId(teamId: string) {
  const competitors = await prisma.competitor.findMany({ where: { teamId } });

  const competitorIds = competitors.map(competitor => competitor.id);

  return prisma.attempt.findMany({ where: { competitorId: { in: competitorIds } } });
}

export async function getTeamStatsById(teamId: string, competitionId: string) {
  const teams = await prisma.team.findMany({ where: { competitionId } });
  const teamIds = teams.map(team => team.id);

  const competitors = await prisma.competitor.findMany({ where: { teamId: { in: teamIds } } });
  const competitorIds = competitors.map(competitor => competitor.id);

  const attempts = await prisma.attempt.findMany({ where: { competitorId: { in: competitorIds } } });

  const correctAttempts = attempts.filter(attempt => attempt.isCorrect).length;
  const totalAttempts = attempts.length;
  const totalTimeTaken = attempts.reduce((acc, attempt) => acc + attempt.TimeTaken, 0);
  const averageTimeTaken = totalAttempts > 0 ? totalTimeTaken / totalAttempts : 0;

  const points = correctAttempts * 100 - totalTimeTaken / 1000

  return {
    teamId,
    totalAttempts,
    correctAttempts,
    averageTimeTaken,
    points,
  };
}

// SiteInfo
export async function uploadHtmlText(htmlText: string) {
  const siteInfo = await prisma.siteInfo.findFirst();

  return prisma.siteInfo.update({ where: { id: siteInfo!.id }, data: { htmlText } });
}
export async function getHtmlText() {
  const siteInfo = await prisma.siteInfo.findFirst();

  return siteInfo?.htmlText;
}