

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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
import { newClassRegistration, class_, classUpdate} from "@/db/types";
import {  createClassRegistration, ClassRegistrationWithNames, updateClassSchedule } from "@/app/actions/classes";

export type RoomTimeSlots = {

}

export const columns: ColumnDef<ClassRegistrationWithNames>[] = [
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
    accessorKey: "class_name",
    header: "Class",
    cell: ({ row }) => <div className="capitalize">{row.getValue("class_name")}</div>,
  },
  {
    accessorKey: "first_name",
    header: "Trainer Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("first_name")}</div>,
  },
  {
    accessorKey: "start_time",
    header: "date",
    cell: ({ row }) => {
      const date: Date | null = row.getValue('start_time');
      return date ? date.getDate() : null;
    },
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

];

export default function GCSlot({ gcs, memId }: { gcs: ClassRegistrationWithNames[], memId:number}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  //Filter out the classes that the member is already registered for
// gcs = gcs.filter((gc) => !registered.find((r) => r.class_id === gc.class_id));

const data = gcs;
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
  const [startTime, setStartTime] = React.useState<Value>(new Date());
  const [endTime, setEndTime] = React.useState<Value>(new Date());
  const [trainerId, setTrainerId] = React.useState<number>(-1)
  return (
    <div className="w-full">
    <div className="flex flex-col items-center">

          
            <div>
                  <DateTimePicker onChange={setStartTime} value={startTime} />
          </div>
          <div>
                  <DateTimePicker onChange={setEndTime} value={endTime} />

          </div>
          <div>
            <Input 
            onChange={(e:any)=>{
              setTrainerId(parseInt(e.target.value))
            }} 
            value={trainerId}
            type="number" 
            placeholder="Enter Trainer ID" />
          </div>
        
      <Button variant="outline" size="lg" className="ml-auto" onClick={
        () => {
          const selectedGcIds = table.getFilteredSelectedRowModel().rows.map(
            (row) => row.original.class_id
          );
          //for each goal id add it to the fitness_achievments table
          for (const gcId of selectedGcIds) {
            const timeSlot = data.find((ts) => ts.class_id === gcId);
            //ToDo: update the class time and trainerID 
            const classU:classUpdate = {
                class_id: gcId,
                start_time: new Date(startTime as Date),
                end_time: new Date(endTime as Date),
                trainer_id: trainerId
            }
            updateClassSchedule(classU)

           
   

          }
        }
      }>
        UpdateClass
      </Button>
</div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter GCs..."
          value={(table.getColumn("class_name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("class_name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
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
