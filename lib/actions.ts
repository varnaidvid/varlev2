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
export async function deleteUser(username: string) { return prisma.user.delete({ where: { username } }) }

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

// QUESTIONS
export async function getQuestions() { return prisma.question.findMany({ include: { creator: { select: { username: true, }, }, }, }); }
export async function getOwnQuestions(username: string) { const session = await getServerSession(authOptions); return prisma.question.findMany({ where: { creatorId: session?.user.id } }); }
export async function deleteQuestion(id: string) { return prisma.question.delete({ where: { id } }); }
export async function deleteQuestions(ids: string[]) { console.log(ids); return prisma.question.deleteMany({ where: { id: { in: ids } } }); }
export async function updateQuestion(id: string, question: string) { return prisma.question.update({ where: { id }, data: { question } }); }


// TEAMS
export async function createTeam(name: string, description: string, competitors: string[]) {
  try {
    const users = await prisma.user.findMany({ where: { username: { in: competitors } } });
    const _competitors = await prisma.competitor.findMany({ where: { userId: { in: users.map(user => user.id) } } });

    const team = await prisma.team.create(
      { data: { name, description, competitors: { connect: _competitors.map(competitor => ({ id: competitor.id })) } } });

    const updatedCompetitors = await prisma.competitor.updateMany({ where: { userId: { in: users.map(user => user.id) } }, data: { teamId: team.id } });

    return team;
  } catch (error) {
    throw error;
  }
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