'use client';

import { Table } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center justify-start space-x-2">
        {table.getColumn('word4') && (
          <Input
            placeholder="Keresés 4. szavak alapján..."
            value={(table.getColumn('word4')?.getFilterValue() as string) || ''}
            onChange={(event) => {
              const value = event.target.value;
              table.getColumn('word4')?.setFilterValue(value);
            }}
            className="w-full"
          />
        )}

        {table.getColumn('username') && (
          <Input
            placeholder="Keresés készítő alapján..."
            value={
              (table.getColumn('username')?.getFilterValue() as string) || ''
            }
            onChange={(event) => {
              const value = event.target.value;
              table.getColumn('username')?.setFilterValue(value);
            }}
            className="w-full"
          />
        )}
      </div>
    </div>
  );
}
