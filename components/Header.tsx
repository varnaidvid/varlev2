'use client';

import { signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

const Header = () => (
  <header className="flex p-12 py-6 bg-blue-400 text-white">
    <div className="flex-1">
      <Link href="/">NextJS Auth Demo</Link>
    </div>
    <nav className="flex-1">
      <ul className="flex justify-between">
        <li>
          <button type="button" onClick={() => signIn()}>
            Sign Inw
          </button>
        </li>
        <li>
          <Link href="/auth/signup">Sign Up</Link>
        </li>
        <li>
          <button type="button" onClick={() => signOut()}>
            Sign Out
          </button>
        </li>
      </ul>
    </nav>
  </header>
);

export default Header;
