'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from '@/components/datatable/dataTableColumnHeader';
import { Checkbox } from '@/components/ui/checkbox';

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

export const allQuestionsColumns: ColumnDef<AllParsedQuestion>[] = [
  {
    accessorKey: 'username',
    header: 'Készítő',
  },

  {
    accessorKey: 'word1',
    header: '1. szó',
  },
  {
    accessorKey: 'word2',
    header: '2. szó',
  },
  {
    accessorKey: 'word3',
    header: '3. szó',
  },
  {
    accessorKey: 'word4',
    header: '4. szó',
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} className="" title="Módosítva" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('updatedAt'));
      const formatted = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
        .getHours()
        .toString()
        .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

      return <div className=" font-medium">{formatted}</div>;
    },
  },
];
