import { ReactNode } from 'react';
import './globals.css';
import { Poppins } from 'next/font/google';
import AuthProvider from '@/lib/auth/providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const poppins = Poppins({ weight: ['400', '700'], subsets: ['latin'] });

export const metadata = {
  title: 'NextJS with NextAuth & Prisma',
  description: 'Authentication Demo for NextJS 13',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="max-w-screen-lg w-full ml-auto mr-auto flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
