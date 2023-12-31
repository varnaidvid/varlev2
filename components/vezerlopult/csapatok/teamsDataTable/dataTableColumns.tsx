'use client';

import { Team, User } from '@prisma/client';
import { ColumnDef, filterFns } from '@tanstack/react-table';

import {
  DotsThree,
  ArrowUp,
  Backspace,
  PencilSimple,
  Trash,
  ArrowLeft,
} from '@phosphor-icons/react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import toast from 'react-hot-toast';

import { deleteTeams } from '@/lib/actions';
import Link from 'next/link';
import { useContext } from 'react';
import { useSession } from 'next-auth/react';
import { VezerloContext } from '@/app/vezerlopult/layout';
import { DataTableColumnHeader } from '@/components/datatable/dataTableColumnHeader';

const TeamsColumns: ColumnDef<Team>[] = [
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
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Csapatnév" />
    ),
    cell: ({ row }) => {
      return (
        <Link href={`/vezerlopult/csapatok/${row.getValue('name')}`}>
          <span>{row.getValue('name')}</span>
        </Link>
      );
    },
  },
  {
    id: 'year',
    accessorKey: 'Évfolyam',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Évfolyam" />
    ),
    cell: ({ row }) => {
      const year = row.original.year;

      return <span>{year}</span>;
    },
    filterFn: (row: any, id: any, value: any) => {
      return row.original[id] == value;
    },
  },
  {
    id: 'class',
    accessorKey: 'Osztály',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Osztály" />
    ),
    cell: ({ row }) => {
      const classNumber = row.original.class;

      return <span>{classNumber}</span>;
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => <span>Rövid leírás</span>,
    cell: ({ row }) => {
      const description = row.getValue('description') as string;

      return (
        <span>
          {description.length > 30
            ? description.slice(0, 30) + '...'
            : description}
        </span>
      );
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="text-right"
        title="Létrehozva"
      />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
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
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="text-right"
        title="Frissítve"
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
    id: 'actions',
    cell: ({ row, table }) => {
      const { teams, setTeams } = useContext(VezerloContext);

      return (
        <AlertDialog>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Biztos vagy benne?</AlertDialogTitle>
              <AlertDialogDescription>
                {table.getFilteredSelectedRowModel().rows.length == 0 ? (
                  <div>
                    Ezzel kifogja törölni <b>{row.getValue('username')}</b> nevű
                    felhasználót.
                  </div>
                ) : table.getFilteredSelectedRowModel().rows.length == 1 ? (
                  <div>
                    Ezzel kifogja törölni{' '}
                    <b>
                      {table
                        .getFilteredSelectedRowModel()
                        .rows[0]?.getValue('username')}{' '}
                    </b>
                    nevű felhasználót.
                  </div>
                ) : (
                  <div>
                    Ezzel ki kifogja törölni a kiválasztott{' '}
                    <b>{table.getFilteredSelectedRowModel().rows.length} db </b>
                    felhasználót.
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
                  let names: string[] = [];

                  if (table.getFilteredSelectedRowModel().rows.length == 0) {
                    names = [row.getValue('name')];
                  } else {
                    names = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.getValue('names'));
                  }

                  const res: any = await deleteTeams(names);

                  if (res.status == 500) toast.error(res.message);
                  else {
                    setTeams(
                      teams?.filter((user: any) => !teams.includes(user.name))!
                    );
                    table.toggleAllPageRowsSelected(false);
                    toast.success('Sikeres törlés');
                  }
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
              <Link href={`/vezerlopult/csapatok/${row.getValue('name')}`}>
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

export default TeamsColumns;
