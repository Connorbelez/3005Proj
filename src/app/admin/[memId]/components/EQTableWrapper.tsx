"use client"

// import  { DataTable }  from '@/app/trainers/components/DataTable';
import ERTable from "./EQTable"
import useMemberColumns from '../../components/membersColumns';
import { equipment, excerciseRoutine } from '@/db/types';
import { db } from "@/db/db";
import useRoutineColumn from "./EQCols";
export type Equipment = {
    equipment_id: number;
    equipment_name: string;
    equipment_type: string;
    operational: boolean;
    room_id: number | null;
    last_maintenance: Date;
}
export default function TableWrapper({data}: {data: Equipment[]}){
  const ERcols = useRoutineColumn()
    return (
        <ERTable columns={ERcols} routines={data} />
    )
}
