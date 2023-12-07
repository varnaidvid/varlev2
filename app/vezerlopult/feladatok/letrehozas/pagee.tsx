'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadedQuestionsTable } from '@/components/vezerlopult/feladatok/uploadedQuestionsTable/dataTable';
import { type UploadedQuestions } from '@/components/vezerlopult/feladatok/uploadedQuestionsTable/column';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Progress } from '@/components/ui/progress';

import { CloudArrowUp, FileText, Question } from '@phosphor-icons/react';
import Dropzone from 'react-dropzone';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import {
  GearSix,
  CaretRight,
  PlusCircle,
  UserCirclePlus,
  UserList,
  Gauge,
} from '@phosphor-icons/react';
import Link from 'next/link';
import SignUpForm from '@/components/vezerlopult/felhasznalok/signUpForm';
import { Separator } from '@/components/ui/separator';
import { generateQuestions } from '@/lib/actions';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { type } from 'os';

const formSchema = z.object({
  // field for .txt file upload
  file: z
    .instanceof(File)
    .refine(
      (file) => file.type === 'text/plain' || file.name.endsWith('.txt'),
      {
        message: 'Csak .txt fájlok tölthetőek fel!', // Only .txt files can be uploaded!
      }
    ),
  // year: z.number(), // Évfolyam mező
  // opcionális évfolyam mező, tipusa number
  year: z.union([z.literal(5), z.literal(6), z.literal(7), z.literal(8)]),
  questionCount: z.union([z.literal(10), z.literal(20), z.literal(30)]),
});

export default function FeladatLetrehozas() {
  const [uploadedQuestions, setUploadedQuestions] = useState<
    UploadedQuestions[]
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // ✅ This will be type-safe and validated.
    console.log(values);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target == null) return;
      const text = e.target.result;
      console.log('File content:', text); // Process or use the text as needed
      // split text into lines
      if (!text) return;
      const lines = text.toString().split('\n');
      console.log(lines);

      //remove /r from lines
      const linesWithoutR = lines.map((line) => line.replace('\r', ''));
      console.log(linesWithoutR);

      //  question object:  {
      //     words: ["word1", "word2", "word3", "word4"],
      //     year: 6,
      //   }
      // go through lines and create question objects. check if the line is valid (contains 4 words and a number))
      linesWithoutR.map((line) => {
        const words = line.split(' ');
        if (words.length !== 5) return;
        const year = parseInt(words[4]);
        if (isNaN(year)) return;
        //check if the 4. words legth is shorter than five
        if (words[3].length < 5) return;
        // check if year is between 5 and 8
        if (year < 5 || year > 8) return;
        const question = {
          words: words.slice(0, 4),
          year,
        };
        // setUploadedQuestions((prev) => [...prev, question]);
        // TODO ^ this should be uncommented and fixed
      });
    };
    reader.onerror = (e) => {
      console.error('File reading error:', e);
    };
    reader.readAsText(values.file); // Read the file as text
  };

  const insertQuestions = async () => {
    const questionsFormatted = uploadedQuestions.map((question) => {
      //   return question.words.join(' ') + ' ' + question.year;
      // todo ^ this should be uncommented and fixed
    });

    const res = await fetch('/api/insert-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questions: questionsFormatted }),
    });
    console.log(res);
    if (res.status === 200) {
      toast.success('Sikeres feltöltés!');
    } else {
      toast.error('Hiba történt a feladatok feltöltés során!');
    }
    setUploadedQuestions([]);
  };

  const getGeneratedQuestions = async (year: number, count: number) => {
    console.log('getGeneratedQuestions');
    console.log(year, count);
    const questions = await generateQuestions(year, count);
    console.log(questions);
  };

  const handleAIQuestionGeneration = async () => {
    setIsGenerating(true);
    setProgress(0);
    generateQuestions(5, 10).then((res) => {
      //   setUploadedQuestions(res);
      // fix type and
    });
    // generated questions example: [{"words":["kutya","macska","nyúl","cica"],"year":5},{"words":["foci","kosár","röplabda","tenisz"],"year":5},{"words":["tévé","rádió","számítógép","telefon"],"year":5},{"words":["tavasz","nyár","ősz","tél"],"year":5},{"words":["alma","körte","szőlő","barack"],"year":5},{"words":["iskola","tanár","diák","füzet"],"year":5},{"words":["futás","úszás","kerékpározás","séta"],"year":5},{"words":["kék","zöld","piros","sárga"],"year":5},{"words":["hétfő","kedd","szerda","csütörtök"],"year":5},{"words":["kéz","láb","fej","has"],"year":5}]
    // setUploadedQuestions(generatedQuestions);

    // Szimulál egy hosszabb műveletet, ami fokozatosan növeli a progress értékét
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProgress(i);
    }

    setIsGenerating(false);
  };

  return (
    <>
      <title>VarléV2 - Új feladat létrehozása</title>
      <meta name="description" content="VarléV2 - Új feladat létrehozása" />

      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-semibold leading-none tracking-tight mb-2">
          Feladatok létrehozása
        </h1>

        <div className="flex items-center gap-4">
          <Link href="/vezerlopult">
            <span className="text-sm hover:underline">
              Vissza a vezérlőpulthoz
            </span>
          </Link>

          <Link href="/vezerlopult/feladatok">
            <Button variant="default">
              {' '}
              <Question className="w-6 h-6 mr-2" color="white" /> Feladatok
            </Button>
          </Link>
        </div>
      </div>

      <span className="leading-none tracking-tight text-base text-gray-500 flex items-center">
        <Link href="/vezerlopult">
          <div className="flex items-center gap-[2px] hover:underline">
            <Gauge className="h-6 w-6" /> Vezérlőpult
          </div>
        </Link>

        <CaretRight className="mx-1 h-4 w-4" />

        <Link href="/vezerlopult/feladatok/letrehozas">
          <div className="flex items-center gap-[2px] hover:underline">
            <Question className="h-6 w-6" /> Új feladat létrehozása
          </div>
        </Link>
      </span>

      <Separator className="mt-6 mb-8" />
      <div className="flex flex-col items-center gap-16 py-8 px-6">
        <Form {...form}>
          <form
            className="w-full"
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <FormItem>
              <Dropzone
                accept={{
                  'text/plain': ['.txt'],
                }}
                multiple={false}
                maxSize={20000000}
                onDrop={(acceptedFiles) => {
                  const file = acceptedFiles[0];
                  form.setValue('file', file);
                  form.handleSubmit(onSubmit)();
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps({
                      className: cn(
                        'p-3 mb-4 flex flex-col items-center justify-center w-full rounded-xl cursor-pointer border-[2px] border-border border-dashed'
                      ),
                    })}
                  >
                    <div className="flex items-center gap-3 mt-2 mb-2 flex-col">
                      <FileText
                        size={64}
                        weight="light"
                        className="text-neutral-400"
                      />
                      <FormLabel className="font-semibold text-center leading-tight text-muted-foreground">
                        Kattintson a böngészéshez
                        <br /> húzzon ide egy TXT fájlt!
                        <input {...getInputProps()} />
                      </FormLabel>
                      <span className="text-xs text-neutral-400">TXT</span>
                    </div>
                  </div>
                )}
              </Dropzone>
            </FormItem>
            {/* AI Generálás */}
            <FormItem>
              <FormLabel>Évfolyam</FormLabel>
              <FormControl>
                <Select {...form.register('year')}>
                  <SelectTrigger className="w-fit">
                    <SelectValue placeholder="Válassz egy évfolyamot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Évfolyamok</SelectLabel>
                      <SelectItem value="5">5. évfolyam</SelectItem>
                      <SelectItem value="6">6. évfolyam</SelectItem>
                      <SelectItem value="7">7. évfolyam</SelectItem>
                      <SelectItem value="8">8. évfolyam</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>

            <FormItem>
              <FormLabel>Kérdések száma</FormLabel>
              <FormControl>
                <Select {...form.register('questionCount')}>
                  <SelectTrigger className="w-fit">
                    <SelectValue placeholder="Válassz egy számot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Mennyiség</SelectLabel>
                      <SelectItem value="10">10 kérdés</SelectItem>
                      <SelectItem value="20">20 kérdés</SelectItem>
                      <SelectItem value="30">30 kérdés</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
            <FormItem>
              <Button onClick={handleAIQuestionGeneration}>
                AI Feladat Generálás
              </Button>
            </FormItem>
          </form>
        </Form>

        {isGenerating && (
          <div className="flex flex-col gap-2">
            <span>Feladatok generálása...</span>
            <Progress value={progress} />
          </div>
        )}

        {/* {isGenerating && <Progress value={progress} />}

        <Button onClick={handleAIQuestionGeneration}>
          AI Feladat Generálás
        </Button> */}

        <div className="flex flex-col items-center gap-8 w-full">
          <div className="flex justify-between w-full">
            <h3>
              Beimportált feladatok{' '}
              <span className="text-muted-foreground">(előnézet)</span>
            </h3>
            <Button
              size={'lg'}
              disabled={uploadedQuestions.length === 0}
              onClick={insertQuestions}
            >
              Feladatok feltöltése
              <CloudArrowUp size={20} weight="bold" className="ml-3" />
            </Button>
          </div>
          {/* map the uploaded questions into a table */}
          {/* <UploadedQuestionsTable columns={uploadedQuestions} /> */}
          <Button
            className={uploadedQuestions.length === 0 ? 'hidden' : ''}
            size={'lg'}
            disabled={uploadedQuestions.length === 0}
            onClick={insertQuestions}
          >
            Feladatok feltöltése
            <CloudArrowUp size={20} weight="bold" className="ml-3" />
          </Button>
        </div>
      </div>
      <></>
    </>
  );
}
