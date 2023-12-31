'use client';

import { ReactNode, useEffect, useState } from 'react';
import './globals.css';
import { Poppins, Space_Mono, Source_Code_Pro } from 'next/font/google';
import AuthProvider from '@/lib/auth/providers';
import Header from '@/components/Header';
import { IconContext } from '@phosphor-icons/react';
import { Toaster } from 'react-hot-toast';
import { Metadata } from 'next';

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
});

const customMonoFont = Source_Code_Pro({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--custom-mono',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body
        className={
          poppins.className + ' ' + customMonoFont.variable + ' ' + 'bg-gray-50'
        }
      >
        <IconContext.Provider
          value={{
            size: 32,
            weight: 'regular',
            mirrored: false,
          }}
        >
          <Toaster
            position="bottom-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 5000,
            }}
          />
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="max-w-screen-lg w-full ml-auto mr-auto flex-1 pt-24">
                {children}
              </main>
            </div>
          </AuthProvider>
        </IconContext.Provider>
      </body>
    </html>
  );
}
