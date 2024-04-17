"use client"

import  { DataTable }  from '@/app/trainers/components/DataTable';

import useMemberColumns from '../../components/membersColumns';

export default function TableWrapper({data}: {data: {
    member_id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    join_date: Date;
    member_status: string | null;
}[]}){
    const memberColumns = useMemberColumns();
    return (
        <DataTable columns={memberColumns} data={data} />
    )
}