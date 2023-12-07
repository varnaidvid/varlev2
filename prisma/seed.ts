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

async function seedTanarok() {
    let userNames = [
        "Tanar-Gipsz-Jakab",
        "Tanar-Kovács-Béla",
        "Tanar-Kiss-Pista",
        "Tanar-Nagy-Ferenc",
        "Tanar-Lakatos-János",
    ]

    let password = "Tanar-Jelszo"

    let hashedPassword = await hash(password, 10)

    let users = userNames.map((userName) => {
        return {
            username: userName,
            password: hashedPassword,
            role: "tanar",
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
    const teachers = await prisma.user.findMany({ where: { role: "tanar" } })

    console.log(teachers)
    console.log(teachers.length)

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
            "question": "óceán tengeri ár sekély 8"
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
            "question": "moszkva bécs prága madrid 8"
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
            "question": "tél nyár tavasz ősz 8"
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
            "question": "párizs london róma berlin 5"
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
            "question": "csokoládé vanília eper pisztácia 6"
        },
        {
            "id": "q41",
            "question": "kígyó tigris cápa delfin 7"
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
            "question": "fagyasztó mikrohullámú sütő mosogatógép 7"
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
            "question": "tokió sydney kairó budapest 8"
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
            "question": "március május július november 7"
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
async function seedTeams() {
    // fetch users with role "diak"
    const students = await prisma.user.findMany({ where: { role: "diak" }, select: { id: true, username: true, Competitor: true } })

    let students_5 = students.filter((student) => student.Competitor?.year === 5)
    let students_6 = students.filter((student) => student.Competitor?.year === 6)
    let students_7 = students.filter((student) => student.Competitor?.year === 7)
    let students_8 = students.filter((student) => student.Competitor?.year === 8)

    let teams_5: any = []
    let teams_6: any = []
    let teams_7: any = []
    let teams_8: any = []

    const createTeams = (students: any[], teams: any[]) => {
        const numTeams = Math.floor(students.length / 3);
        for (let i = 0; i < numTeams; i++) {
            const teamMembers = students.splice(0, 3);
            teams.push(teamMembers);
        }

        return teams;
    };

    teams_5 = createTeams(students_5, teams_5);
    teams_6 = createTeams(students_6, teams_6);
    teams_7 = createTeams(students_7, teams_7);
    teams_8 = createTeams(students_8, teams_8);

    // upsert teams to db
    const teams5Upserted = await Promise.all(
        teams_5.map(async (team: any) => {
            console.log(team[0]);

            const teamId = "T" + team[0].id;
            const teamName = `${team[0].Competitor.year}. ${team[0].Competitor.class}`;
            const teamDescription = `${team[0].Competitor.year}. évfolyam ${team[0].Competitor.class} osztály csapata, ${team[0].username}, ${team[1].username}, ${team[2].username}`;

            const competitors = team.map((student: any) => ({ id: student.Competitor.id }));

            return await prisma.team.upsert({
                where: { id: teamId },
                update: {},
                create: {
                    id: teamId,
                    name: teamName,
                    description: teamDescription,
                    year: team[0].Competitor.year,
                    class: team[0].Competitor.class,
                    competitors: { connect: competitors },
                },
            });
        })
    );

    const teams6Upserted = await Promise.all(
        teams_6.map(async (team: any) => {
            console.log(team[0]);

            const teamId = "T" + team[0].id;
            const teamName = `${team[0].Competitor.year}. ${team[0].Competitor.class}`;
            const teamDescription = `${team[0].Competitor.year}. évfolyam ${team[0].Competitor.class} osztály csapata, ${team[0].username}, ${team[1].username}, ${team[2].username}`;

            const competitors = team.map((student: any) => ({ id: student.Competitor.id }));

            return await prisma.team.upsert({
                where: { id: teamId },
                update: {},
                create: {
                    id: teamId,
                    name: teamName,
                    description: teamDescription,
                    year: team[0].Competitor.year,
                    class: team[0].Competitor.class,
                    competitors: { connect: competitors },
                },
            });
        })
    );

    const teams7Upserted = await Promise.all(
        teams_7.map(async (team: any) => {
            console.log(team[0]);

            const teamId = "T" + team[0].id;
            const teamName = `${team[0].Competitor.year}. ${team[0].Competitor.class}`;
            const teamDescription = `${team[0].Competitor.year}. évfolyam ${team[0].Competitor.class} osztály csapata, ${team[0].username}, ${team[1].username}, ${team[2].username}`;

            const competitors = team.map((student: any) => ({ id: student.Competitor.id }));

            return await prisma.team.upsert({
                where: { id: teamId },
                update: {},
                create: {
                    id: teamId,
                    name: teamName,
                    description: teamDescription,
                    year: team[0].Competitor.year,
                    class: team[0].Competitor.class,
                    competitors: { connect: competitors },
                },
            });
        })
    );

    const teams8Upserted = await Promise.all(
        teams_8.map(async (team: any) => {
            console.log(team[0]);

            const teamId = "T" + team[0].id;
            const teamName = `${team[0].Competitor.year}. ${team[0].Competitor.class}`;
            const teamDescription = `${team[0].Competitor.year}. évfolyam ${team[0].Competitor.class} osztály csapata, ${team[0].username}, ${team[1].username}, ${team[2].username}`;

            const competitors = team.map((student: any) => ({ id: student.Competitor.id }));

            return await prisma.team.upsert({
                where: { id: teamId },
                update: {},
                create: {
                    id: teamId,
                    name: teamName,
                    description: teamDescription,
                    year: team[0].Competitor.year,
                    class: team[0].Competitor.class,
                    competitors: { connect: competitors },
                },
            });
        })
    );

    console.log(teams5Upserted);
    console.log(teams6Upserted);
    console.log(teams7Upserted);
    console.log(teams8Upserted);
}

async function seedCompetitions() {
    // fetch questions from role "tanr" creators
    let questions = await prisma.question.findMany({ include: { creator: true } })
    questions = questions.filter((question) => question.creator.role === "tanar") // webmester feladatai ne legyenek példa versenyben

    let jurys = await prisma.user.findMany({ where: { role: "zsuri" } })

    let teams = await prisma.team.findMany({ include: { competitors: true } })
    const team_5 = teams.filter((team) => team.competitors[0].year === 5)
    const team_6 = teams.filter((team) => team.competitors[0].year === 6)
    const team_7 = teams.filter((team) => team.competitors[0].year === 7)
    const team_8 = teams.filter((team) => team.competitors[0].year === 8)

    // filter questions by year: year should be 5. year = questions[0].question.split(" ")[question[0].question.split(" ").length - 1]

    function shuffle(array: any[]) {
        // sorting the questions in to 3 question packs
        let questions1 = []
        let questions2 = []
        let questions3 = []
        let i = 0
        while (i + 3 <= array.length) {
            questions1.push(array[i])
            i++
            questions2.push(array[i])
            i++
            questions3.push(array[i])
            i++
        }

        return [questions1, questions2, questions3]
    }

    const questions5 = questions.filter((question) => question.question.split(" ")[question.question.split(" ").length - 1] === "5")
    const questions6 = questions.filter((question) => question.question.split(" ")[question.question.split(" ").length - 1] === "6")
    const questions7 = questions.filter((question) => question.question.split(" ")[question.question.split(" ").length - 1] === "7")
    const questions8 = questions.filter((question) => question.question.split(" ")[question.question.split(" ").length - 1] === "8")

    let [questions5_1, questions5_2, questions5_3] = shuffle(questions5)
    let [questions6_1, questions6_2, questions6_3] = shuffle(questions6)
    let [questions7_1, questions7_2, questions7_3] = shuffle(questions7)
    let [questions8_1, questions8_2, questions8_3] = shuffle(questions8)

    const upsertedCopetition5_1 = await prisma.competition.upsert({
        where: { id: "c5_1" },
        update: {},
        create: {
            id: "c5_1",
            name: "Példa verseny 5. évfolyam 1. feladatcsomag",
            description: "Ez egy példa verseny. A 12 feladat van. A verseny 2023.11.11-én kezdődik és 2023.11.13-án ér véget.",
            year: "5" as any,
            startDate: new Date("2023-11-11"),
            endDate: new Date("2023-11-13"),

            questions1: { connect: questions5_1.map((question) => ({ id: question.id })) },
            questions2: { connect: questions5_2.map((question) => ({ id: question.id })) },
            questions3: { connect: questions5_3.map((question) => ({ id: question.id })) },

            teams: { connect: team_5.map((team) => ({ id: team.id })) },

            jurys: { connect: jurys.slice(0, randomInt(0, jurys.length - 1)).map((jury) => ({ id: jury.id })) },
        },
    })

    const upsertedCopetition6_1 = await prisma.competition.upsert({
        where: { id: "c6_1" },
        update: {},
        create: {
            id: "c6_1",
            name: "Példa verseny 6. évfolyam 1. feladatcsomag",
            description: "Ez egy példa verseny. A 12 feladat van. A verseny 2023.11.11-én kezdődik és 2023.11.13-án ér véget.",
            year: "6" as any,
            startDate: new Date("2023-11-11"),
            endDate: new Date("2023-11-20"),

            questions1: { connect: questions6_1.map((question) => ({ id: question.id })) },
            questions2: { connect: questions6_2.map((question) => ({ id: question.id })) },
            questions3: { connect: questions6_3.map((question) => ({ id: question.id })) },

            teams: { connect: team_6.map((team) => ({ id: team.id })) },

            jurys: { connect: jurys.slice(0, randomInt(0, jurys.length - 1)).map((jury) => ({ id: jury.id })) },
        },
    })
    const upsertedCopetition7_1 = await prisma.competition.upsert({
        where: { id: "c7_1" },
        update: {},
        create: {
            id: "c7_1",
            name: "Példa verseny 7. évfolyam 1. feladatcsomag",
            description: "Ez egy példa verseny. A 12 feladat van. A verseny 2023.11.11-én kezdődik és 2023.11.13-án ér véget.",
            year: "7" as any,
            startDate: new Date("2023-12-1"),
            endDate: new Date("2023-12-10"),

            questions1: { connect: questions7_1.map((question) => ({ id: question.id })) },
            questions2: { connect: questions7_2.map((question) => ({ id: question.id })) },
            questions3: { connect: questions7_3.map((question) => ({ id: question.id })) },

            teams: { connect: team_7.map((team) => ({ id: team.id })) },

            jurys: { connect: jurys.slice(0, randomInt(0, jurys.length - 1)).map((jury) => ({ id: jury.id })) },
        },
    })
    const upsertedCopetition8_1 = await prisma.competition.upsert({
        where: { id: "c8_1" },
        update: {},
        create: {
            id: "c8_1",
            name: "Példa verseny 8. évfolyam 1. feladatcsomag",
            description: "Ez egy példa verseny. A 12 feladat van. A verseny 2023.11.11-én kezdődik és 2023.11.13-án ér véget.",
            year: "8" as any,
            startDate: new Date("2023-11-11"),
            endDate: new Date("2023-12-13"),

            questions1: { connect: questions8_1.map((question) => ({ id: question.id })) },
            questions2: { connect: questions8_2.map((question) => ({ id: question.id })) },
            questions3: { connect: questions8_3.map((question) => ({ id: question.id })) },

            teams: { connect: team_8.map((team) => ({ id: team.id })) },

            jurys: { connect: jurys.slice(0, randomInt(0, jurys.length - 1)).map((jury) => ({ id: jury.id })) },
        },
    })



    // 5. és 6. évfolyamnak a versenye lett már vége....

    console.log(upsertedCopetition5_1)
    // console.log(upsertedCopetition6_1)
    // console.log(upsertedCopetition7_1)
    // console.log(upsertedCopetition8_1)
}
async function seedAttempts() {
    // fetch every user that is in a team and is a competitor (diak)
    const competitors = await prisma.competitor.findMany({ include: { user: true, team: true } })

    // fetch every question
    const questions = await prisma.question.findMany({ include: { compatition1s: true, compatition2s: true, compatition3s: true } })

    // create attempts
    let attempts: any[] = []

    // for every competitor
    competitors.forEach((competitor) => {
        // for every question that is in the competitor's team's competition either in the 1st, 2nd or 3rd question pack
        console.log(questions[0].compatition1s)

        questions.forEach((question) => {
            if (question.compatition1s.some((competition) => competition.id === competitor.team?.competitionId) ||
                question.compatition2s.some((competition) => competition.id === competitor.team?.competitionId) ||
                question.compatition3s.some((competition) => competition.id === competitor.team?.competitionId)) {
                // create an attempt
                attempts.push({
                    competitor: { connect: { id: competitor.id } },
                    question: { connect: { id: question.id } },
                    Competition: { connect: { id: competitor.team?.competitionId } },
                    answer: " ",
                    isCorrect: Math.random() < 0.5,
                    TimeTaken: randomInt(0, 60),
                })
            }
        })
    })

    console.log(attempts)

    // upsert attempts
    const upsertedAttempts = await Promise.all(
        attempts.map(async (attempt, index) => {
            return await prisma.attempt.upsert({
                where: { id: index.toString() },
                update: {},
                create: attempt,
            })
        })
    )

    console.log(upsertedAttempts)
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

async function seed() {
    try {
        await seedSiteInfo();
        await seedAllRoles();
        await seedStudents();
        await seedTanarok();
        await seedQuestions();
        await seedZsurik();
        await seedTeams();
        await seedCompetitions();
        await seedAttempts();
        await prisma.$disconnect();
    } catch (e) {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    }
}

seed();