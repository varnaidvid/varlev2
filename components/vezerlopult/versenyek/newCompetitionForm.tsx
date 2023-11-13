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
  createCompetition,
  createTeam,
  getJurys,
  getQuestions,
  getTeamCreateCompetitors,
  getTeamNamesWhereCompetitionIdNullAndYearEquals,
  getUsersWhoAreNotInATeam,
} from '@/lib/actions';
import { Competitor, Question, User } from '@prisma/client';
import { Textarea } from '@/components/ui/textarea';

import * as React from 'react';

import { DndProvider, useDrop } from 'react-dnd';
import { VezerloContext } from '@/app/vezerlopult/layout';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dustbin } from '@/components/vezerlopult/versenyek/draggableForJurys/Dustbin';
import { Box } from '@/components/vezerlopult/versenyek/draggableForJurys/Box';
import { ScrollArea } from '@/components/ui/scroll-area';

import { Box as TeamsBox } from './draggableForTeams/Box';
import { Dustbin as TeamsDustbin } from './draggableForTeams/Dustbin';
import { CompetitionsDataTable } from './competitionsDataTable/dataTable';
import QuestionsDataTableForCompetitions from './competitionsCreationDataTable/dataTable';
import { QuestionsColumnsCompetitions } from './competitionsCreationDataTable/columns';
import { Separator } from '@/components/ui/separator';
import { CalendarForm } from './datePicker';
import Backend from '@/lib/draggableBackend';
import DraggableBackend from '@/lib/draggableBackend';
import { set } from 'date-fns';

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
type QuestionWithUsername = Question & {
  creator: {
    username: string;
  };
};
export type AllParsedQuestion = {
  id: string;
  word1: string;
  word2: string;
  word3: string;
  word4: string;
  year: number;
  createdAt: Date;
  updatedAt: Date;
  username: string;
};

const NewCompetitionForm = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [year, setYear] = useState<number>();
  const [classNumber, setClassNumber] = useState<string>();

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [startHour, setStartHour] = useState<number>(0);
  const [startMinutes, setStartMinutes] = useState<number>(0);

  const [endDate, setEndDate] = useState<Date>(new Date());
  const [endHour, setEndHour] = useState<number>(0);
  const [endMinutes, setEndMinutes] = useState<number>(0);
  const {
    juryDraggableItems,
    setJuryDraggableItems,
    juryDroppedItems,
    setJuryDroppedItems,

    teamsDraggableItems,
    setTeamsDraggableItems,
    teamsDroppedItems,
    setTeamsDroppedItems,

    tasksDataTable,
  } = React.useContext(VezerloContext);

  useEffect(() => {
    form.setValue(
      'questions',
      tasksDataTable.map((task: any) => task.original.id)
    );
  }, [tasksDataTable]);

  const sortedDraggables = React.useMemo(() => {
    return juryDraggableItems?.sort((a, b) => a.localeCompare(b));
  }, [juryDraggableItems]);
  const sortedTeamsDraggables = React.useMemo(() => {
    return teamsDraggableItems?.sort((a, b) => a.localeCompare(b));
  }, [teamsDraggableItems]);

  const [jurys, setJurys] = useState<string[]>([]);
  useEffect(() => {
    async function fetchJurys() {
      const jurys = await getJurys();

      setJurys(
        jurys.map((jury) => jury.username).sort((a, b) => a.localeCompare(b))
      );
      setJuryDraggableItems(
        jurys.map((jury) => jury.username).sort((a, b) => a.localeCompare(b))
      );
    }

    if (session?.user?.role == 'webmester' || session?.user?.role == 'zsuri') {
      fetchJurys();
    }
  }, []);

  const [teams, setTeams] = useState<string[]>([]);
  useEffect(() => {
    async function fetchTeams() {
      const teams = await getTeamNamesWhereCompetitionIdNullAndYearEquals(
        year!
      );

      console.log(teams);

      setTeams(
        teams.map((team) => team.name).sort((a, b) => a.localeCompare(b))
      );
      setTeamsDraggableItems(
        teams.map((team) => team.name).sort((a, b) => a.localeCompare(b))
      );
    }

    if (
      (session?.user?.role == 'webmester' || session?.user.role == 'zsuri') &&
      year
    ) {
      fetchTeams();
    }
  }, [year]);

  useEffect(() => {
    const sorted = juryDraggableItems?.sort((a, b) => a.localeCompare(b));
    setJuryDraggableItems(sorted ?? []);
  }, [juryDraggableItems]);
  useEffect(() => {
    const sorted = teamsDraggableItems?.sort((a, b) => a.localeCompare(b));
    setTeamsDraggableItems(sorted ?? []);
  }, [teamsDraggableItems]);

  useEffect(() => {
    form.setValue('jurys', juryDroppedItems);
  }, [juryDroppedItems]);
  useEffect(() => {
    form.setValue('teams', teamsDroppedItems);
  }, [teamsDroppedItems]);

  const formSchema: any = z.object({
    name: z.string().min(3, {
      message: 'Legalább 3 karakter hosszú legyen a név.',
    }),
    description: z.string({
      required_error: 'Adja meg a verseny rövid leírását!',
    }),

    year: z.string(),

    startDate: z.date({
      required_error: 'Adja meg a verseny kezdő dátumát!',
      invalid_type_error: 'Adjon meg egy dátumot!',
    }),
    endDate: z.date({
      required_error: 'Adja meg a verseny záró dátumát!',
      invalid_type_error: 'Adjon meg egy dátumot!',
    }),

    questions: z.array(z.string()),
    jurys: z.array(z.string()),
    teams: z.array(z.string()),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      year: '',

      startDate: '',
      endDate: '',

      questions: [],

      jurys: [],

      teams: [],
    },
  });

  const parseAllQuestions = (questions: QuestionWithUsername[]) => {
    return questions.map((question) => ({
      id: question.id,
      word1: question.question.split(' ')[0],
      word2: question.question.split(' ')[1],
      word3: question.question.split(' ')[2],
      word4: question.question.split(' ')[3],
      year: parseInt(question.question.split(' ')[4]),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
      username: question.creator.username,
    }));
  };

  useEffect(() => {
    setJuryDroppedItems([]);
    setJuryDraggableItems([]);
    setTeamsDraggableItems([]);
    setTeamsDroppedItems([]);
  }, []);
  useEffect(() => {
    setTeamsDraggableItems([]);
    setTeamsDroppedItems([]);
  }, [year]);

  const [questions, setQuestions] = useState<AllParsedQuestion[]>([]);
  useEffect(() => {
    async function fetchQuestions() {
      const questions = await getQuestions();

      setQuestions(parseAllQuestions(questions));
    }

    if (
      (!questions || questions.length == 0) &&
      session?.user?.role == 'webmester'
    ) {
      fetchQuestions();
    }
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    toast.loading('Verseny létrehozása folyamatban...', {
      id: 'registration',
    });

    if (values.questions.length % 3 != 0) {
      toast.error('A feladatok száma nem osztható 3-mal!', {
        id: 'registration',
      });

      setIsLoading(false);
      return;
    }
    if (startHour == undefined || startMinutes == undefined) {
      toast.error('Adja meg a verseny kezdésének óráját és percét!', {
        id: 'registration',
      });

      setIsLoading(false);
      return;
    }
    if (endHour == undefined || endMinutes == undefined) {
      toast.error('Adja meg a verseny zárásának óráját és percét!', {
        id: 'registration',
      });

      setIsLoading(false);
      return;
    }

    const start = new Date(
      values.startDate.getFullYear(),
      values.startDate.getMonth(),
      values.startDate.getDate(),
      startHour,
      startMinutes
    );
    const end = new Date(
      values.endDate.getFullYear(),
      values.endDate.getMonth(),
      values.endDate.getDate(),
      endHour,
      endMinutes
    );

    try {
      const res = await createCompetition(
        values.name,
        values.description,
        year?.toString()!,
        start,
        end,
        values.questions,
        values.jurys,
        values.teams
      );

      toast.success('Sikeres létrehozás!', {
        id: 'registration',
      });

      console.log(res);

      setIsLoading(false);

      form.reset();

      setJuryDroppedItems([]);
      setJuryDraggableItems(jurys);

      setTeamsDroppedItems([]);
      setTeamsDraggableItems([]);

      setYear(undefined);
      setClassNumber(undefined);

      router.push('/vezerlopult/versenyek');
    } catch (error: any) {
      setIsLoading(false);

      console.log(error);

      if ((error as Error).message.includes('Unique')) {
        form.setError('name', {
          type: 'manual',
          message: 'Létezik már ilyen nevű verseny!',
        });

        toast.error('Létezik már ilyen nevű verseny!', {
          id: 'registration',
        });
        return;
      }

      toast.error('Hiba történt a létrehozás során!', {
        id: 'registration',
      });
      return;
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Új verseny létrehozása</CardTitle>
        <CardDescription>
          Alábbi űrlap segítségével hozhat létre új versenyt.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-5">
            <h4 className="font-bold">1. Alap információk</h4>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verseny név</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Dusza Árpád Webprogamozói Verseny"
                      {...field}
                      required
                    />
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
                  <FormLabel>Verseny rövid leírása</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A Dusza Árpád Webprogramozói verseny célja..."
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <Separator />

            <br />
            <h4 className="font-bold">2. Nyitás és zárás időpontja</h4>

            <CalendarForm
              control={form.control}
              name="startDate"
              form={form}
              date={startDate}
              setDate={setStartDate}
              label={'Verseny kezdése'}
              hour={startHour}
              setHour={setStartHour}
              minutes={startMinutes}
              setMinutes={setStartMinutes}
            />

            <CalendarForm
              control={form.control}
              name="endDate"
              form={form}
              date={endDate}
              setDate={setEndDate}
              label={'Verseny befejezése'}
              hour={endHour}
              setHour={setEndHour}
              minutes={endMinutes}
              setMinutes={setEndMinutes}
            />
            <Separator />

            <br />
            <h4 className="font-bold">3. Versenyző csapatok</h4>

            <DraggableBackend>
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name=""
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Elérhető csapatok</FormLabel>
                      <FormControl>
                        <Card>
                          <ScrollArea
                            className={`h-[250px] ${
                              juryDraggableItems?.length == 0 &&
                              juryDroppedItems?.length! >= 0
                                ? 'relative'
                                : ''
                            }`}
                          >
                            <>
                              {!year ? (
                                <span className="flex items-center justify-center mt-28">
                                  Válasszon ki évfolyamot
                                </span>
                              ) : (
                                teamsDraggableItems?.length == 0 && (
                                  <span className="flex items-center justify-center mt-28">
                                    Nem található elérhető csapat
                                  </span>
                                )
                              )}

                              <CardHeader>
                                <div className="grid md:grid-cols-2 gap-3">
                                  {sortedTeamsDraggables?.map((item, index) => (
                                    <TeamsBox
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
                      <FormLabel>Kiválasztott csapatok</FormLabel>
                      <FormControl>
                        <Card className="h-[250px]">
                          <CardHeader>
                            <TeamsDustbin />
                          </CardHeader>
                        </Card>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </DraggableBackend>
            <p className="text-sm text-muted-foreground">
              Megjegyzés: csak azok a csapatok elérhetőek az adott évfolyamban
              kiválasztásra akik nincsenek jelenleg versenyen!
            </p>
            <Separator />

            <br />
            <h4 className="font-bold">4. Megoldandó feladatok</h4>

            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Feladatok kiválasztása
              </label>

              <QuestionsDataTableForCompetitions
                columns={QuestionsColumnsCompetitions}
                data={questions}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Megjegyzés: feladatok számának számának hárommal oszthatónak kell
              lennie, hiszen hármas csapatokba külön-külön kapnak feladatokat!
            </p>

            <Separator />

            <br />
            <h4 className="font-bold">5. Zsűri tagok</h4>

            <DraggableBackend>
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name=""
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Elérhető zsűrik</FormLabel>
                      <FormControl>
                        <Card>
                          <ScrollArea
                            className={`h-[250px] ${
                              juryDraggableItems?.length == 0 &&
                              juryDroppedItems?.length! >= 0
                                ? 'relative'
                                : ''
                            }`}
                          >
                            <>
                              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>

                              <CardHeader>
                                <div className="grid md:grid-cols-2 gap-3">
                                  {sortedDraggables?.map((item, index) => (
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
                      <FormLabel>Kiválasztott zsűrik</FormLabel>
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
            </DraggableBackend>
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

export default NewCompetitionForm;
