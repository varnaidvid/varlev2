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
import { deleteQuestion, deleteQuestions } from '@/lib/actions';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
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
        {/* ==================================================================================================================================== */}
        {
          table.getFilteredSelectedRowModel().rows.length !== 0 &&
            (table.getColumn('id') ? (
              <AlertDialog>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Biztos benne?</AlertDialogTitle>
                    <AlertDialogDescription>
                      {table.getFilteredSelectedRowModel().rows.length == 0 ? (
                        <div>Ezzel kifogja törölni ezt a feladatot.</div>
                      ) : table.getFilteredSelectedRowModel().rows.length ==
                        1 ? (
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
                          .rows.map((row) => row.getValue('id'));

                        const res: any = await deleteQuestions(questionIds);
                        if (res.status == 500) toast.error(res.message);
                        else toast.success('Sikeres törlés');
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
            ) : table.getColumn('replacethis') ? null : null) //  👆 ide táblázat specifikus column kell pl felhasznalok-hoz table.getColumn("username") // ez alá kell a törlő AlertDialog 👇
        }

        {/* ==================================================================================================================================== */}
      </div>
    </div>
  );
}
