'use client';

import { Table } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';

import { DataTableFacetedFilter } from '../../.././datatable/dataTableFacetedFilter';
import DataTableViewOptions from '@/components/datatable/dataTableViewOptions';
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
import { deleteQuestion, deleteQuestions, deleteUsers } from '@/lib/actions';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
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

        {/* {table.getFilteredSelectedRowModel().rows.length !== 0 &&
          (
            <AlertDialog>
              <AlertDialogTrigger>
                <Button
                  variant="destructive"
                  className="flex items-center justify-center"
                >
                  <Trash className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogTitle>
                  Biztosan törölni szeretnéd a kiválasztott kérdéseket?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  A művelet nem visszavonható.
                </AlertDialogDescription>
                <AlertDialogFooter>
                  <AlertDialogCancel>Mégse</AlertDialogCancel>
                  <AlertDialogAction
                   asChild
                   
                  >
                    <Button variant={"destructive"} onClick={() => {
                        
                    }
                    }>
                    Törlés</Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) 
                } */}
      </div>
    </div>
  );
}
