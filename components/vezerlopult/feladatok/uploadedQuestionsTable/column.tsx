'use client';

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
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataTableColumnHeader } from '@/components/datatable/dataTableColumnHeader';
import {
  Backspace,
  DotsThree,
  FloppyDisk,
  PencilSimple,
  Trash,
  X,
} from '@phosphor-icons/react';
import { ColumnDef, Row } from '@tanstack/react-table';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { EditableCell } from './editableCell';
import { useContext } from 'react';
import { VezerloContext } from '@/app/vezerlopult/layout';

export type UploadedQuestions = {
  word1: string;
  word2: string;
  word3: string;
  word4: string;
  year: number;
};

export const uploadedQuestionsColumns: ColumnDef<UploadedQuestions>[] = [
  //   {
  //     id: 'select',
  //     header: ({ table }) => (
  //       <Checkbox
  //         checked={table.getIsAllPageRowsSelected()}
  //         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //         aria-label="Összes kijelölése"
  //       />
  //     ),
  //     cell: ({ row }) => (
  //       <Checkbox
  //         checked={row.getIsSelected()}
  //         onCheckedChange={(value) => row.toggleSelected(!!value)}
  //         aria-label="Sor kijelölése"
  //       />
  //     ),
  //     enableSorting: false,
  //     enableHiding: false,
  //   },
  {
    accessorKey: 'year',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Évfolyam" />
    ),
    cell: ({ row }) => {
      const year = row.getValue('year') as string;
      const word1 = row.getValue('word1') as string;
      const word2 = row.getValue('word2') as string;
      const word3 = row.getValue('word3') as string;
      const word4 = row.getValue('word4') as string;

      return (
        <Select
          defaultValue={year.toString()}
          onValueChange={async (value) => {
            const newQuestion =
              word1 +
              ' ' +
              word2 +
              ' ' +
              word3 +
              ' ' +
              word4 +
              ' ' +
              value.toString();

            // const question = await updateQuestion(row.original.id, newQuestion);
            // TODO: update the question in the state
          }}
        >
          <SelectTrigger className="w-max border-none justify-start gap-1 bg-transparent">
            <SelectValue defaultValue={year} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5.</SelectItem>
            <SelectItem value="6">6.</SelectItem>
            <SelectItem value="7">7.</SelectItem>
            <SelectItem value="8">8.</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: 'word1',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="1. szó" />
    ),
    cell: ({ row }) => {
      return EditableCell({ row, word: 'word1' });
    },
  },
  {
    accessorKey: 'word2',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="2. szó" />
    ),
    cell: ({ row }) => {
      return EditableCell({ row, word: 'word2' });
    },
  },
  {
    accessorKey: 'word3',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="3. szó" />
    ),
    cell: ({ row }) => {
      return EditableCell({ row, word: 'word3' });
    },
  },
  {
    accessorKey: 'word4',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="4. szó" />
    ),
    cell: ({ row }) => {
      return EditableCell({ row, word: 'word4' });
    },
  },

  //   {
  //     id: 'actions',
  //     cell: ({ row, table }) => {
  //       const { uploadedQuestions, setUploadedQuestions } =
  //         useContext(VezerloContext);
  //       return (
  //         <AlertDialog>
  //           <AlertDialogContent>
  //             <AlertDialogHeader>
  //               <AlertDialogTitle>Biztos vagy benne?</AlertDialogTitle>
  //               <AlertDialogDescription>
  //                 {table.getFilteredSelectedRowModel().rows.length == 0 ? (
  //                   <div>Ezzel kifogja törölni ezt a feladatot.</div>
  //                 ) : table.getFilteredSelectedRowModel().rows.length == 1 ? (
  //                   <div>Ezzel kifogja törölni ezt a feladatot.</div>
  //                 ) : (
  //                   <div>
  //                     Ezzel ki kifogja törölni a kiválasztott{' '}
  //                     <b>{table.getFilteredSelectedRowModel().rows.length} db </b>
  //                     feladatot.
  //                   </div>
  //                 )}
  //               </AlertDialogDescription>
  //             </AlertDialogHeader>
  //             <AlertDialogFooter>
  //               <AlertDialogCancel className="w-full">
  //                 <ArrowLeft className="w-6 h-6 mr-1" /> Vissza
  //               </AlertDialogCancel>
  //               <AlertDialogAction
  //                 className="w-full"
  //                 onClick={async () => {
  //                   if (table.getFilteredSelectedRowModel().rows.length == 0) {
  //                     // const res: any = await deleteQuestion(row.original.id);
  //                     // TODO: delete question form the state

  //                     // get the values of the filtered selected row model
  //                     const selectedQuestions =
  //                       table.getFilteredSelectedRowModel().rows;
  //                     //set the uploadedQuestions state to the currently uploaded questions without the selected ones
  //                     setUploadedQuestions(
  //                       uploadedQuestions.filter(
  //                         (question) => !selectedQuestions.includes(question)
  //                       )
  //                     );
  //                   } else {
  //                     console.log(
  //                       uploadedQuestions.filter(
  //                         (question) => question != row.original
  //                       )
  //                     );
  //                     setUploadedQuestions(
  //                       uploadedQuestions.filter(
  //                         (question) => question != row.original
  //                       )
  //                     );
  //                   }
  //                   //   else {
  //                   // const questionIds: string[] = table
  //                   //   .getFilteredSelectedRowModel()
  //                   //   .rows.map((row) => row.original.id);
  //                   // const res: any = await deleteQuestions(questionIds);
  //                   // if (res.status == 500) toast.error(res.message);
  //                   // else toast.success('Sikeres törlés');
  //                   // TODO: delete questions form the state
  //                   //   }

  //                   //   const questionIds: string[] = table
  //                   //     .getFilteredSelectedRowModel()
  //                   //     .rows.map((row) => row.original.id);
  //                   //   const res: any = await deleteQuestions(questionIds);
  //                   //   if (res.status == 500) toast.error(res.message);
  //                   //   else toast.success('Sikeres törlés');
  //                 }}
  //               >
  //                 <Trash className="w-6 h-6 mr-1" /> Törlés
  //               </AlertDialogAction>
  //             </AlertDialogFooter>
  //           </AlertDialogContent>

  //           <DropdownMenu>
  //             <DropdownMenuTrigger asChild>
  //               <Button variant="ghost" className="h-8 w-8 p-0">
  //                 <span className="sr-only">Menü kinyitása</span>
  //                 <DotsThree className="h-4 w-4" />
  //               </Button>
  //             </DropdownMenuTrigger>
  //             <DropdownMenuContent align="end">
  //               <DropdownMenuLabel>Műveletek</DropdownMenuLabel>
  //               {/* <Link href={`/feladatok/szerkesztes/${row.original.id}`}>
  //                 <DropdownMenuItem>
  //                   <div className="flex justify-between w-full">
  //                     Szerkesztés
  //                     <PencilSimple className="w-4 h-4 ml-4" />
  //                   </div>
  //                 </DropdownMenuItem>
  //               </Link> */}
  //               <DropdownMenuSeparator />
  //               <AlertDialogTrigger className="w-full">
  //                 <DropdownMenuItem>
  //                   <div className="flex justify-between w-full">
  //                     Törlés
  //                     <Backspace className="w-4 h-4 ml-4" />
  //                   </div>
  //                 </DropdownMenuItem>
  //               </AlertDialogTrigger>
  //             </DropdownMenuContent>
  //           </DropdownMenu>
  //         </AlertDialog>
  //       );
  //     },
  //   },
];
