'use client';

import { Row } from '@tanstack/react-table';
import { OwnParsedQuestion } from './column';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, FloppyDisk, PencilSimple } from '@phosphor-icons/react';
import { toast } from 'react-hot-toast';
import { updateQuestion } from '@/lib/actions';

export const EditableCell = ({
  row,
  word,
}: {
  row: Row<OwnParsedQuestion>;
  word: string;
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [value, setValue] = useState<string>(row.getValue(word) as string);

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

              const question = await updateQuestion(
                row.getValue('id'),
                newQuestion
              );

              if (question) {
                toast.success('Sikeres mentés');
              } else {
                toast.error('Sikertelen mentés');
              }
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
