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
        where: { username: 'webmester-webmester' },
        update: {},
        create: {
            username: 'webmester-webmester',
            password: webmesterPwd,
            role: 'webmester',
        },
    })
    const zsuri = await prisma.user.upsert({
        where: { username: 'zsuri-zsuri' },
        update: {},
        create: {
            username: 'zsuri-zsuri',
            password: zsuriPwd,
            role: 'zsuri',
        },
    })
    const tanar = await prisma.user.upsert({
        where: { username: 'tanar-tanar' },
        update: {},
        create: {
            username: 'tanar-tanar',
            password: tanarPwd,
            role: 'tanar',
        },
    })
    const diak = await prisma.user.upsert({
        where: { username: 'diak-diak' },
        update: {},
        create: {
            username: 'diak-diak',
            password: diakPwd,
            role: 'diak',
        },
    })
    const diakCompetitor = await prisma.competitor.upsert({
        where: { userId: diak.id },
        update: {},
        create: {
            userId: diak.id,
            year: 7,
            class: 'B',
        },
    })

    console.log({ webmester, zsuri, tanar, diak, diakCompetitor })
}


// medve oroszlán elefánt zsiráf 6
// hétfő kedd szerda csütörtök 5
// alma macska autó eső 7
// számítógép telefon könyv ceruza 5
// tél nyár tavasz ősz 8
// futball kosárlabda tenisz golf 5
// szaxofon gitár zongora hegedű 5
// tenger tó folyó patak 5
// banán napszemüveg strandlabda napernyő 6
// pizza hamburger sushi taco 5
// hold nap csillag bolygó 5
// festmény szobor rajz fotó 5
// repülő hajó vonat autóbusz 6
// róka nyúl medve hód 5
// kávé tea limonádé víz 5
// párizs london róma berlin 5
// régió térkép ország város 5
// zokni cipő kabát kalap 5
// nyár ősz tél tavasz 5
// csokoládé vanília eper pisztácia 6


async function seedQuestions() {
    // fetch users with role "tanar"
    const teachers = await prisma.user.findMany({ where: { role: 'tanar' } })

    const questions = [
        {
            id: "q1",
            question: "medve oroszlán elefánt zsiráf 6",
        },
        {
            id: "q2",
            question: "hétfő kedd szerda csütörtök 5",
        },
        {
            id: "q3",
            question: "alma macska autó eső 7",
        },
        {
            id: "q4",
            question: "számítógép telefon könyv ceruza 5",
        },
        {
            id: "q5",
            question: "tél nyár tavasz ősz 8",
        },
        {
            id: "q6",
            question: "futball kosárlabda tenisz golf 5",
        },
        {
            id: "q7",
            question: "szaxofon gitár zongora hegedű 5",
        },
        {
            id: "q8",
            question: "tenger tó folyó patak 5",
        },
        {
            id: "q9",
            question: "banán napszemüveg strandlabda napernyő 6",
        },
        {
            id: "q10",
            question: "pizza hamburger sushi taco 5",
        },
        {
            id: "q11",
            question: "hold nap csillag bolygó 5",
        },
        {
            id: "q12",
            question: "festmény szobor rajz fotó 5",
        },
        {
            id: "q13",
            question: "repülő hajó vonat autóbusz 6",
        },
        {
            id: "q14",
            question: "róka nyúl medve hód 5",
        },
        {
            id: "q15",
            question: "kávé tea limonádé víz 5",
        },
        {
            id: "q16",
            question: "párizs london róma berlin 5",
        },
        {
            id: "q17",
            question: "régió térkép ország város 5",
        },
        {
            id: "q18",
            question: "zokni cipő kabát kalap 5",
        },
        {
            id: "q19",
            question: "nyár ősz tél tavasz 5",
        },
        {
            id: "q20",
            question: "csokoládé vanília eper pisztácia 6",
        }




    ]

    // upsert questions to db
    const upsertedQuestions = await Promise.all(
        questions.map(async (question) => {
            return await prisma.question.upsert({
                where: { id: question.id },
                update: {},
                create: {
                    question: question.question,
                    creatorId: teachers[randomInt(0, teachers.length - 1)].id,
                },
            })
        })
    )

    console.log(upsertedQuestions)

}

async function seedCompetitions() {
    // fetch questions from role "tanr" creators
    let questions = await prisma.question.findMany({ include: { creator: true } })
    questions = questions.filter((question) => question.creator.role === "tanar") // webmester feladatai ne legyenek példa versenyben


    // filter questions




}

// seedAllRoles()
// seedStudents()
// seedQuestions()
seedCompetitions()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })