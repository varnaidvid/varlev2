'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CaretUp, Check, CircleNotch, Trash } from '@phosphor-icons/react';
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
import { useRouter } from 'next/navigation';
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
  getCompetitorsByYearAndClass,
  getTeamCreateCompetitors,
  getTeamMembers,
  getUsersWhoAreNotInATeam,
  updateTeam,
} from '@/lib/actions';
import { Competitor, User } from '@prisma/client';
import { Textarea } from '@/components/ui/textarea';

import * as React from 'react';

import { useDrop } from 'react-dnd';
import { VezerloContext } from '@/app/vezerlopult/layout';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dustbin } from '@/components/vezerlopult/csapatok/draggable/Dustbin';
import { Box } from '@/components/vezerlopult/csapatok/draggable/Box';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

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

const EditTeamForm = ({ name }: { name: string }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [year, setYear] = useState<number>();
  const [classNumber, setClassNumber] = useState<string>();

  const [teamMembers, setTeamMembers] = useState<customCompetitorType[]>([]);

  const [competitors, setCompetitors] = useState<customCompetitorType[]>([]);
  const [oldCompetitors, setOldCompetitors] = useState<string[]>([]);

  const {
    team,
    setTeam,
    draggableItems,
    setDraggableItems,
    droppedItems,
    setDroppedItems,
    isTeamLoading,
    setIsTeamLoading,
  } = React.useContext(VezerloContext);

  const sortedDraggables = React.useMemo(() => {
    return draggableItems?.sort((a, b) => a.localeCompare(b));
  }, [draggableItems]);

  useEffect(() => {
    async function getData() {
      const competitors = await getCompetitorsByYearAndClass(
        teamMembers[0].year,
        teamMembers[0].class
      );
      setYear(teamMembers[0].year);
      setClassNumber(teamMembers[0].class);

      setDraggableItems(
        competitors
          .map((competitor) => competitor.user.username)
          .filter((competitor) => !droppedItems?.includes(competitor))
          .sort((a, b) => a.localeCompare(b))
      );

      setCompetitors(competitors);
      setOldCompetitors(competitors.map((competitor) => competitor.id));

      setIsTeamLoading(false);
    }

    if (teamMembers && teamMembers.length > 0) {
      getData();
    }
  }, [teamMembers]);

  useEffect(() => {
    async function getMembers() {
      const teamMembers = await getTeamMembers(decodeURI(name));
      setDroppedItems(
        teamMembers.map((teamMember) => teamMember.user.username)
      );

      setTeamMembers(teamMembers);
    }
    if (session?.user?.role != 'diak' && name && teamMembers.length == 0) {
      setIsTeamLoading(true);

      form.setValue('competitors', ['', '', '']);
      setDraggableItems([]);
      setDroppedItems([]);

      getMembers();
    }
  }, []);

  useEffect(() => {
    form.setValue('competitors', droppedItems);
  }, [droppedItems]);

  useEffect(() => {
    const sorted = draggableItems?.sort((a, b) => a.localeCompare(b));
    setDraggableItems(sorted ?? []);
  }, [draggableItems]);

  useEffect(() => {
    if (form) {
      form.setValue('name', team?.name);
      form.setValue('description', team?.description);
    }
  }, [team]);

  const formSchema: any = z.object({
    name: z.string().min(3, {
      message: 'Legalább 3 karakter hosszú legyen a név.',
    }),
    description: z.string(),
    competitors: z.array(z.string()),
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
    toast.loading('Csapat módosítása folyamatban...', {
      id: 'updateTeam',
    });

    if (values.competitors.length != 3) {
      toast.error('3 versenyzőnek kell lennie egy csapatban!', {
        id: 'updateTeam',
      });

      setIsLoading(false);
      return;
    }

    try {
      const res = await updateTeam(
        name,
        values.name,
        values.description,
        year?.toString()!,
        classNumber!,
        oldCompetitors,
        values.competitors
      );

      toast.success('Sikeres frissítés!', {
        id: 'updateTeam',
      });

      form.reset();
      setDroppedItems([]);
      setDraggableItems([]);

      setTeam(res);

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);

      console.log(error);

      if ((error as Error).message.includes('Unique')) {
        form.setError('name', {
          type: 'manual',
          message: 'Létezik már ilyen nevű csapat!',
        });

        toast.error('Létezik már ilyen nevű csapat!', {
          id: 'updateTeam',
        });
        return;
      }

      toast.error('Hiba történt a létrehozás során!', {
        id: 'updateTeam',
      });
      return;
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Csapat szerkesztése</CardTitle>
        <CardDescription>
          Alábbi űrlap segítségével módosíthat egy meglévő csapatot.
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-5">
            <FormField
              control={form.control}
              name="name"
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

            <div className="flex gap-4">
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
                        value={year?.toString()}
                        required
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
                        value={classNumber}
                        required
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

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name=""
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>
                      {year && classNumber ? (
                        <span>
                          {year}. {classNumber} osztály tanulói
                        </span>
                      ) : (
                        <span>Nincs kiválasztva osztály</span>
                      )}
                    </FormLabel>
                    <FormControl>
                      <Card>
                        <ScrollArea
                          className={`h-[250px] ${
                            draggableItems?.length == 0 &&
                            droppedItems?.length! >= 0
                              ? 'relative'
                              : ''
                          }`}
                        >
                          <>
                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              {!isTeamLoading &&
                                (draggableItems?.length == 0
                                  ? year && classNumber
                                    ? 'Nincsenek versenyzők az osztályban'
                                    : 'Válasszon ki egy osztályt...'
                                  : droppedItems?.length! >= 0 &&
                                    draggableItems?.length == 0
                                  ? 'Nincs több tanuló'
                                  : '')}
                            </span>

                            <CardHeader>
                              <div className="grid md:grid-cols-2 gap-3">
                                {isTeamLoading
                                  ? Array.from(Array(3).keys()).map(
                                      (item, index) => (
                                        <div>
                                          <Skeleton
                                            key={index}
                                            className="h-12 w-full"
                                          />
                                        </div>
                                      )
                                    )
                                  : sortedDraggables?.map((item, index) => (
                                      <Box
                                        name={item}
                                        key={index}
                                        index={index}
                                      />
                                    ))}
                              </div>
                            </CardHeader>
                          </>
                        </ScrollArea>
                      </Card>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name=""
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Csapattagok</FormLabel>
                    <FormControl>
                      <Card className="h-[250px]">
                        <CardHeader>
                          <Dustbin />
                        </CardHeader>
                      </Card>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

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
              Frissítés
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default EditTeamForm;
