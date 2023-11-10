'use client';

import { ReactNode, useEffect, useState } from 'react';
import './globals.css';
import { Poppins } from 'next/font/google';
import AuthProvider from '@/lib/auth/providers';
import Header from '@/components/Header';
import { IconContext } from '@phosphor-icons/react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <IconContext.Provider
          value={{
            size: 32,
            weight: 'regular',
            mirrored: false,
          }}
        >
          <Toaster position="bottom-right" reverseOrder={false} gutter={8} />
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="max-w-screen-lg w-full ml-auto mr-auto flex-1">
                {children}
              </main>
            </div>
          </AuthProvider>
        </IconContext.Provider>
      </body>
    </html>
  );
}
