import { hash } from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma/db';
import { createUser } from '@/lib/actions';

export async function POST(request: NextRequest) {
    const { username, password, role } = await request.json();
    const hashedPassword = await hash(password, 10);
    try {
        await createUser(username, hashedPassword, role);

        return NextResponse.json({
            status: 'ok',
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