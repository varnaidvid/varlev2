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
import { deleteQuestion, deleteQuestions, deleteTeams } from '@/lib/actions';
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
  const { teams, setTeams } = useContext(VezerloContext);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {table.getColumn('name') && (
          <Input
            placeholder="Keresés csapatnév alapján..."
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
                      Ezzel kifogja törölni{' '}
                      <b>
                        {table
                          .getFilteredSelectedRowModel()
                          .rows[0]?.getValue('name')}{' '}
                      </b>
                      nevű csapatot.
                    </div>
                  ) : (
                    <div>
                      Ezzel ki kifogja törölni a kiválasztott{' '}
                      <b>
                        {table.getFilteredSelectedRowModel().rows.length} db{' '}
                      </b>
                      csapatot.
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
                    const teamNames: string[] = table
                      .getFilteredSelectedRowModel()
                      .rows.map((row) => row.getValue('name'));

                    const res: any = await deleteTeams(teamNames);

                    if (res.status == 500) toast.error(res.message);
                    else {
                      setTeams((prevTeams) => {
                        if (!prevTeams) return null;
                        return prevTeams.filter(
                          (team) => !teamNames.includes(team.name)
                        );
                      });
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
        )}
      </div>
    </div>
  );
}
