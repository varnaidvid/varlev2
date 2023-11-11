'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CaretUp, Check, CircleNotch } from '@phosphor-icons/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
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
import {
  createTeam,
  getTeamCreateCompetitors,
  getUsersWhoAreNotInATeam,
} from '@/lib/actions';
import { Competitor, User } from '@prisma/client';
import { Textarea } from '@/components/ui/textarea';

import * as React from 'react';

import { useDrop } from 'react-dnd';
import { DraggableItem } from './draggableItem';
import Draggable from '@/components/draggable';
import { VezerloContext } from '@/app/vezerlopult/layout';

type customCompetitorType = {
  id: string;
  year: number;
  class: string;
  teamId: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    username: string;
  };
};

const NewTeamForm = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [year, setYear] = useState<number>();
  const [classNumber, setClassNumber] = useState<string>();

  const [competitors, setCompetitors] = useState<customCompetitorType[]>([]);

  const { setDraggableItems } = React.useContext(VezerloContext);

  useEffect(() => {
    async function getCompetitors() {
      const competitors = await getTeamCreateCompetitors(year!, classNumber!);

      setDraggableItems(
        competitors.map((competitor) => competitor.user.username)
      );

      setCompetitors(competitors);
    }

    if (session?.user?.role != 'diak' && year && classNumber) {
      form.setValue('competitors', ['', '', '']);

      getCompetitors();
    }
  }, [year, classNumber]);

  const formSchema: any = z.object({
    name: z.string().min(3, {
      message: 'Legalább 3 karakter hosszú legyen a név.',
    }),
    description: z.string(),
    competitors: z.array(z.string()).length(3, {
      message: 'Pontosan 3 versenyzőt kell megadni.',
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      competitors: ['', '', ''],
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    toast.loading('Csapat létrehozása folyamatban...', {
      id: 'signup',
    });

    try {
      // const res = await createTeam(values.name, values.description, values.competitors);

      toast.success('Sikeres létrehozás!', {
        id: 'signup',
      });

      setIsLoading(false);
      redirect('/vezerlopult/csapatok');
    } catch (error) {
      setIsLoading(false);

      if ((error as Error).message.includes('Unique')) {
        form.setError('username', {
          type: 'manual',
          message: 'Létezik már ilyen nevű csapat!',
        });

        return;
      }

      toast.error('Hiba történt a frissítés során!', {
        id: 'signup',
      });
      return;
    }
  }

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: '',
    drop: () => ({ name: 'Dustbin' }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;
  let backgroundColor = '#222';
  if (isActive) {
    backgroundColor = 'darkgreen';
  } else if (canDrop) {
    backgroundColor = 'darkkhaki';
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Új csapat létrehozása</CardTitle>
        <CardDescription>
          Alábbi űrlap segítségével hozhat létre új csapatot.
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
                  <FormLabel>Csapat név</FormLabel>
                  <FormControl>
                    <Input placeholder="A Bosszúállók" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Csapat rövid leírása</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A Bosszúállók egy szuperhősökből álló csapat, melynek célja..."
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <FormField
                control={form.control}
                name=""
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Évfolyam kiválasztása</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value: string) =>
                          setYear(parseInt(value))
                        }
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
                        onValueChange={(value: string) => setClassNumber(value)}
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

            <FormField
              control={form.control}
              name=""
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Kiválasztott osztály tanulói</FormLabel>
                  <FormControl>
                    <Card>
                      <CardHeader>
                        {year && classNumber ? (
                          <span>
                            {year}. {classNumber} osztály tanulói
                          </span>
                        ) : (
                          <CardTitle>...</CardTitle>
                        )}

                        <Draggable />
                      </CardHeader>
                    </Card>
                  </FormControl>
                </FormItem>
              )}
            />

            <p className="text-sm text-muted-foreground">
              Megjegyzés: csak azok a versenyzők elérhetőek kiválasztásra akik
              még nincsenek csapatban!
            </p>
          </CardContent>

          <CardFooter>
            <Button disabled={isLoading} className="w-full" type="submit">
              {isLoading && (
                <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
              )}
              Létrehozás
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default NewTeamForm;
