'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from './ui/button';
import toast from 'react-hot-toast';

const Header = () => {
  const { data: session, status } = useSession();

  return (
    <header className="flex p-12 py-6 bg-blue-400 text-white items-center">
      <div className="flex-1">
        <Link href="/">VarleV2</Link>
      </div>
      <div className="flex-1">
        <Link href="/">Server-Side</Link>
        <Link href="/client-side">Client-Side</Link>
      </div>
      <div className="flex-1">
        {!session && status != 'loading' ? (
          <>
            <Button variant={'ghost'}>
              <Link href="/bejelentkezes">Bejelentkezés</Link>
            </Button>
            <Button variant={'ghost'}>
              <Link href="/regisztracio">Regisztráció</Link>
            </Button>
          </>
        ) : status != 'loading' ? (
          <Button
            variant={'ghost'}
            onClick={() => {
              toast.success('Sikeres kijelentkezés!');
              signOut({ redirect: false, callbackUrl: '/' });
            }}
          >
            Kijelentkezés
          </Button>
        ) : (
          ''
        )}
      </div>
    </header>
  );
};

export default Header;
