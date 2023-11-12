'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
});

//question table:
// model Question {
//     id String @id @default(uuid())

//     question String
//     // syntax: word1 word2 word3 word4 6
//     // (4 szó, utolsó szám évfolyam)

//     competitions Competition[]
//     attempts     Attempt[]

//     createdAt DateTime @default(now())
//     updatedAt DateTime @updatedAt
// }

export default function FeladatLetrehozas() {
  const [uploadedQuestions, setUploadedQuestions] = useState<
    { words: string[]; year: number }[]
  >([]);

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
        // check if year is between 5 and 8
        if (year < 5 || year > 8) return;
        const question = {
          words: words.slice(0, 4),
          year,
        };
        setUploadedQuestions((prev) => [...prev, question]);
      });
    };
    reader.onerror = (e) => {
      console.error('File reading error:', e);
    };
    reader.readAsText(values.file); // Read the file as text
  };

  const insertQuestions = async () => {
    const questionsFormatted = uploadedQuestions.map((question) => {
      return question.words.join(' ') + ' ' + question.year;
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
          </form>
        </Form>

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-medium">1. Szó</TableHead>
                <TableHead className="font-medium">2. Szó</TableHead>
                <TableHead className="font-medium">3. Szó</TableHead>
                <TableHead className="font-medium">4. Szó</TableHead>
                <TableHead className="font-medium">Évfolyam</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploadedQuestions.map((question) => (
                <TableRow>
                  <TableCell>{question.words[0]}</TableCell>
                  <TableCell>{question.words[1]}</TableCell>
                  <TableCell>{question.words[2]}</TableCell>
                  <TableCell>{question.words[3]}</TableCell>
                  <TableCell>{question.year}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
