'use client';

import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { Table } from '@tanstack/react-table';

import { SlidersHorizontal } from '@phosphor-icons/react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export default function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const columnMap = {
    username: 'Fh. név',
    role: 'Szerepkör',
    createdAt: 'Dátum',
    updatedAt: 'Frissítve',
    year: 'Évfolyam',
    word1: '1. szó',
    word2: '2. szó',
    word3: '3. szó',
    word4: '4. szó',
    id: 'ID',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Nézet
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Oszlopok</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== 'undefined' && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {/* @ts-ignore */}
                {columnMap[column.id]}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
