import { prisma } from './db';
import { hash } from 'bcryptjs';

async function main() {
    const webmesterPwd = await hash("webmesterJelszo", 10);
    const zsuriPwd = await hash("zsuriJelszo", 10);
    const tanarPwd = await hash("tanarJelszo", 10);
    const diakPwd = await hash("diakJelszo", 10);

    const webmester = await prisma.user.upsert({
        where: { username: 'webmester-webmester4' },
        update: {},
        create: {
            username: 'webmester-webmester4',
            password: webmesterPwd,
            role: 'webmester',
        },
    })
    const zsuri = await prisma.user.upsert({
        where: { username: 'zsuri-zsuri4' },
        update: {},
        create: {
            username: 'zsuri-zsuri4',
            password: zsuriPwd,
            role: 'zsuri',
        },
    })
    const tanar = await prisma.user.upsert({
        where: { username: 'tanar-tanar4' },
        update: {},
        create: {
            username: 'tanar-tanar4',
            password: tanarPwd,
            role: 'tanar',
        },
    })
    const diak = await prisma.user.upsert({
        where: { username: 'diak-diak4' },
        update: {},
        create: {
            username: 'diak-diak4',
            password: diakPwd,
            role: 'diak',
        },
    })

    console.log({ webmester, zsuri, tanar, diak })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })