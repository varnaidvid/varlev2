'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CircleNotch } from '@phosphor-icons/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { signIn, useSession } from 'next-auth/react';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from '@/components/ui/form';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const SignInPage = () => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user.username) {
      toast.error('Már be vagy jelentkezve!');
      router.push('/');
    }
  }, [session]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formSchema: any = z.object({
    username: z.string().refine((data) => data.includes('-'), {
      message: 'Vezetéknév és keresztnév kötőjellel elválasztva.',
    }),
    password: z.string().min(6, {
      message: 'Legalább 6 karakter hosszú.',
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    toast.loading('Bejelentkezés folyamatban...', {
      id: 'signin',
    });

    signIn('credentials', {
      username: values.username,
      password: values.password,
      callbackUrl: '/',
      redirect: false,
    }).then((result) => {
      if (result && result.error !== null) {
        if (result.status === 401) {
          setIsLoading(false);
          toast.error('Hibás felhasználónév vagy jelszó', {
            id: 'signin',
          });
        } else {
          setIsLoading(false);
          toast.error('Hiba történt a bejelentkezés során', {
            id: 'signin',
          });
        }
      } else {
        setIsLoading(false);
        toast.success('Sikeres bejelentkezés', {
          id: 'signin',
        });

        router.push('/');
        router.refresh();
      }
    });
  }

  return (
    <div
      className="min-h-screen place-items-center absolute top-0 flex flex-row w- mx-[25vw] left-0"
      style={{ width: '-webkit-fill-available' }}
    >
      <Card className="w-full drop-shadow-2xl bg-gray-100 justify-center text-gray-700 w-fill">
        <CardHeader>
          <CardTitle>Belépés</CardTitle>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Felhasználónév</FormLabel>
                    <FormControl>
                      <Input placeholder="Gipsz-Jakab" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jelszó</FormLabel>
                    <FormControl>
                      <Input placeholder="*******" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isLoading} className="w-full" type="submit">
                {isLoading && (
                  <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
                )}
                Bejelentkezés
              </Button>
            </CardContent>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default SignInPage;
