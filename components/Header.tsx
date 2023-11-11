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

const Header = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const components: { title: string; href: string; description: string }[] = [
    {
      title: 'Alert Dialog',
      href: '/docs/primitives/alert-dialog',
      description:
        'A modal dialog that interrupts the user with important content and expects a response.',
    },
    {
      title: 'Hover Card',
      href: '/docs/primitives/hover-card',
      description:
        'For sighted users to preview content available behind a link.',
    },
    {
      title: 'Progress',
      href: '/docs/primitives/progress',
      description:
        'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
    },
    {
      title: 'Scroll-area',
      href: '/docs/primitives/scroll-area',
      description: 'Visually or semantically separates content.',
    },
    {
      title: 'Tabs',
      href: '/docs/primitives/tabs',
      description:
        'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
    },
    {
      title: 'Tooltip',
      href: '/docs/primitives/tooltip',
      description:
        'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    },
  ];

  return (
    <header className="flex p-12 py-6 bg-gray-700 text-gray-300 items-center justify-between">
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
                  <ListItem href="#" title="Versenyek">
                    Tekintsdd meg az összes elérhető versenyt...
                  </ListItem>
                  <ListItem href="#" title="Feladatok">
                    Tégy egy pillantást a Számodra elérhető feladatokra.
                  </ListItem>
                  <ListItem href="#" title="Tanárok">
                    Nézdd meg a tanárok hosszú listáját!
                  </ListItem>
                  <ListItem href="#" title="Kurzusok">
                    Tekintsdd meg az összes elérhető kurzust...
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/bemutatkozas" legacyBehavior passHref>
                <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 bg-gray-700">
                  Bemutatkozás
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            {session && session?.user.role == 'webmester' && (
              <NavigationMenuItem>
                <Link href="/webmester" legacyBehavior passHref>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50 bg-gray-700">
                    Webmester
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
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
            Kijelentkezés
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
