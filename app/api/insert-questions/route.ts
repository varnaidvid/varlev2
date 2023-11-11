import { prisma } from '@/prisma/db';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth/authOptions';

export async function POST(req: Request) {
  const session = await getServerSession({ req, ...authOptions });
  //   console.log(session);
  if (!session || !session.user) {
    return { status: 401, body: { message: 'Unauthorized' } };
  }
  if (session.user.role !== 'webmester' && session.user.role !== 'tanar') {
    return { status: 403, body: { message: 'Forbidden' } };
  }

  const data = await req.json();
  await prisma.question.createMany({
    data: data.questions.map((question: string) => {
      return {
        question,
        creatorId: session.user.id,
      };
    }),
  });

  return new Response(JSON.stringify({ message: 'Questions inserted' }), {
    headers: { 'content-type': 'application/json' },
    status: 200,
  });
}
