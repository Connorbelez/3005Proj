
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { member as Member } from "@/db/types";
// export type Member = {
//   member_id: number
//   first_name: string
//   last_name: string
//   email: string
//   join_date: Date
//   member_status: "active" | "suspended" | "inactive"
// };

export const memberColumns: ColumnDef<Member>[] = [
  {
    accessorKey: "first_name",
    header: "First Name",
    cell: info => info.getValue()
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
    cell: info => info.getValue()
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: info => info.getValue()
  },
  {
    accessorKey: "join_date",
    header: "Join Date",
    //@ts-ignore
    cell: info => info.getValue().toLocaleDateString()
  },
  {
    accessorKey: "member_status",
    header: "Status",
    cell: info => info.getValue()
  },
];
