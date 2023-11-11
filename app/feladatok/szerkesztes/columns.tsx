'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTableColumnHeader } from '@/components/webmester/datatable/dataTableColumnHeader';
import {
  Backspace,
  DotsThree,
  PencilSimple,
  Trash,
} from '@phosphor-icons/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { deleteQuestion, deleteQuestions, updateQuestion } from '@/lib/actions';
import toast from 'react-hot-toast';

export type ParsedQuestion = {
  word1: string;
  word2: string;
  word3: string;
  word4: string;
  year: number;
  updatedAt: Date;
  id: string;
};

export const columns: ColumnDef<ParsedQuestion>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Összes kijelölése"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Sor kijelölése"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'year',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Évfolyam" />
    ),
    cell: ({ row }) => {
      const year = row.getValue('year') as string;
      const word1 = row.getValue('word1') as string;
      const word2 = row.getValue('word2') as string;
      const word3 = row.getValue('word3') as string;
      const word4 = row.getValue('word4') as string;

      return (
        <Select
          defaultValue={year.toString()}
          onValueChange={async (value) => {
            // const user = await updateUserRole(username, value);
            // if (user) {
            //   toast.success(
            //     `Sikeresen frissítette a szerepkörét ${username}-nek`
            //   );
            // }

            const newQuestion =
              word1 +
              ' ' +
              word2 +
              ' ' +
              word3 +
              ' ' +
              word4 +
              ' ' +
              value.toString();

            const question = await updateQuestion(
              row.getValue('id'),
              newQuestion
            );
          }}
        >
          <SelectTrigger className="w-max border-none justify-start gap-1 bg-transparent">
            <SelectValue defaultValue={year} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5.</SelectItem>
            <SelectItem value="6">6.</SelectItem>
            <SelectItem value="7">7.</SelectItem>
            <SelectItem value="8">8.</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: 'word1',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="1. szó" />
    ),
  },
  {
    accessorKey: 'word2',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="2. szó" />
    ),
  },
  {
    accessorKey: 'word3',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="3. szó" />
    ),
  },
  {
    accessorKey: 'word4',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="4. szó" />
    ),
  },

  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="text-right"
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

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="text-right"
        title="ID"
      />
    ),

    cell: ({ row }) => {
      const id = row.getValue('id') as string;
      return (
        <div className="text-right font-medium">
          {
            // only the first 8 characters of the id
            id.substring(0, 5) + '...'
          }
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      // const disabled: boolean = table
      //   .getFilteredSelectedRowModel()
      //   .rows.some((row) => row.getValue('username') == table.);

      return (
        <AlertDialog>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Biztos vagy benne?</AlertDialogTitle>
              <AlertDialogDescription>
                {table.getFilteredSelectedRowModel().rows.length == 0 ? (
                  <div>Ezzel kifogja törölni ezt a feladatot.</div>
                ) : table.getFilteredSelectedRowModel().rows.length == 1 ? (
                  <div>Ezzel kifogja törölni ezt a feladatot.</div>
                ) : (
                  <div>
                    Ezzel ki kifogja törölni a kiválasztott{' '}
                    <b>{table.getFilteredSelectedRowModel().rows.length} db </b>
                    feladatot.
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="w-full">
                <ArrowLeft className="w-6 h-6 mr-1" /> Vissza
              </AlertDialogCancel>
              <AlertDialogAction
                className="w-full"
                onClick={async () => {
                  if (table.getFilteredSelectedRowModel().rows.length == 0) {
                    const res: any = await deleteQuestion(row.getValue('id'));
                    if (res.status == 500) toast.error(res.message);
                    else toast.success('Sikeres törlés');
                  } else {
                    const questionIds: string[] = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.getValue('id'));

                    const res: any = await deleteQuestions(questionIds);
                    if (res.status == 500) toast.error(res.message);
                    else toast.success('Sikeres törlés');
                  }

                  //   const questionIds: string[] = table
                  //     .getFilteredSelectedRowModel()
                  //     .rows.map((row) => row.getValue('id'));
                  //   const res: any = await deleteQuestions(questionIds);
                  //   if (res.status == 500) toast.error(res.message);
                  //   else toast.success('Sikeres törlés');
                }}
              >
                <Trash className="w-6 h-6 mr-1" /> Törlés
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Menü kinyitása</span>
                <DotsThree className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Műveletek</DropdownMenuLabel>
              <Link href={`/feladatok/szerkesztes/${row.getValue('id')}`}>
                <DropdownMenuItem>
                  <div className="flex justify-between w-full">
                    Szerkesztés
                    <PencilSimple className="w-4 h-4 ml-4" />
                  </div>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <AlertDialogTrigger className="w-full">
                <DropdownMenuItem>
                  <div className="flex justify-between w-full">
                    Törlés
                    <Backspace className="w-4 h-4 ml-4" />
                  </div>
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
        </AlertDialog>
      );
    },
  },
];
