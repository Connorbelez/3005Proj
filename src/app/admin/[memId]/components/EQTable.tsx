

"use client"
import * as React from "react";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { assignMemberRoutine } from "@/app/actions/routines";
import { equipment } from "@/db/types";
import { doMaintenance } from "@/app/actions/equipment";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export default function ERTable({ routines, columns }: { routines: Equipment[], columns:ColumnDef<Equipment>[]}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [memberId,setMemberId] = React.useState(-1)
  const data = routines
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
    <div className="rounded-md border">
      <div className="flex items-center py-4">
        <Input
          placeholder="search equipment Name"
          value={(table.getColumn("equipment_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("equipment_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />  
        <Input
 placeholder="search room number"
          value={(table.getColumn("room_id")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("room_id")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        /> 
        <Button variant="outline" size="lg" className="ml-auto" onClick={
        () => {
          const selectedGoalIds:number[] = table.getFilteredSelectedRowModel().rows.map(
            (row) => row.original.equipment_id
          );
          //for each goal id add it to the fitness_achievments table
          for (const goalId of selectedGoalIds) {
            console.log("Completing goal ID:", goalId);
            const fitnessGoal = data.find((goal) => goal.equipment_id === goalId);
            console.log("Fitness goal:", fitnessGoal);
            
            //do maintenance, update operational and maintenance logs
            doMaintenance({equipmentId:goalId}).then((res)=>{
              console.log("MAINTENANCE COMPLETED FOR: ", goalId)
            }).catch((e)=>{
              console.log("ERROR MAINTAINING EQUIPMENT: ", e)
            }
                    )
          }
        }
      }>
        Do Maintenance
      </Button>

      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
