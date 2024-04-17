

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
import { PartialRoutine } from "./ERTableWrapper";
import { assignMemberRoutine } from "@/app/actions/routines";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export default function ERTable({ routines, columns }: { routines: PartialRoutine[], columns:ColumnDef<PartialRoutine>[]}) {
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
          placeholder="search routine Name"
          value={(table.getColumn("routine_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("routine_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />  
        <Input
          placeholder="Member ID"
          onChange={(event) =>
            setMemberId(parseInt(event.target.value))
          }
          className="max-w-sm"
        /> 
        <Button variant="outline" size="lg" className="ml-auto" onClick={
        () => {
          const selectedGoalIds:number[] = table.getFilteredSelectedRowModel().rows.map(
            (row) => row.original.routine_id
          );
          //for each goal id add it to the fitness_achievments table
          for (const goalId of selectedGoalIds) {
            console.log("Completing goal ID:", goalId);
            const fitnessGoal = data.find((goal) => goal.routine_id === goalId);
            console.log("Fitness goal:", fitnessGoal);
            if(!fitnessGoal) {
              console.error("Goal not found:", goalId);
              continue;
            }
            if(memberId < 0 || !goalId || !fitnessGoal.routine_id){
              console.error("MISSING MEMID")
              continue
            }
              console.log("ASSIGNING ", fitnessGoal.routine_id," to :",memberId )
            assignMemberRoutine({routineId:fitnessGoal.routine_id, memberId:memberId}).then((res)=>{
              console.log("ASSIGNED ", fitnessGoal.routine_id," to :",memberId )
              console.log("RES: ",res)
            }).catch((error)=>{
              console.error("ERROR ASSIGNING ", fitnessGoal.routine_id," to :",memberId )
              console.error("ERROR: ",error)
            })
      
            // if(fitnessGoal.routine_id === undefined || fitnessGoal.member_id === undefined || fitnessGoal.goal_type === undefined || fitnessGoal.target_value === undefined) {
            //   console.error("Goal is missing required fields:", fitnessGoal);
            //   continue;
            // }
            // const newAchiev:newFitnessAchievement = {
            //   member_id: fitnessGoal.member_id as number,
            //   achievement_type: fitnessGoal.goal_type,
            //   target_value: fitnessGoal.target_value,
            //   achievement_date: new Date(),
            // }
            // createFitnessAchievement(newAchiev).then(() => {
            //   // delete from goals table
            //   deleteMemberFitnessGoal(goalId).then(() => {
            //     console.log("Deleted goal ID:", goalId);
            //   }).catch((error) => {
            //     console.error("Error deleting goal:", error);
            //   });
            //
            // })
            // console.log("New achievement:", newAchiev);
          }
          console.log("Selected goal IDs:", selectedGoalIds);
        }
      }>
        Assign Selected Routines to Member 
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
