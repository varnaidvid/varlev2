'use client';

import { ColumnDef } from '@tanstack/react-table';

import { DotsThree, ArrowUp } from '@phosphor-icons/react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { QuestionsTableColumnHeader } from './questionsTableColumnHeader';
import { Checkbox } from '@/components/ui/checkbox';

export type ParsedQuestion = {
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

export const columns: ColumnDef<ParsedQuestion>[] = [
  //   {
  //     id: 'select',
  //     header: ({ table }) => (
  //       <Checkbox
  //         checked={table.getIsAllPageRowsSelected()}
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Összes kijelölése"
  //       />
  //     ),
  //     cell: ({ row }) => (
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Sor kijelölése"
  //       />
  //     ),
  //     enableSorting: false,
  //     enableHiding: false,
  //   },
  {
    accessorKey: 'username',
    header: 'Készítő',
    // header: ({ column }) => (
    //   <QuestionsTableColumnHeader column={column} title="Készítő" />
    // ),
  },
  //   {
  //     accessorKey: 'year',
  //     header: ({ column }) => (
  //       <QuestionsTableColumnHeader column={column} title="Évfolyam" />
  //     ),
  //     cell: ({ row }) => {
  //       const role = row.getValue('year');

  //       const roleMap = {
  //         webmester: 'Webmester',
  //         zsuri: 'Zsűri tag',
  //         tanar: 'Tanár',
  //         diak: 'Diák',
  //       };

  //       // @ts-ignore
  //       return <div>{roleMap[role]}</div>;
  //     },
  //   },
  {
    accessorKey: 'word1',
    header: '1. szó',
    // header: ({ column }) => (
    //   <QuestionsTableColumnHeader column={column} title="1. szó" />
    // ),
  },
  {
    accessorKey: 'word2',
    header: '2. szó',
    // header: ({ column }) => (
    //   <QuestionsTableColumnHeader column={column} title="2. szó" />
    // ),
  },
  {
    accessorKey: 'word3',
    header: '3. szó',
    // header: ({ column }) => (
    //   <QuestionsTableColumnHeader column={column} title="3. szó" />
    // ),
  },
  {
    accessorKey: 'word4',
    header: '4. szó',
    // header: ({ column }) => (
    //   <QuestionsTableColumnHeader column={column} title="4. szó" />
    // ),
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <QuestionsTableColumnHeader
        column={column}
        className=""
        title="Módosítva"
      />
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
  // {
  //   id: 'actions',
  //   cell: ({ row }) => {
  //     const payment = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Menü kinyitása</span>
  //             <DotsThree className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(payment.id)}
  //           >
  //             Copy payment ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
