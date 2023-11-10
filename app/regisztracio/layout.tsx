import { getServerSession } from 'next-auth';
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';

export default async function RegistrationLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession();

  if (session?.user.role !== 'webmester') {
    redirect('/?msg=Hozzáférés megtagadva!&type=error');
  }

  return (
    <div>
      <h1>Registrationlayout</h1>
      {children}
    </div>
  );
}
