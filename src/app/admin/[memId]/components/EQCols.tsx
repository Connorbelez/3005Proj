

"use client"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table"
import { member as Member } from "@/db/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {useRouter} from "next/navigation"

import {Input} from "@/components/ui/input"
import { useState } from "react";
import { setMaxListeners } from "events";
import { assignMemberRoutine } from "@/app/actions/routines";
import { Equipment } from "./EQTableWrapper";
// export type Member = {
//   member_id: number
//   first_name: string
//   last_name: string
//   email: string
//   join_date: Date
//   member_status: "active" | "suspended" | "inactive"
// };
export default function useRoutineColumn() {
  let member_id;
  const router = useRouter()
  const [memberId, setMemberId] = useState(-1)
  const memberColumns: ColumnDef<Equipment>[] = [
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
      accessorKey: "equipment_name",
      header: "Name",
      cell: info => info.getValue()
    },
    {
      accessorKey: "room_id",
      header: "room number",
      cell: info => info.getValue()
    }, 
       {
      accessorKey: "operational",
      header: "operational",
      cell: info => info.getValue() ? "Yes" : "No"
    },
    {
      accessorKey: "last_maintenance",
      header: "Last Maintenance",
      cell: info => info.getValue().toLocaleDateString()
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const metric = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
           
          </DropdownMenu>
        )
      },
    },
  ]; 
  return memberColumns
}


// export const memberColumns: ColumnDef<Member>[] = [
//   {
//     accessorKey: "first_name",
//     header: "First Name",
//     cell: info => info.getValue()
//   },
//   {
//     accessorKey: "last_name",
//     header: "Last Name",
//     cell: info => info.getValue()
//   },
//   {
//     accessorKey: "email",
//     header: "Email",
//     cell: info => info.getValue()
//   },
//   {
//     accessorKey: "join_date",
//     header: "Join Date",
//     //@ts-ignore
//     cell: info => info.getValue().toLocaleDateString()
//   },
//   {
//     accessorKey: "member_status",
//     header: "Status",
//     cell: info => info.getValue()
//   },
//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       const metric = row.original;
//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <DotsHorizontalIcon className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <DropdownMenuItem
//               onClick={() => 
//                 //view members profile 
//                 router.push(`/members/${metric.member_id}`)
//               }
//             >
//               View Member
//             </DropdownMenuItem>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem>View Member</DropdownMenuItem>
//             <DropdownMenuItem>View Metric Details</DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
// ];
