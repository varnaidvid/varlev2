'use client';

import { Table } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';

import { DataTableFacetedFilter } from '@/components/datatable/dataTableFacetedFilter';
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
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Trash } from '@phosphor-icons/react';
import {
  closeCompetitions,
  deleteQuestion,
  deleteQuestions,
  deleteTeams,
} from '@/lib/actions';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { VezerloContext } from '@/app/vezerlopult/layout';
import { useContext } from 'react';
import { Team } from '@prisma/client';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { teams, setCompetitions } = useContext(VezerloContext);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn('name') && (
          <Input
            placeholder="Keresés név alapján..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        )}
      </div>
      <div className="flex gap-2">
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

        {table.getFilteredSelectedRowModel().rows.length !== 0 && (
          <AlertDialog>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Biztos benne?</AlertDialogTitle>
                <AlertDialogDescription>
                  {table.getFilteredSelectedRowModel().rows.length == 1 ? (
                    <div>
                      Ezzel lefogja zárni{' '}
                      <b>
                        {table
                          .getFilteredSelectedRowModel()
                          .rows[0]?.getValue('name')}{' '}
                      </b>
                      nevű versenyt.
                    </div>
                  ) : (
                    <div>
                      Ezzel ki lefogja zárni a kiválasztott{' '}
                      <b>
                        {table.getFilteredSelectedRowModel().rows.length} db{' '}
                      </b>
                      versenyt.
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
                    const names: string[] = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.getValue('name'));

                    const res: any = await closeCompetitions(names);

                    if (res.status == 500) toast.error(res.message);
                    else {
                      setCompetitions((prevCompetitions) => {
                        if (!prevCompetitions) return null;
                        return prevCompetitions.filter(
                          (competition) => !names.includes(competition.name)
                        );
                      });
                      table.toggleAllPageRowsSelected(false);
                      toast.success('Sikeres lezárás');
                    }
                  }}
                >
                  <Trash className="w-6 h-6 mr-1" /> Lezárás
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>

            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="h-8">
                <Trash className="w-4 h-4 mr-1.5" />{' '}
                {table.getFilteredSelectedRowModel().rows.length} lezárás
              </Button>
            </AlertDialogTrigger>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
