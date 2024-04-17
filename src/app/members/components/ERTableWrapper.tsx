"use client"

// import  { DataTable }  from '@/app/trainers/components/DataTable';
import ERTable from "./ERTable"
import useMemberColumns from '../../components/membersColumns';
import { excerciseRoutine } from '@/db/types';
import { db } from "@/db/db";
import useRoutineColumn from "./ERCols";
export type PartialRoutine = {
    routine_id: number;
    routine_name: string;
    routine_description: string | null;
    routine_type: string;
    difficulty_level: string;
    routine:JSON;
}

export default function TableWrapper({data}: {data: PartialRoutine[]}){
  const ERcols = useRoutineColumn()
    return (
        <ERTable columns={ERcols} routines={data} />
    )
}
