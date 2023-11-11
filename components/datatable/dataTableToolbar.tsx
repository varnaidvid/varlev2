'use client';

import { Table } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';

import { DataTableFacetedFilter } from './dataTableFacetedFilter';
import DataTableViewOptions from './dataTableViewOptions';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
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
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
