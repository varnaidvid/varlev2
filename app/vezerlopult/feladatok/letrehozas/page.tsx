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
              {/* <Dropzone
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
              </Dropzone> */}
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

        <div className="flex flex-col items-center gap-8 w-full">
          <div className="flex justify-between w-full">
            <h3>
              Beimportált feladatok{' '}
              <span className="text-muted-foreground">(előnézet)</span>
            </h3>

            <Button
              size={'lg'}
              disabled={uploadedQuestions.length === 0}
              //   onClick={insertQuestions} // TODO: it should insert the questions using the action
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
            disabled={uploadedQuestions.length === 0}
            // onClick={insertQuestions} // TODO: it should insert the questions using the action
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
