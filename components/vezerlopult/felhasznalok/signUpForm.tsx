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
import Link from 'next/link';
import { ChangeEvent, MouseEvent, useState } from 'react';
import toast from 'react-hot-toast';
import { redirect, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const SignUpForm = () => {
  const router = useRouter();

  const [role, setRole] = useState<string>('');
  const [year, setYear] = useState<number>();
  const [classNumber, setClassNumber] = useState<string>();

  const formSchema: any = z.object({
    username: z.string().refine((data) => data.includes('-'), {
      message:
        'Felhasználónévnek tartalmaznia kell egy kötőjelet a vezeték- és keresztnév között.',
    }),
    password: z.string().min(6, {
      message: 'Legalább 6 karakter hosszú legyen a jelszó.',
    }),
    password2: z
      .string()
      .refine((data) => data === form.getValues('password'), {
        message: 'Jelszavaknak egyeznie kell.',
      }),
    role: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      password2: '',
      role: '',
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    toast.loading('Regisztráció folyamatban...', {
      id: 'signup',
    });

    const res = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: values.username,
        password: values.password,
        role: values.role,
        year: year,
        classNumber: classNumber,
      }),
    });

    if (!res.ok) {
      setIsLoading(false);

      res.json().then((temp) => {
        if (temp.message.includes('Unique'))
          toast.error('Létezik már ilyen felhasználónevű fiók.', {
            id: 'signup',
          });
        else {
          toast.error('Hiba történt a regisztráció során!', {
            id: 'signup',
          });
        }
      });

      return;
    }
    toast.success('Sikeres regisztráció!', {
      id: 'signup',
    });

    setIsLoading(false);
    router.push('/vezerlopult/felhasznalok/');
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Fiók létrehozása</CardTitle>
        <CardDescription>
          Alábbi űrlap segítségével hozhat létre új felhasználót.
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Felhasználónév</FormLabel>
                  <FormControl>
                    <Input placeholder="Gipsz-Jakab" {...field} />
                  </FormControl>
                  <FormDescription>
                    Vezetéknév és keresztnév kötőjellel elválasztva
                  </FormDescription>
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
                    <Input placeholder="******y*" type="password" {...field} />
                  </FormControl>
                  <FormDescription>
                    Legalább 6 karakter hosszú jelszó
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jelszó megerősítése</FormLabel>
                  <FormControl>
                    <Input placeholder="*******" type="password" {...field} />
                  </FormControl>
                  <FormDescription>Egyezzen a fenti jelszóval</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Szerepkör</FormLabel>
                  <FormControl>
                    <Select
                      required
                      onValueChange={(val) => {
                        setRole(val);
                        form.setValue('role', val);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Válasszon szerepkört" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="webmester">Webmester</SelectItem>
                        <SelectItem value="zsuri">Zsűri tag</SelectItem>
                        <SelectItem value="tanar">Tanár</SelectItem>
                        <SelectItem value="diak">Diák</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {role === 'diak' && (
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name=""
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Évfolyam kiválasztása</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value: string) => {
                            setYear(parseInt(value));
                            form.setValue('year', value);
                          }}
                          value={year?.toString()}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Évfolyam" />
                          </SelectTrigger>
                          <SelectContent className="w-2">
                            <SelectItem value="5">5.</SelectItem>
                            <SelectItem value="6">6.</SelectItem>
                            <SelectItem value="7">7.</SelectItem>
                            <SelectItem value="8">8.</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name=""
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Osztály kiválasztása</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value: string) => {
                            form.setValue('class', value);
                            setClassNumber(value);
                          }}
                          value={classNumber}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Osztály" />
                          </SelectTrigger>
                          <SelectContent className="w-2">
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                            <SelectItem value="D">D</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Button disabled={isLoading} className="w-full" type="submit">
              {isLoading && (
                <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
              )}
              Regisztráció
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
};

export default SignUpForm;
