

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
import { PartialRoutine } from "./ERTableWrapper";
import {Input} from "@/components/ui/input"
import { useState } from "react";
import { setMaxListeners } from "events";
import { assignMemberRoutine } from "@/app/actions/routines";
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
  const memberColumns: ColumnDef<PartialRoutine>[] = [
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
      accessorKey: "routine_name",
      header: "Name",
      cell: info => info.getValue()
    },
    {
      accessorKey: "routine_type",
      header: "Tyle",
      cell: info => info.getValue()
    },
    {
      accessorKey: "difficulty_level",
      header: "Difficulty Level",
      cell: info => info.getValue()
    },
    {
      accessorKey: "routine_description",
      header: "Description",
      //@ts-ignore
      cell: info => info.getValue()
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
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Input type="number" id="memID" onChange={
                  (event:any) => {setMemberId(event.target.value)}
                }/>
            </DropdownMenuItem> 
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => 
                  //view members profile 
                  // const rid = metric.routine_id
                  // assignRoutine({memberId=memberId, routineId=rid)
                  assignMemberRoutine({memberId:memberId, routineId:metric.routine_id}).then((res)=>{
                    console.log("SUCCESS ADDED ROUTINE TO MEMBER: ", memberId, metric.routine_id)
                  }).catch((e)=>{
                    console.log("ERROR ASSIGNING ROUTINE: ", e)
                  }
                          )
                  // router.push(`/trainers/${metric.member_id}/dashboard/memberSearch`)
                }
              >
                Assign Routine
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem

                onClick={() => 
                  //view members profile 
                  // const rid = metric.routine_id
                  // assignRoutine({memberId=memberId, routineId=rid)
                  router.push(`/routines/${metric.routine_id}`)
                }
              >View Routine</DropdownMenuItem>
              <DropdownMenuItem>View Metric Details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]; 
  return memberColumns
}


