'use client';

import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <h1 className="text-center">Valami hiba történt!</h1>
      <br />
      <Link href="/vezerlopult">Vissza a vezérlőpultba</Link>
    </div>
  );
}
