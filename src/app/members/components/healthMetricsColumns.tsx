
"use client"

import { ColumnDef } from "@tanstack/react-table"

export type HealthMetric = {
  metric_id: number;
  member_id: number;
  metric_type: string;
  value: string;
  date_recorded: Date;
};

export const healthMetricsColumns: ColumnDef<HealthMetric>[] = [
  {
    accessorKey: "metric_type",
    header: "Metric Type",
    cell: info => info.getValue()
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: info => info.getValue()
  },
  {
    accessorKey: "date_recorded",
    header: "Date Recorded",
    //@ts-ignore
    cell: info => info.getValue().toLocaleDateString()
  },
  {
    accessorKey: "member_id",
    header: "Member ID",
    cell: info => info.getValue()
  },
];
