"use server";

import { prisma } from "@/prisma/db";
import { getServerSession } from "next-auth";
import authOptions from "./auth/authOptions";
import { hash } from "bcryptjs";

// USERS
export async function getUsers() { return prisma.user.findMany() }
export async function getUser(username: string) { return prisma.user.findUnique({ where: { username } }) }
export async function createUser(username: string, password: string, role: string) { return prisma.user.create({ data: { username, password, role } }) }
export async function updateUsernameAndRole(username: string, newUsername: string, role: string) { return prisma.user.update({ where: { username }, data: { username: newUsername, role } }) }
export async function updateUserPassword(username: string, password: string) {
  const hashedPassword = await hash(password, 10);

  return prisma.user.update({ where: { username }, data: { password: hashedPassword } })
}
export async function updateUserRole(username: string, role: string) { return prisma.user.update({ where: { username }, data: { role } }) }
export async function deleteUser(username: string) { return prisma.user.delete({ where: { username } }) }
export async function deleteUsers(usernames: string[]) {
  const session = await getServerSession(authOptions);

  if (usernames.includes(session?.user?.username!)) {
    return {
      status: 500,
      message: "Nem sikerült a törlés, mert saját a fiókja benne volt."
    }
  }

  return await prisma.user.deleteMany({ where: { username: { in: usernames } } });
}

// QUESTIONS
export async function getQuestions() { return prisma.question.findMany({ include: { creator: { select: { username: true, }, }, }, }); }
export async function getOwnQuestions(username: string) { const session = await getServerSession(authOptions); return prisma.question.findMany({ where: { creatorId: session?.user.id } }); }

