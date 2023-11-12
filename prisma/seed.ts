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
    // reverse the names between -
    let usernames2 = userNames.map((userName) => {
        let names = userName.split("-")
        return `${names[1]}-${names[0]}`
    })

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

    let passwords2 = passwords.map((password) => {
        return password.split("-")[0] + "-" + password.split("-")[1]
    })

    let hashedPasswords = await Promise.all(passwords.map(async (password) => await hash(password, 10)))
    let hashedPasswords2 = await Promise.all(passwords2.map(async (password) => await hash(password, 10)))

    let users = userNames.map((userName, index) => {
        return {
            username: userName,
            password: hashedPasswords[index],
            role: "diak",
        }
    })

    let users2 = usernames2.map((userName, index) => {
        return {
            username: userName,
            password: hashedPasswords2[index],
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
    let upsertedUsers2 = await Promise.all(users2.map(async (user) => {
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
    let competitors2 = upsertedUsers2.map((user) => {
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
    let upsertedCompetitors2 = await Promise.all(competitors2.map(async (competitor) => {
        return await prisma.competitor.upsert({
            where: { userId: competitor.userId },
            update: {},
            create: competitor,
        })
    }))

    console.log(upsertedUsers)
    console.log(upsertedCompetitors)

    console.log(upsertedUsers2)
    console.log(upsertedCompetitors2)
}

async function seedAllRoles() {
    const webmesterPwd = await hash("webmesterJelszo", 10);
    const zsuriPwd = await hash("zsuriJelszo", 10);
    const tanarPwd = await hash("tanarJelszo", 10);
    const diakPwd = await hash("diakJelszo", 10);

    const webmester = await prisma.user.upsert({
        where: { username: 'webmester-webmester5' },
        update: {},
        create: {
            username: 'webmester-webmester5',
            password: webmesterPwd,
            role: 'webmester',
        },
    })
    const zsuri = await prisma.user.upsert({
        where: { username: 'zsuri-zsuri5' },
        update: {},
        create: {
            username: 'zsuri-zsuri5',
            password: zsuriPwd,
            role: 'zsuri',
        },
    })
    const tanar = await prisma.user.upsert({
        where: { username: 'tanar-tanar5' },
        update: {},
        create: {
            username: 'tanar-tanar5',
            password: tanarPwd,
            role: 'tanar',
        },
    })
    const diak = await prisma.user.upsert({
        where: { username: 'diak-diak5' },
        update: {},
        create: {
            username: 'diak-diak5',
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

seedAllRoles()
    // seedStudents()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })