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
import { LogOut, LogIn } from 'lucide-react';

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  return (
    <header className="flex p-4 px-8 bg-gray-200/10 text-gray-800 items-center justify-between fixed w-full backdrop-blur-md z-50 border-b-2 border-slate-200">
      <div className="flex">
        <Link className="font-bold" href="/">
          Varle<span className="text-primary">V2</span>
        </Link>
      </div>
      <div>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 bg-gray-800/0">
                  Főoldal
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {session?.user.role == 'webmester' && (
              <NavigationMenuItem>
                <Link href="/vezerlopult" legacyBehavior passHref>
                  <NavigationMenuTrigger className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 bg-gray-800/0">
                    Vezérlőpult
                  </NavigationMenuTrigger>
                </Link>
              </NavigationMenuItem>
            )}

            {session?.user.role == 'diak' && (
              <NavigationMenuItem>
                <Link href="/vezerlopult" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2  font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 bg-gray-800/0">
                    Vezérlőpult
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}

            {session?.user.role == 'tanar' && (
              <NavigationMenuItem>
                <Link href="/vezerlopult" legacyBehavior passHref>
                  <NavigationMenuTrigger className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2  font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 bg-gray-800/0">
                    Vezérlőpult
                  </NavigationMenuTrigger>
                </Link>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    <ListItem title="Feladatok" href="/vezerlopult/feladatok">
                      Itt kezelheti a feladatokat, létrehozhat újakat, vagy
                      szerkesztheti a meglévőket.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}

            {session?.user.role == 'zsuri' && (
              <NavigationMenuItem>
                <Link href="/vezerlopult" legacyBehavior passHref>
                  <NavigationMenuTrigger className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-lg font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 bg-gray-800/0">
                    Vezérlőpult
                  </NavigationMenuTrigger>
                </Link>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    <ListItem title="Csapatok" href="/vezerlopult/csapatok">
                      Itt kezelheti a csapatokat, létrehozhat újakat vagy
                      szerkesztheti a meglévőket.
                    </ListItem>
                    <ListItem title="Feladatok" href="/vezerlopult/feladatok">
                      Itt kezelheti a feladatokat, létrehozhat újakat, vagy
                      szerkesztheti a meglévőket.
                    </ListItem>
                    <ListItem title="Versenyek" href="/vezerlopult/versenyek">
                      Itt kezelheti a versenyeket, létrehozhat újakat vagy
                      szerkesztheti a meglévőket.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}

            <NavigationMenuItem>
              <Link href="/bemutatkozas" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2  font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 bg-gray-800/0">
                  Rólunk
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <div className="flex">
        {!session && status != 'loading' ? (
          <>
            <Button variant={'outline'}>
              <Link href="/bejelentkezes">
                <div className="flex items-center">
                  <span className="mr-2 text">Bejelentkezés</span>
                  <span className="mt-px">
                    <LogIn />
                  </span>
                </div>
              </Link>
            </Button>
          </>
        ) : status != 'loading' ? (
          <Button
            variant={'outline'}
            onClick={() => {
              toast.success('Sikeres kijelentkezés');
              signOut({ redirect: true, callbackUrl: '/' });
            }}
          >
            <div className="flex items-center">
              <span className="mr-2">Kijelentkezés</span>
              <span className="mt-px">
                <LogOut />
              </span>
            </div>
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
