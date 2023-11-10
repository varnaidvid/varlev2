"use server";

import { prisma } from "@/prisma/db";

export async function getUsers() {
    return prisma.user.findMany();
}