'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import Link from 'next/link';
import toast from 'react-hot-toast';

import React from 'react';

import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { LogOut } from 'lucide-react';

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <header className="flex p-4 bg-gray-800/75 text-gray-300 items-center justify-between">
      <div className="flex">
        <Link href="/">VarleV2</Link>
      </div>
      <div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="bg-gray-700">
                Feladatok és Versenyek
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <ListItem href="/versenyek" title="Versenyek">
                    Tekintsdd meg az összes elérhető versenyt...
                  </ListItem>
                  <ListItem href="/feladatok" title="Feladatok">
                    Tégy egy pillantást a Számodra elérhető feladatokra.
                  </ListItem>
                  <ListItem href="/tanarok" title="Tanárok">
                    Nézdd meg a tanárok hosszú listáját!
                  </ListItem>
                  <ListItem href="/kurzusok" title="Kurzusok">
                    Tekintsdd meg az összes elérhető kurzust...
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/vezerlopult" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 bg-gray-700">
                  Vezérlőpult
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/bemutatkozas" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 bg-gray-700">
                  Bemutatkozás
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {session?.user.role == 'webmester' ||
              (session?.user.role == 'tanar' && (
                <NavigationMenuItem>
                  <Link href="/vezerlopult" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 bg-gray-700">
                      Vezérlőpult
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex">
        {!session && status != 'loading' ? (
          <>
            <Button variant={'ghost'}>
              <Link href="/bejelentkezes">Bejelentkezés</Link>
            </Button>
          </>
        ) : status != 'loading' ? (
          <Button
            variant={'ghost'}
            onClick={() => {
              toast.success('Sikeres kijelentkezés');
              signOut({ redirect: true, callbackUrl: '/' });
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <LogOut />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Kijelentkezés</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Button>
        ) : (
          ''
        )}
      </div>
    </header>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

export default Header;
