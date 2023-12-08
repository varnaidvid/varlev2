'use client';

import { createQuestions, generateQuestions } from '@/lib/actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  CloudArrowUp,
  FileText,
  Question,
  CaretRight,
  Gauge,
  Lightning,
  UserList,
} from '@phosphor-icons/react';
import { Separator } from '@/components/ui/separator';
import Dropzone from 'react-dropzone';
import { uploadedQuestionsColumns } from '@/components/vezerlopult/feladatok/uploadedQuestionsTable/column';
import { useContext } from 'react';
import { VezerloContext } from '@/app/vezerlopult/layout';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

import { Progress } from '@/components/ui/progress';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadedQuestionsTable } from '@/components/vezerlopult/feladatok/uploadedQuestionsTable/dataTable';
import { type UploadedQuestions } from '@/components/vezerlopult/feladatok/uploadedQuestionsTable/column';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { set } from 'date-fns';

const formSchema = z.object({
  questions: z.array(
    z.object({
      word1: z.string(),
      word2: z.string(),
      word3: z.string(),
      word4: z.string(),
      year: z.number(),
    })
  ),
  year: z.string().optional(),
  questionCount: z.string().optional(),
});

export default function UploadQuestions() {
  const { uploadedQuestions, setUploadedQuestions } =
    useContext(VezerloContext);
  //   const [uploadedQuestions, setUploadedQuestions] = useState<
  //     UploadedQuestions[]
  //   >([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const handleAIQuestionGeneration = async () => {
    setIsGenerating(true);
    setProgress(0);
    generateQuestions(5, 10).then((res) => {
      setUploadedQuestions(res);
    });
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProgress(i);
    }

    setIsGenerating(false);
  };

  const handleFileDrop = (acceptedFiles: File[]) => {
    setUploadedQuestions([]);
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const content = reader.result;
      // create an array of strings from the file contents each line, the white spaces should be removed from the beginning and the end of the string
      const allLines = content
        ?.toString()
        .split('\n')
        .map((line) => line.trim());
      //   console.log(allLines);

      if (!allLines || allLines.length === 0) {
        toast.error('A feltöltött fájl nem tartalmaz feladatokat!');
        return;
      }

      let lines = []; // the array of lines that are valid
      // iterate over the allLines and check if the line is valid. conditions: the line contains 4 words and a number at the end which could be only 5, 6, 7 or 8, the words and the number should be separated by a single space. also each of the words should be at least 5 charachters or longer
      for (let i = 0; i < allLines.length; i++) {
        const line = allLines[i];
        const words = line.split(' ');
        if (
          words.length === 5 &&
          words[0].length >= 5 &&
          words[1].length >= 5 &&
          words[2].length >= 5 &&
          words[3].length >= 5 &&
          (words[4] === '5' ||
            words[4] === '6' ||
            words[4] === '7' ||
            words[4] === '8')
        ) {
          lines.push(line);
        }
      }

      //   console.log(lines);
      // set the uploaded questions
      setUploadedQuestions(
        lines.map((line) => {
          const words = line.split(' ');
          return {
            word1: words[0],
            word2: words[1],
            word3: words[2],
            word4: words[3],
            year: parseInt(words[4]),
          };
        })
      );

      // toast
      toast.success('A feladatok betöltöttek!');
    };
  };

  const handleInsertQuestions = () => {
    if (uploadedQuestions.length === 0) {
      toast.error('Nincsenek feltöltött feladatok!');
      return;
    }

    // create the questions
    createQuestions(parseQuestions(uploadedQuestions)).then((res) => {
      if (res) {
        toast.success('A feladatok sikeresen feltöltve!');
        setUploadedQuestions([]);
      } else {
        toast.error('A feladatok feltöltése sikertelen!');
      }
    });
  };

  const parseQuestions = (questions: UploadedQuestions[]) => {
    // return each questions as a single string: "word1 word2 word3 word4 year"
    return questions.map((question) => {
      return `${question.word1} ${question.word2} ${question.word3} ${question.word4} ${question.year}`;
    });
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
          <Link href="/vezerlopult/feladatok">
            <span className="text-sm hover:underline">
              Vissza a feladatokhoz
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

        <Link href="/vezerlopult/feladatok/">
          <div className="flex items-center gap-[2px] hover:underline">
            <UserList className="h-6 w-6" /> Feladatok
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
              <FormLabel>Feladatok feltöltése file-ból</FormLabel>
              <Dropzone
                accept={{
                  'text/plain': ['.txt'],
                }}
                multiple={false}
                maxSize={20000000}
                onDrop={(acceptedFiles) => {
                  handleFileDrop(acceptedFiles);
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <div
                    {...getRootProps({
                      className: cn(
                        'p-3 mb-4 flex hover:bg-zinc-100 flex-col items-center justify-center w-full rounded-xl cursor-pointer border-[2px] border-border border-dashed'
                      ),
                    })}
                  >
                    <div className="flex items-center gap-3 mt-2 mb-2 flex-col">
                      <FileText
                        size={64}
                        weight="light"
                        className="text-zinc-400"
                      />
                      <FormLabel className="font-semibold text-center leading-tight text-muted-foreground">
                        Kattintson a böngészéshez
                        <br />
                        vagy húzzon ide egy TXT fájlt!
                        <input {...getInputProps()} />
                      </FormLabel>
                      <span className="text-xs text-neutral-400">TXT</span>
                    </div>
                  </div>
                )}
              </Dropzone>
            </FormItem>
            {/* AI Generálás */}
            <div className="flex flex-col items-center mt-4 gap-4">
              <span className="text-zinc-700">vagy</span>
              <h3>Feladatok Generálása AI-al</h3>
            </div>
            <div className="flex items-end gap-4 justify-center mt-6 w-full">
              <FormItem>
                <FormLabel>Évfolyam</FormLabel>
                <FormControl>
                  <Select {...form.register('year')}>
                    <SelectTrigger className="w-[320px]">
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
                    <SelectTrigger className="w-[320px]">
                      <SelectValue placeholder="Válassz egy számot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Mennyiség</SelectLabel>
                        <SelectItem value="10">~10 kérdés</SelectItem>
                        <SelectItem value="20">~20 kérdés</SelectItem>
                        <SelectItem value="30">~30 kérdés</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
              <FormItem>
                <Button
                  onClick={handleAIQuestionGeneration}
                  className="bg-gradient-to-r w-[300px] from-violet-600 to-blue-500 text-white text-base"
                >
                  <Lightning size={20} weight="bold" className="mr-2" /> AI
                  Feladat Generálás
                </Button>
              </FormItem>
            </div>
          </form>
        </Form>

        {isGenerating && (
          <div className="flex flex-col gap-2">
            <span>Generálás...</span>
            <Progress value={progress} />
          </div>
        )}

        {uploadedQuestions.length > 0 && (
          <div className="flex flex-col items-center gap-8 w-full">
            <div className="flex justify-between w-full">
              <h3>
                Beimportált feladatok{' '}
                <span className="text-muted-foreground">(előnézet)</span>
              </h3>

              <Button
                size={'lg'}
                disabled={uploadedQuestions.length === 0}
                onClick={handleInsertQuestions}
              >
                Feladatok feltöltése
                <CloudArrowUp size={20} weight="bold" className="ml-3" />
              </Button>
            </div>
            {/* map the uploaded questions into a table */}
            {/* <UploadedQuestionsTable columns={uploadedQuestions} /> */}
            <div className="w-full">
              <UploadedQuestionsTable
                columns={uploadedQuestionsColumns}
                data={uploadedQuestions}
              />
            </div>
            <Button
              className={uploadedQuestions.length === 0 ? 'hidden' : ''}
              size={'lg'}
              onClick={handleInsertQuestions}
              disabled={uploadedQuestions.length === 0}
              // onClick={insertQuestions} // TODO: it should insert the questions using the action
            >
              Feladatok feltöltése
              <CloudArrowUp size={20} weight="bold" className="ml-3" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
