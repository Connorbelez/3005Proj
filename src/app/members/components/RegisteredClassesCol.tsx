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
import { ClassRegistrationWithNames } from "@/app/actions/classes";


export const RegisteredClassesColumns: ColumnDef<ClassRegistrationWithNames>[] = [

    // {
    //   id: "select",
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && "indeterminate")
    //       }
    //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={(value) => row.
    //           toggleSelected(!!value)}
    //       aria-label="Select row"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: false,
    // },
  //   {
  //     accessorKey: "class_name",
  //     header: "Class",
  //     cell: ({ row }) => <div className="capitalize">{row.getValue("class_name")}</div>,
  //   },
    {
      accessorKey: "first_name",
      header: "Trainer Name",
      cell: ({ row }) => <div className="capitalize">{row.getValue("first_name")}</div>,
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
  