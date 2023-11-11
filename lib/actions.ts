"use server";

import { prisma } from "@/prisma/db";

// USERS
export async function getUsers() { return prisma.user.findMany() }
export async function getUser(username: string) { return prisma.user.findUnique({ where: { username } }) }
export async function createUser(username: string, password: string, role: string) { return prisma.user.create({ data: { username, password, role } }) }
export async function updateUser(username: string, password: string, role: string) { return prisma.user.update({ where: { username }, data: { password, role } }) }
export async function updateUserRole(username: string, role: string) { return prisma.user.update({ where: { username }, data: { role } }) }
export async function deleteUser(username: string) { return prisma.user.delete({ where: { username } }) }

// QUESTIONS
export async function getQuestions() {
  return prisma.question.findMany({
    include: {
      creator: {
        select: {
          username: true,
        },
      },
    },
  });
}

