"use client"

import * as React from "react";
import { format } from 'date-fns';
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { fitnessGoal as FitnessGoal, newFitnessAchievement, newPersonalTrainingSession} from "@/db/types";
import { createFitnessAchievement, deleteMemberFitnessGoal } from "@/app/actions/members";
import { time } from "console";
import { createPersonalTrainingSession } from "@/app/actions/trainers";

type TimeSlot = {
  start_time: Date;
  end_time: Date;
  isSelected: boolean;
  ts_id: number;
  day:string;
  trainer_id: number;
  trainer_name: string;
}


const columns: ColumnDef<TimeSlot>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "day",
    header: "Day",
    cell: ({ row }) => <div className="capitalize">{row.getValue("day")}</div>,
  },
  {
    accessorKey: "trainer_name",
    header: "Trainer Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("trainer_name")}</div>,
  },
  {
    accessorKey: "start_time",
    header: "Start Time",
    cell: ({ row }) => {
      const date: Date | null = row.getValue('start_time');
      return date ? date.toLocaleTimeString() : null;
    },
  },
  {
    accessorKey: "end_time",
    header: "End Time",
    cell: ({ row }) => {
      const date: Date | null = row.getValue('end_time');
      return date ? date.toLocaleTimeString() : null;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const timeSlot = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(timeSlot.ts_id.toString())}
            >
              Copy timeSlot ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Member</DropdownMenuItem>
            <DropdownMenuItem>View timeSlot Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];

export default function PTTable({ timeSlots, memId }: { timeSlots: TimeSlot[], memId:number}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
const data = timeSlots;
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter timeSlots..."
          value={(table.getColumn("day")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("day")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />


      <Button variant="outline" size="lg" className="ml-auto" onClick={
        () => {
          const selectedTsIds = table.getFilteredSelectedRowModel().rows.map(
            (row) => row.original.ts_id
          );
          //for each goal id add it to the fitness_achievments table
          for (const tsId of selectedTsIds) {
            console.log("Completing goal ID:", tsId);
            const timeSlot = data.find((ts) => ts.ts_id === tsId);
            if(!timeSlot || timeSlot.trainer_id === undefined || timeSlot.trainer_id === null || timeSlot.end_time === undefined || timeSlot.start_time === undefined || timeSlot.ts_id === undefined) {
              console.error("Invalid timeSlot data:", timeSlot);
              continue;
            }
            const PTBooking: newPersonalTrainingSession = {
              start_time: timeSlot.start_time,
              end_time: timeSlot.end_time,
              member_id: memId,
              trainer_id: timeSlot?.trainer_id //hardcoded trainer id <- need to change this ToDo 
            }
            console.log("PT Booking:", PTBooking);
            createPersonalTrainingSession(PTBooking).then(() => {
              console.log("PT Session booked for member ID:", memId);
            }); 

          }
        }
      }>
        Book PT Time Slots 
      </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}