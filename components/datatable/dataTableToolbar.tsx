'use client';

import { Table } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';

import { DataTableFacetedFilter } from './dataTableFacetedFilter';
import DataTableViewOptions from './dataTableViewOptions';
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
} from '../ui/alert-dialog';
import { ArrowLeft, Trash } from '@phosphor-icons/react';
import { deleteQuestion, deleteQuestions, deleteUsers } from '@/lib/actions';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import { VezerloContext } from '@/app/vezerlopult/layout';
import { useContext } from 'react';
import { useRouter } from 'next/navigation';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const router = useRouter();
  const { users, setUsers } = useContext(VezerloContext);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn('username') && (
          <Input
            placeholder="Keresés felhasználónév alapján..."
            value={
              (table.getColumn('username')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('username')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
        {table.getColumn('word4') && (
          <Input
            placeholder="Keresés 4. szavak alapján..."
            value={(table.getColumn('word4')?.getFilterValue() as string) || ''}
            onChange={(event) => {
              const value = event.target.value;
              table.getColumn('word4')?.setFilterValue(value);
            }}
            className="max-w-sm"
          />
        )}
      </div>
      <div className="flex gap-2">
        {table.getColumn('role') && (
          <DataTableFacetedFilter
            column={table.getColumn('role')}
            title="Szerepkör"
            options={[
              {
                label: 'Webmester',
                value: 'webmester',
                icon: undefined,
              },
              {
                label: 'Zsűri',
                value: 'zsuri',
              },
              {
                label: 'Tanár',
                value: 'tanar',
              },
              {
                label: 'Diák',
                value: 'diak',
              },
            ]}
          />
        )}
        {table.getColumn('year') && (
          <DataTableFacetedFilter
            column={table.getColumn('year')}
            title="Évfolyam"
            options={[
              {
                label: '5. évfolyam',
                value: '5',
              },
              {
                label: '6. évfolyam',
                value: '6',
              },
              {
                label: '7. évfolyam',
                value: '7',
              },
              {
                label: '8. évfolyam',
                value: '8',
              },
            ]}
          />
        )}
        <DataTableViewOptions table={table} />

        {table.getFilteredSelectedRowModel().rows.length !== 0 &&
          (table.getColumn('word1') ? (
            <AlertDialog>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Biztos benne?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {table.getFilteredSelectedRowModel().rows.length == 0 ? (
                      <div>Ezzel kifogja törölni ezt a feladatot.</div>
                    ) : table.getFilteredSelectedRowModel().rows.length == 1 ? (
                      <div>Ezzel kifogja törölni ezt a feladatot.</div>
                    ) : (
                      <div>
                        Ezzel ki kifogja törölni a kiválasztott{' '}
                        <b>
                          {table.getFilteredSelectedRowModel().rows.length} db{' '}
                        </b>
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
                      const questionIds: string[] = table
                        .getFilteredSelectedRowModel()
                        // @ts-ignore
                        .rows.map((row) => row.original.id);

                      const res: any = await deleteQuestions(questionIds);
                      if (res.status == 500) toast.error(res.message);
                      else toast.success('Sikeres törlés');

                      window.location.reload();
                    }}
                  >
                    <Trash className="w-6 h-6 mr-1" /> Törlés
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>

              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="h-8">
                  <Trash className="w-4 h-4 mr-1.5" />{' '}
                  {table.getFilteredSelectedRowModel().rows.length} törlése
                </Button>
              </AlertDialogTrigger>
            </AlertDialog>
          ) : table.getColumn('username') ? (
            <AlertDialog>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Biztos benne?</AlertDialogTitle>
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
                        <b>
                          {table.getFilteredSelectedRowModel().rows.length} db{' '}
                        </b>
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
                            (user: any) => !usernames.includes(user.username)
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

              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="h-8">
                  <Trash className="w-4 h-4 mr-1.5" />{' '}
                  {table.getFilteredSelectedRowModel().rows.length} törlése
                </Button>
              </AlertDialogTrigger>
            </AlertDialog>
          ) : null)}
      </div>
    </div>
  );
}
