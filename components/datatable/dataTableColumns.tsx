'use client';

import { User } from '@prisma/client';
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
import { DataTableColumnHeader } from './dataTableColumnHeader';
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

import { deleteUser, deleteUsers, updateUserRole } from '@/lib/actions';
import Link from 'next/link';
import { useContext } from 'react';
import { useSession } from 'next-auth/react';
import { VezerloContext } from '@/app/vezerlopult/layout';

const columns: ColumnDef<User>[] = [
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
    accessorKey: 'username',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Felhasználónév" />
    ),
    cell: ({ row }) => {
      return (
        <Link href={`/vezerlopult/felhasznalok/${row.getValue('username')}`}>
          <span>{row.getValue('username')}</span>
        </Link>
      );
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Szerepkör" />
    ),
    cell: ({ row }) => {
      const role = row.getValue('role') as string;
      const username = row.getValue('username') as string;

      const { data: session } = useSession();

      return (
        <Select
          defaultValue={role}
          onValueChange={async (value) => {
            const user = await updateUserRole(username, value);
            if (user) {
              toast.success(
                `Sikeresen frissítette a szerepkörét ${username}-nek`
              );
            }
          }}
        >
          <SelectTrigger
            className="w-max border-none justify-start gap-1 bg-transparent"
            disabled={session?.user.username == username}
          >
            <SelectValue defaultValue={role} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="webmester">Webmester</SelectItem>
            <SelectItem value="zsuri">Zsűri</SelectItem>
            <SelectItem value="tanar">Tanár</SelectItem>
            <SelectItem value="diak">Diák</SelectItem>
          </SelectContent>
        </Select>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    sortingFn: (rowA, rowB, id) => {
      const roleOrder = ['diak', 'tanar', 'zsuri', 'webmester'];
      const roleA = rowA.getValue(id) as string;
      const roleB = rowB.getValue(id) as string;

      return roleOrder.indexOf(roleA) - roleOrder.indexOf(roleB);
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        className="text-right"
        title="Regisztráció dátuma"
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
        title="Utoljára frissítve"
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
    header: ({ column, table }) => {
      const disabled = table.getFilteredSelectedRowModel().rows.length == 0;
      const { users, setUsers } = useContext(VezerloContext);

      return (
        <AlertDialog>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Biztos vagy benne?</AlertDialogTitle>
              <AlertDialogDescription>
                {table.getFilteredSelectedRowModel().rows.length == 1 ? (
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
                  const usernames: string[] = table
                    .getFilteredSelectedRowModel()
                    .rows.map((row) => row.getValue('username'));

                  const res: any = await deleteUsers(usernames);

                  if (res.status == 500) toast.error(res.message);
                  else {
                    setUsers(
                      users?.filter(
                        (user) => !usernames.includes(user.username)
                      )!
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
                <span className="sr-only">Össz Menü kinyitása</span>
                <DotsThree className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Össz Műveletek</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <AlertDialogTrigger className="w-full" disabled={disabled}>
                <DropdownMenuItem disabled={disabled}>
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
    cell: ({ row, table }) => {
      const { users, setUsers } = useContext(VezerloContext);

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
                  let usernames: string[] = [];

                  if (table.getFilteredSelectedRowModel().rows.length == 0) {
                    usernames = [row.getValue('username')];
                  } else {
                    usernames = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.getValue('username'));
                  }

                  const res: any = await deleteUsers(usernames);

                  if (res.status == 500) toast.error(res.message);
                  else {
                    setUsers(
                      users?.filter(
                        (user) => !usernames.includes(user.username)
                      )!
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
              <Link
                href={`/vezerlopult/felhasznalok/${row.getValue('username')}`}
              >
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

export default columns;
