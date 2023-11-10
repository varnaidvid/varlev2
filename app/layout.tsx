'use client';

import { ReactNode, useEffect, useState } from 'react';
import './globals.css';
import { Poppins } from 'next/font/google';
import AuthProvider from '@/lib/auth/providers';
import Header from '@/components/Header';
import { IconContext } from '@phosphor-icons/react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
});

export default function RootLayout({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const [needToCall, setNeedToCall] = useState(false);

  const useEffectOnce = () => {
    console.log(needToCall);
    console.log(searchParams.get('msg'));

    if (needToCall) {
      if (searchParams.get('msg')) {
        if (searchParams.get('type') === 'error')
          toast.error(searchParams.get('msg'));
        if (searchParams.get('type') === 'success')
          toast.success(searchParams.get('msg'));
      }
    } else {
      setNeedToCall(true);
    }
  };

  useEffect(() => {
    useEffectOnce();
  }, [needToCall]);

  return (
    <html lang="en">
      <body className={poppins.className}>
        <IconContext.Provider
          value={{
            color: 'black',
            size: 32,
            weight: 'bold',
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
