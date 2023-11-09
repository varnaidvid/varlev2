/* eslint-disable import/prefer-default-export */
import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/db';

export async function POST(request: NextRequest) {
    const { email, password } = await request.json();
    const hashedPassword = await hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                username: email,
            },
        });

        return NextResponse.json({
            status: 'ok',
            message: 'User was successfully created.',
            user: {
                email,
            },
        });
    } catch (err) {
        return new NextResponse(JSON.stringify({
            status: 'fail',
            message: (err as Error).message,
        }), {
            status: 500,
        });
    }
}