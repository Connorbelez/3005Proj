import {db} from "@/db/db";
import JsonDisplay from "@/app/components/JsonDisplay";
export default async function Page({ params }: { params: { rid: number } }) {
    const routine = await db.selectFrom("excercise_routine").where("routine_id", "=",params.rid)
    .select("routine").
    execute();
    console.log(routine)
    return (
        <div className="flex flex-col space-y-8 space-x-8 items-center ">
            <div className="max-w-4xl flex flex-col space-y-8 items-center prose">
                <h1>
                    Routine Details
                </h1>
                <JsonDisplay jsonData={routine} />
            </div>
        </div>
    )
}