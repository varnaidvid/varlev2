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
import {
  getUser,
  updateUserPassword,
  updateUsernameAndRole,
} from '@/lib/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { VezerloContext } from '../../layout';

const PasswordForm = () => {
  const router = useRouter();

  const { user, setUser, isUserLoading } = useContext(VezerloContext);

  const formSchema: any = z.object({
    password: z.string().min(6, {
      message: 'Legalább 6 karakter hosszú legyen a jelszó.',
    }),
    password2: z
      .string()
      .refine((data) => data === form.getValues('password'), {
        message: 'Jelszavaknak egyeznie kell.',
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      password2: '',
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    toast.loading('Frissítés folyamatban...', {
      id: 'signup',
    });

    try {
      const newUser = await updateUserPassword(
        user?.username!,
        values.password
      );

      toast.success('Sikeres frissítés!', {
        id: 'signup',
      });

      setIsLoading(false);

      form.setValue('password', '');
      form.setValue('password2', '');
    } catch (error) {
      setIsLoading(false);

      toast.error('Hiba történt a frissítés során!', {
        id: 'signup',
      });
      return;
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Jelszó módosítása</CardTitle>
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Új jelszó</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="*******"
                          type="password"
                          {...field}
                        />
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
                        <Input
                          placeholder="*******"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Egyezzen a fenti jelszóval
                      </FormDescription>
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

export default PasswordForm;
