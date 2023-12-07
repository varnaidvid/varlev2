'use client';

import { Row } from '@tanstack/react-table';
import { UploadedQuestions } from './column';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, FloppyDisk, PencilSimple } from '@phosphor-icons/react';
import { toast } from 'react-hot-toast';
import { useContext } from 'react';
import { VezerloContext } from '@/app/vezerlopult/layout';

export const EditableCell = ({
  row,
  word,
}: {
  row: Row<UploadedQuestions>;
  word: string;
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>(row.getValue(word) as string);
  const { setUploadedQuestions, uploadedQuestions } =
    useContext(VezerloContext);

  const updateQuestion = async ({
    word1,
    word2,
    word3,
    word4,
    year,
  }: {
    word1: string;
    word2: string;
    word3: string;
    word4: string;
    year: number;
  }) => {
    const updatedQuestions = uploadedQuestions.map((question) => {
      const matchingValues = [
        question.word1 === word1,
        question.word2 === word2,
        question.word3 === word3,
        question.word4 === word4,
        question.year === year,
      ];

      if (matchingValues.filter((value) => value).length >= 4) {
        const updatedQuestion = {
          ...question,
          word1,
          word2,
          word3,
          word4,
          year,
        };
      }

      return question;
    });

    setUploadedQuestions(updatedQuestions);
  };

  return (
    <div className="flex items-center gap-2">
      {isEditing ? (
        <div className="flex items-center gap-0">
          <input
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            className="border rounded-md px-2 py-1 w-28"
          />
          {/* A button to cancel editing */}
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => {
              setIsEditing(false);
              setValue(row.getValue(word) as string);
            }}
          >
            <X className="w-4 h-4 text-red-600" />
          </Button>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={async () => {
              setIsEditing(false);
              const newQuestion =
                word == 'word1'
                  ? value +
                    ' ' +
                    row.getValue('word2') +
                    ' ' +
                    row.getValue('word3') +
                    ' ' +
                    row.getValue('word4') +
                    ' ' +
                    row.getValue('year')
                  : word == 'word2'
                  ? row.getValue('word1') +
                    ' ' +
                    value +
                    ' ' +
                    row.getValue('word3') +
                    ' ' +
                    row.getValue('word4') +
                    ' ' +
                    row.getValue('year')
                  : word == 'word3'
                  ? row.getValue('word1') +
                    ' ' +
                    row.getValue('word2') +
                    ' ' +
                    value +
                    ' ' +
                    row.getValue('word4') +
                    ' ' +
                    row.getValue('year')
                  : row.getValue('word1') +
                    ' ' +
                    row.getValue('word2') +
                    ' ' +
                    row.getValue('word3') +
                    ' ' +
                    value +
                    ' ' +
                    row.getValue('year');

              updateQuestion({
                word1: row.getValue('word1') as string,
                word2: row.getValue('word2') as string,
                word3: row.getValue('word3') as string,
                word4: row.getValue('word4') as string,
                year: row.getValue('year') as number,
              });
              //   if (question) {
              //     toast.success('Sikeres mentés');
              //   } else {
              //     toast.error('Sikertelen mentés');
              //   }
            }}
          >
            <FloppyDisk className="w-5 h-5" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-0 group">
          <div className="">{value}</div>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => setIsEditing(true)}
          >
            <PencilSimple className="w-3 h-3 hidden group-hover:block" />
          </Button>
        </div>
      )}
    </div>
  );
};
