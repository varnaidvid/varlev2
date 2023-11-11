import { randomInt } from 'crypto';
import { prisma } from './db';
import { hash } from 'bcryptjs';

async function seedStudents() {
    let userNames = [
        "Gipsz-Jakab",
        "Kovács-Béla",
        "Kiss-Pista",
        "Nagy-Ferenc",
        "Lakatos-János",
        "Szabó-Géza",
        "Horváth-Gábor",
        "Varga-László",
        "Tóth-István",
        "Kiss-Péter",
        "Jakab-Gipsz",
        "Béla-Kovács",
        "Pista-Kiss",
        "Ferenc-Nagy",
        "János-Lakatos",
        "Géza-Szabó",
        "Gábor-Horváth",
        "László-Varga",
        "István-Tóth",
        "Péter-Kiss",
    ]

    let passwords = [
        "Gipsz-Jakab-Jelszo",
        "Kovács-Béla-Jelszo",
        "Kiss-Pista-Jelszo",
        "Nagy-Ferenc-Jelszo",
        "Lakatos-János-Jelszo",
        "Szabó-Géza-Jelszo",
        "Horváth-Gábor-Jelszo",
        "Varga-László-Jelszo",
        "Tóth-István-Jelszo",
        "Kiss-Péter-Jelszo",
        "Jakab-Gipsz-Jelszo",
        "Béla-Kovács-Jelszo",
        "Pista-Kiss-Jelszo",
        "Ferenc-Nagy-Jelszo",
        "János-Lakatos-Jelszo",
        "Géza-Szabó-Jelszo",
        "Gábor-Horváth-Jelszo",
        "László-Varga-Jelszo",
        "István-Tóth-Jelszo",
        "Péter-Kiss-Jelszo",
    ]

    let hashedPasswords = await Promise.all(passwords.map(async (password) => await hash(password, 10)))

    let users = userNames.map((userName, index) => {
        return {
            username: userName,
            password: hashedPasswords[index],
            role: "diak",
        }
    })

    let upsertedUsers = await Promise.all(users.map(async (user) => {
        return await prisma.user.upsert({
            where: { username: user.username },
            update: {},
            create: user,
        })
    }))

    let competitors = upsertedUsers.map((user) => {
        return {
            userId: user.id,
            year: randomInt(5, 7),
            class: ["A", "B", "C", "D"][randomInt(0, 3)],
        }
    })

    let upsertedCompetitors = await Promise.all(competitors.map(async (competitor) => {
        return await prisma.competitor.upsert({
            where: { userId: competitor.userId },
            update: {},
            create: competitor,
        })
    }))

    console.log(upsertedUsers)
    console.log(upsertedCompetitors)
}

async function seedAllRoles() {
    const webmesterPwd = await hash("webmesterJelszo", 10);
    const zsuriPwd = await hash("zsuriJelszo", 10);
    const tanarPwd = await hash("tanarJelszo", 10);
    const diakPwd = await hash("diakJelszo", 10);

    const webmester = await prisma.user.upsert({
        where: { username: '10webmester-webmester10' },
        update: {},
        create: {
            username: '10webmester-webmester10',
            password: webmesterPwd,
            role: 'webmester',
        },
    })
    const zsuri = await prisma.user.upsert({
        where: { username: '10zsuri-zsuri10' },
        update: {},
        create: {
            username: '10zsuri-zsuri10',
            password: zsuriPwd,
            role: 'zsuri',
        },
    })
    const tanar = await prisma.user.upsert({
        where: { username: '10tanar-tanar10' },
        update: {},
        create: {
            username: '10tanar-tanar10',
            password: tanarPwd,
            role: 'tanar',
        },
    })
    const diak = await prisma.user.upsert({
        where: { username: '10diak-diak10' },
        update: {},
        create: {
            username: '10diak-diak10',
            password: diakPwd,
            role: 'diak',
        },
    })
    const diakCompetitor = await prisma.competitor.upsert({
        where: { userId: diak.id },
        update: {},
        create: {
            userId: diak.id,
            year: 6,
            class: 'A',
        },
    })

    console.log({ webmester, zsuri, tanar, diak, diakCompetitor })
}

// main()
seedStudents()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })