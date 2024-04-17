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

import { fitnessGoal as FitnessGoal, newFitnessAchievement } from "@/db/types";
import { createFitnessAchievement, deleteMemberFitnessGoal } from "@/app/actions/members";

export const columns: ColumnDef<FitnessGoal>[] = [
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
    accessorKey: "goal_type",
    header: "Goal Type",
    cell: ({ row }) => <div className="capitalize">{row.getValue("goal_type")}</div>,
  },
  {
    accessorKey: "target_value",
    header: "Target Value",
    cell: ({ row }) => <div>{row.getValue("target_value")}</div>,
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => {
      const date: Date | null = row.getValue('start_date');
      return <div>{date ? format(date, 'MM/dd/yyyy') : 'N/A'}</div>;
    },
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => {
      const date: Date | null = row.getValue('end_date');
      return <div>{date ? format(date, 'MM/dd/yyyy') : 'N/A'}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const goal = row.original;

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
              onClick={() => navigator.clipboard.writeText(goal.goal_id.toString())}
            >
              Copy Goal ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Member</DropdownMenuItem>
            <DropdownMenuItem>View Goal Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];

export default function FitnessGoalsTable({ goals }: { goals: FitnessGoal[]}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
const data = goals;
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
          placeholder="Filter goals..."
          value={(table.getColumn("goal_type")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("goal_type")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      <Button variant="outline" size="lg" className="ml-auto" onClick={
        () => {
          const selectedGoalIds = table.getFilteredSelectedRowModel().rows.map(
            (row) => row.original.goal_id
          );
          //for each goal id add it to the fitness_achievments table
          for (const goalId of selectedGoalIds) {
            console.log("Completing goal ID:", goalId);
            const fitnessGoal = data.find((goal) => goal.goal_id === goalId);
            console.log("Fitness goal:", fitnessGoal);
            if(!fitnessGoal) {
              console.error("Goal not found:", goalId);
              continue;
            }
            if(fitnessGoal.goal_id === undefined || fitnessGoal.member_id === undefined || fitnessGoal.goal_type === undefined || fitnessGoal.target_value === undefined) {
              console.error("Goal is missing required fields:", fitnessGoal);
              continue;
            }
            const newAchiev:newFitnessAchievement = {
              member_id: fitnessGoal.member_id as number,
              achievement_type: fitnessGoal.goal_type,
              target_value: fitnessGoal.target_value,
              achievement_date: new Date(),
            }
            createFitnessAchievement(newAchiev).then(() => {
              // delete from goals table
              deleteMemberFitnessGoal(goalId).then(() => {
                console.log("Deleted goal ID:", goalId);
              }).catch((error) => {
                console.error("Error deleting goal:", error);
              });

            })
            console.log("New achievement:", newAchiev);
          }
          console.log("Selected goal IDs:", selectedGoalIds);
        }
      }>
        Complete Selected Goals 
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
