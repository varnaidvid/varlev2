import { prisma } from '@/prisma/db';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/auth/authOptions';
export async function POST(req: Request): Promise<Response> {
  const session = await getServerSession({ req, ...authOptions });
  if (!session || !session.user) {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' }
    });
  }
  if (session.user.role !== 'webmester' && session.user.role !== 'tanar') {
    return new Response(JSON.stringify({ message: 'Forbidden' }), {
      status: 403,
      headers: { 'content-type': 'application/json' }
    });
  }

  const data = await req.json();
  await prisma.question.createMany({
    data: data.questions.map((question: string) => ({
      question,
      creatorId: session.user.id,
    })),
  });

  return new Response(JSON.stringify({ message: 'Questions inserted' }), {
    status: 200,
    headers: { 'content-type': 'application/json' }
  });
}
