'use server'
import {db} from "@/db/db"
import {trainerAvailability, trainerAvailabilityUpdate, newTrainerAvailability, class_, newClass, classUpdate, personalTrainingSession, personalTrainingSessionUpdate, newPersonalTrainingSession, newTrainer, DB, newExcerciseRoutine} from "@/db/types"

export async function assignMemberRoutine(
    {routineId, memberId}:{routineId:number, memberId:number}
): Promise<BigInt | undefined>{
    console.log("ASSIGNING ", routineId," to :",memberId )
    try{

    const res = await db.insertInto("member_routines").values({
        routine_id: routineId,
        member_id: memberId
    }).executeTakeFirstOrThrow()
    return res.insertId
    }catch(error){
        console.error("ERROR ASSIGNING ", routineId," to :",memberId )
        console.error("ERROR: ",error)
    }
}


//Get routines assigned to a member 
export async function getMemberRoutines(memberId:number): Promise<newExcerciseRoutine[]>{
    const routines = await db.selectFrom("excercise_routine")
    .innerJoin("member_routines", "excercise_routine.routine_id", "member_routines.routine_id")
    .where("member_routines.member_id", "=", memberId)
    .select([
        "excercise_routine.routine_id",
        "excercise_routine.routine_name",
        "excercise_routine.routine_description",
        "excercise_routine.routine_type",
        "excercise_routine.difficulty_level",
        "excercise_routine.routine"
    ])
    .execute();
    
    return routines
}
