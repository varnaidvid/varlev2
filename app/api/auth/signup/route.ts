import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/db';

export async function POST(request: NextRequest) {
    const { username, password, role } = await request.json();
    const hashedPassword = await hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                username: username,
                password: hashedPassword,
                role: role,
            },
        });

        return NextResponse.json({
            status: 'ok',
        });
    } catch (err) {
        return new NextResponse(JSON.stringify({
            status: 'fail',
        }), {
            status: 500,
        });
    }
}