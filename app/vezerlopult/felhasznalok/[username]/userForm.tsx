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
import {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useState,
} from 'react';
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { User } from '@prisma/client';
import { getUser, updateUsernameAndRole } from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { VezerloContext } from '../../layout';

const UserForm = () => {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const { user, setUser, isUserLoading } = useContext(VezerloContext);

  const formSchema: any = z.object({
    username: z.string().refine((data) => data.includes('-'), {
      message:
        'Felhasználónévnek tartalmaznia kell egy kötőjelet a vezeték- és keresztnév között.',
    }),
    role: z
      .string()
      .min(1, {
        message: 'Válasszon szerepkört.',
      })
      .refine(
        (data) =>
          data === 'webmester' ||
          data === 'zsuri' ||
          data === 'tanar' ||
          data === 'diak',
        {
          message: 'Válasszon szerepkört.',
        }
      ),
  });

  useEffect(() => {
    if (!user) return;

    form.setValue('username', user.username);
    form.setValue('role', user.role);
  }, [user]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      role: '',
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    toast.loading('Frissítés folyamatban...', {
      id: 'signup',
    });

    try {
      const newUser = await updateUsernameAndRole(
        user?.username!,
        values.username,
        values.role
      );

      toast.success('Sikeres frissítés!', {
        id: 'signup',
      });

      setIsLoading(false);

      setUser(newUser);

      if (session?.user.username == user?.username) {
        router.replace(`/vezerlopult/felhasznalok/${values.username}`);

        await update({
          ...session!.user,
          username: values.username,
          role: values.role,
        });
      }
    } catch (error) {
      setIsLoading(false);

      if ((error as Error).message.includes('Unique')) {
        form.setError('username', {
          type: 'manual',
          message: 'Ez a felhasználónév már foglalt!',
        });

        return;
      }

      toast.error('Hiba történt a frissítés során!', {
        id: 'signup',
      });
      return;
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Általános adatok frissítése</CardTitle>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-5">
            {isUserLoading && (
              <>
                <Skeleton className="w-full h-10" />
                <Skeleton className="w-full h-10" />
              </>
            )}
            {!isUserLoading && (
              <>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Felhasználónév</FormLabel>
                      <FormControl>
                        <Input required placeholder="Gipsz-Jakab" {...field} />
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
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Szerepkör</FormLabel>
                      <FormControl>
                        <Select
                          required
                          defaultValue={user?.role}
                          onValueChange={(val) => form.setValue('role', val)}
                        >
                          <SelectTrigger
                            disabled={session?.user.username == user?.username}
                          >
                            <SelectValue
                              defaultValue={user?.role}
                              placeholder="Válasszon szerepkört"
                            />
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
              </>
            )}
            <Button
              disabled={isLoading || isUserLoading}
              className="w-full"
              type="submit"
            >
              {isLoading && (
                <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
              )}
              Frissítés
            </Button>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
};

export default UserForm;
