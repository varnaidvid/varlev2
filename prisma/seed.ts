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

async function seedZsurik() {
    let userNames = [
        "Zsuri-Gipsz-Jakab",
    ]

    let password = "Zsuri-Jelszo"

    let hashedPassword = await hash(password, 10)

    let users = userNames.map((userName) => {
        return {
            username: userName,
            password: hashedPassword,
            role: "zsuri",
        }
    })

    let upsertedUsers = await Promise.all(users.map(async (user) => {
        return await prisma.user.upsert({
            where: { username: user.username },
            update: {},
            create: user,
        })
    }))

    console.log({ upsertedUsers })
}


async function seedQuestions() {
    // fetch users with role "tanar"
    const teachers = await prisma.user.findMany({ where: { role: 'tanar' } })

    const questions = [
        {
            "id": "q1",
            "question": "krokodil jaguár gepárd leopárdminta 7"
        },
        {
            "id": "q2",
            "question": "vasárnap csütörtök péntek szombathely 8"
        },
        {
            "id": "q3",
            "question": "narancs banán alma mandarinfa 7"
        },
        {
            "id": "q4",
            "question": "laptop monitor egér billentyűzetkiosztás 8"
        },
        {
            "id": "q5",
            "question": "himalája alpok kárpátok andokhegyei 7"
        },
        {
            "id": "q6",
            "question": "jégkorong curling műkorcsolya jégtánc 8"
        },
        {
            "id": "q7",
            "question": "klarinét trombita fuvola oboafajta 7"
        },
        {
            "id": "q8",
            "question": "óceán tengeri ár sekély vízimalom 8"
        },
        {
            "id": "q9",
            "question": "szemüveg óra ékszer nyakláncdíszítés 7"
        },
        {
            "id": "q10",
            "question": "lasagne bolognai spagetti carbonara 8"
        },
        {
            "id": "q11",
            "question": "júpiter mars vénusz merkúr 7"
        },
        {
            "id": "q12",
            "question": "vászon akvarell pastell krétafestmény 8"
        },
        {
            "id": "q13",
            "question": "hőlégballon zeppelin siklóernyő léghajózás 7"
        },
        {
            "id": "q14",
            "question": "farkas sakál hiéna denevérfaj 8"
        },
        {
            "id": "q15",
            "question": "cappuccino espresso macchiato ristretto 7"
        },
        {
            "id": "q16",
            "question": "moszkva bécs prága madridi utca 8"
        },
        {
            "id": "q17",
            "question": "kontinens földrész sziget félsziget 7"
        },
        {
            "id": "q18",
            "question": "szandál papucs csizma bakancs 8"
        },
        {
            "id": "q19",
            "question": "április június szeptember októberi eső 7"
        },
        {
            "id": "q20",
            "question": "jégkrém fagylalt sorbet parfé 8"
        },
        {
            "id": "q21",
            "question": "medve oroszlán elefánt zsiráf 6"
        },
        {
            "id": "q22",
            "question": "hétfő kedd szerda csütörtök 5"
        },
        {
            "id": "q23",
            "question": "alma macska autó esőkabát 7"
        },
        {
            "id": "q24",
            "question": "számítógép telefon könyv ceruzatartó 5"
        },
        {
            "id": "q25",
            "question": "tél nyár tavasz őszi eső 8"
        },
        {
            "id": "q26",
            "question": "futball kosárlabda tenisz golflabda 5"
        },
        {
            "id": "q27",
            "question": "szaxofon gitár zongora hegedűművész 5"
        },
        {
            "id": "q28",
            "question": "tenger tó folyó patakvíz 5"
        },
        {
            "id": "q29",
            "question": "banán napszemüveg strandlabda napernyőnyílás 6"
        },
        {
            "id": "q30",
            "question": "pizza hamburger sushi tacószósz 5"
        },
        {
            "id": "q31",
            "question": "hold nap csillag bolygórendszer 5"
        },
        {
            "id": "q32",
            "question": "festmény szobor rajz fotóalbum 5"
        },
        {
            "id": "q33",
            "question": "repülő hajó vonat autóbuszjegy 6"
        },
        {
            "id": "q34",
            "question": "róka nyúl medve hódvárárok 5"
        },
        {
            "id": "q35",
            "question": "kávé tea limonádé vízvezeték 5"
        },
        {
            "id": "q36",
            "question": "párizs london róma berlintorta 5"
        },
        {
            "id": "q37",
            "question": "régió térkép ország városhatár 5"
        },
        {
            "id": "q38",
            "question": "zokni cipő kabát kalapot 5"
        },
        {
            "id": "q39",
            "question": "nyár ősz tél tavaszvirág 5"
        },
        {
            "id": "q40",
            "question": "csokoládé vanília eper pisztáciakrém 6"
        },
        {
            "id": "q41",
            "question": "kígyó tigris cápa delfinusz 7"
        },
        {
            "id": "q42",
            "question": "kedd szerda csütörtök pénteknap 8"
        },
        {
            "id": "q43",
            "question": "grapefruit limonádé citrom narancslé 7"
        },
        {
            "id": "q44",
            "question": "videokamera fényképezőgép mikrofon hangszórókészülék 8"
        },
        {
            "id": "q45",
            "question": "rock jazz blues reggaeton 7"
        },
        {
            "id": "q46",
            "question": "focilabda röplabda kosárlabda tollaslabda 8"
        },
        {
            "id": "q47",
            "question": "fagyasztó mikrohullámú sütő mosogatógép hűtőszekrény 7"
        },
        {
            "id": "q48",
            "question": "erdő sivatag mocsár dzsungelvidék 8"
        },
        {
            "id": "q49",
            "question": "szemceruza rúzs púder alapozókrém 7"
        },
        {
            "id": "q50",
            "question": "tortilla burrito enchilada quesadilla 8"
        },
        {
            "id": "q51",
            "question": "neptunusz uránusz szaturnusz jupiterhold 7"
        },
        {
            "id": "q52",
            "question": "akvarell grafika szénrajz olajfestmény 8"
        },
        {
            "id": "q53",
            "question": "komp hajó jet-ski jacht 7"
        },
        {
            "id": "q54",
            "question": "ló szamár tehén juhászkutya 8"
        },
        {
            "id": "q55",
            "question": "mocha frappuccino latte macchiato 7"
        },
        {
            "id": "q56",
            "question": "tokió sydney kairó new york-i 8"
        },
        {
            "id": "q57",
            "question": "hegy völgy fennsík barlangrendszer 7"
        },
        {
            "id": "q58",
            "question": "cipőzsinór nyakkendő öv kalapfény 8"
        },
        {
            "id": "q59",
            "question": "március május július novemberi hó 7"
        },
        {
            "id": "q60",
            "question": "fagyöngy hópehely jégcsap fenyőfa 8"
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

    // filter questions by year: year should be 5. year = questions[0].question.split(" ")[question[0].question.split(" ").length - 1]
    questions = questions.filter((question) => question.question.split(" ")[question.question.split(" ").length - 1] === "5")

    // sorting the questions in to 3 question packs
    let questions1 = []
    let questions2 = []
    let questions3 = []
    let i = 0
    while (i + 3 <= questions.length) {
        questions1.push(questions[i])
        i++
        questions2.push(questions[i])
        i++
        questions3.push(questions[i])
        i++
    }

    // upsert a competition to db
    const competition = await prisma.competition.upsert({
        where: { id: "c1" },
        update: {},
        create: {
            id: "c1",
            name: "Példa verseny",
            description: "Ez egy példa verseny. A 12 feladat van. A verseny 2023.11.11-én kezdődik és 2023.11.13-án ér véget.",
            year: "5" as any,
            startDate: new Date("2023-11-11"),
            endDate: new Date("2023-11-13"),
            questions1: { connect: questions1.map((question) => ({ id: question.id })) },
            questions2: { connect: questions2.map((question) => ({ id: question.id })) },
            questions3: { connect: questions3.map((question) => ({ id: question.id })) },
        },
    })

    console.log(competition)

    // delete this competition
    // await prisma.competition.delete({ where: { id: "c1" } })
}


async function seedSiteInfo() {
    // model SiteInfo {
    //     id String @id @default(uuid())

    //     htmlText String @default("")

    //     websiteName        String @default("")
    //     websiteDescription String @default("")

    //     createdAt DateTime @default(now())
    //     updatedAt DateTime @updatedAt
    //   }

    return await prisma.siteInfo.upsert({
        where: { id: "si1" },
        update: {},
        create: {
            id: "si1",
            htmlText: "",
            websiteName: "",
            websiteDescription: "",
        },
    })

}

seedAllRoles()
    // seedStudents()
    // seedQuestions()
    // seedZsurik()
    // seedCompetitions()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })