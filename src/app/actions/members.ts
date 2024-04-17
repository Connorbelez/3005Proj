'use server'

import { member, newMember } from "@/db/types";
import { db } from "@/db/db"



// ==================================================== Member Registration and Personal info +=========d===============================================

export async function registerMember(
  mem: newMember
): Promise<BigInt | undefined> {
  const member = await db
    .insertInto("members")
    .values
    ({
      first_name: mem.first_name,
      last_name: mem.last_name,
      email: mem.email,
      password: mem.password,
      join_date: new Date(),
      member_status: "active"
    }).executeTakeFirstOrThrow()
  return member.insertId;
}



export async function logInUser(email:string, password:string):Promise<member>{
  try{
    const mem = await db
      .selectFrom("members")
      .where("email","=",email)
      .selectAll()
      .executeTakeFirstOrThrow()
    if(mem.password === password){
      return mem;
    }else{
      throw error("PW DOES NOT MATCH! ", mem.password, password)
    }
  }catch(err:any){
    console.log("ERROR GETTING BY EMAIL: ", email, " ERR: ",err)
    throw err
  }

}
export async function getMemberByEmail(email:string):Promise<member>{
  try{
    const mem = await db
      .selectFrom("members")
      .where("email","=",email)
      .selectAll()
      .executeTakeFirstOrThrow()
    return mem;
  }catch(err:any){
    console.log("ERROR GETTING BY EMAIL: ", email, " ERR: ",err)
    throw err
  }

}
export async function getMemberById(id:number):Promise<member>{
  try{
    const mem = await db
      .selectFrom("members")
      .where("member_id","=",id)
      .selectAll()
      .executeTakeFirstOrThrow()
    return mem;
  }catch(err:any){
    console.log("ERROR GETTING BY ID: ", id, " ERR: ",err)
    throw err
  }

}

export async function getAllMembers(): Promise<member[]> {
  try{
  console.log("Getting all members:")
  const mems: member[] = await db
    .selectFrom("members")
    .selectAll()
    .execute()
  return mems
  }catch(e:any)
  {
    console.log("ERROR: ", e)  
    throw e
  }
}



import { memberUpdate } from "@/db/types"

export async function updatePersonalInfo(
  partialMember: memberUpdate, member_id: number
): Promise<BigInt | undefined> {
  const member = await db
    .updateTable("members")
    .set(partialMember)
    .where(
      (eb) =>
        eb("members.member_id", "=", partialMember.member_id ? partialMember.member_id : null)
          .or("members.email", "=", partialMember.email ? partialMember.email : null)
    )
    .executeTakeFirstOrThrow()
  return member.numUpdatedRows;
}











//
//============================================================= HEALTH METRICS =================================


import { newHealthMetric, healthMetricUpdate, healthMetric } from "@/db/types"
export async function updateMemberHealthMetrics(
  partialHealthMetric: healthMetricUpdate
): Promise<BigInt | undefined> {
  if (!partialHealthMetric.metric_id) {
    throw new Error("member_id or email must be provided");
  }
  const res = await db
    .updateTable("health_metrics")
    .set(partialHealthMetric)
    .where("health_metrics.metric_id", "=", partialHealthMetric.metric_id)
    .executeTakeFirstOrThrow()
  return res.numUpdatedRows;
}

export async function deleteMemberHealthMetric(
  partialHealthMetric: healthMetricUpdate
): Promise<BigInt | undefined> {
  if (!partialHealthMetric.metric_id) {
    throw new Error("member_id or email must be provided");
  }
  const res = await db
    .deleteFrom("health_metrics")
    .where("health_metrics.metric_id", "=", partialHealthMetric.metric_id)
    .executeTakeFirstOrThrow()
  return res.numDeletedRows;
}

export async function createMemberHealthMetric(
  nhm: newHealthMetric
): Promise<BigInt | undefined> {
  if (!nhm.member_id) {
    throw new Error("member_id or email must be provided");
  }
  const res = await db
    .insertInto("health_metrics")
    .values(nhm)
    .executeTakeFirstOrThrow()
  return res.insertId;
}


export async function getAllMemberHealthMetrics(
  member_id: number
): Promise<healthMetric[]> {
  const res: healthMetric[] = await db
    .selectFrom("health_metrics")
    .where("health_metrics.member_id", "=", member_id)
    .selectAll()
    .execute()
  return res;
}

export async function getHealthMetric(
  metric_id: number
): Promise<healthMetric> {
  const res: healthMetric = await db
    .selectFrom("health_metrics")
    .where("health_metrics.metric_id", "=", metric_id)
    .selectAll()
    .executeTakeFirstOrThrow()
  return res;
}

//Get health metrics clustered by type and sorted by date
export async function getHealthMetricsByType(
  member_id: number
): Promise<healthMetric[]> {
  const res: healthMetric[] = await db
    .selectFrom("health_metrics")
    .where("health_metrics.member_id", "=", member_id)
    .orderBy("health_metrics.metric_type")
    .orderBy("health_metrics.date_recorded")
    .selectAll()
    .execute()
  return res;
}


export async function getRegisteredSessionsWithTrainerName(memberId: number): Promise<{
  trainer_id: number | null;
  session_id: number;
  start_time: Date;
  end_time: Date;
  first_name: string;
}[]> {
  const res = await db
      .selectFrom('personal_training_sessions')
      .innerJoin('trainers', 'personal_training_sessions.trainer_id', 'trainers.trainer_id')
      .select([
          'personal_training_sessions.session_id', 
          'personal_training_sessions.trainer_id', 
          'personal_training_sessions.start_time', 
          'personal_training_sessions.end_time', 
          'trainers.first_name'
      ])
      .where('personal_training_sessions.member_id', '=', memberId)
      .execute();

  return res 
}








//============================================================================== Routines ===============================================================
//

import type { newMemberRoutine, newExcerciseRoutine, excerciseRoutineUpdate, excerciseRoutine, memberRoutine, memberRoutineUpdate } from "@/db/types";

export async function createExcerciseRoutine(
  routine: newExcerciseRoutine
): Promise<BigInt | undefined> {
  const res = await db
    .insertInto("excercise_routine")
    .values(routine)
    .executeTakeFirstOrThrow()
  return res.insertId;
}

export async function createMemeberRoutine(
  routine: newExcerciseRoutine,
  member_id: number
): Promise<BigInt | undefined> {
  const rest = await db.transaction().execute(async (db) => {
    const r1 = await createExcerciseRoutine(routine);
    const rid:number = r1 ? parseInt(r1.toString()) : 0;
    const r2 = await db
      .insertInto("member_routines")
      .values({ member_id, member_routine_id: rid })
      .executeTakeFirstOrThrow()
    return r2.insertId;
  });
  return rest;
}



export async function getMemberRoutine(
  member_id: number
): Promise<memberRoutine[]> {
  const res: memberRoutine[] = await db
    .selectFrom("member_routines")
    .where("member_routines.member_id", "=", member_id)
    .selectAll()
    .execute()
  return res;
}

// add routine to member
export async function addRoutineToMember(
  routine_id: number, member_id: number
): Promise<BigInt | undefined> {
  const res = await db
    .insertInto("member_routines")
    .values({ member_id, routine_id })
    .executeTakeFirstOrThrow()
  return res.insertId;
}

export async function getExcerciseRoutine(
  routine_id: number
): Promise<excerciseRoutine> {
  const res: excerciseRoutine = await db
    .selectFrom("excercise_routine")
    .where("excercise_routine.routine_id", "=", routine_id)
    .selectAll()
    .executeTakeFirstOrThrow()
  return res;
}

export async function updateExcerciseRoutine(
  partialRoutine: excerciseRoutineUpdate
): Promise<BigInt | undefined> {
  if (!partialRoutine.routine_id) {
    throw new Error("routine_id must be provided");
  }
  const res = await db
    .updateTable("excercise_routine")
    .set(partialRoutine)
    .where("excercise_routine.routine_id", "=", partialRoutine.routine_id)
    .executeTakeFirstOrThrow()
  return res.numUpdatedRows;
}

export async function deleteExcerciseRoutine(
  routine_id: number
): Promise<BigInt | undefined> {
  const res = await db
    .deleteFrom("excercise_routine")
    .where("excercise_routine.routine_id", "=", routine_id)
    .executeTakeFirstOrThrow()
  return res.numDeletedRows;
}


//================================================================================ FITNESS ACHIEVEMENTS ================================================================
//

import { newFitnessAchievement, fitnessAchievement, fitnessAchievementUpdate } from "@/db/types";

export async function createFitnessAchievement(
  nfa: newFitnessAchievement
): Promise<BigInt | undefined> {
  if (!nfa.member_id) {
    throw new Error("member_id must be provided");
  }
  const res = await db
    .insertInto("fitness_achievments")
    .values(nfa)
    .executeTakeFirstOrThrow()
  return res.insertId;
}

export async function getMemberFitnessAchievements(
  member_id: number
): Promise<fitnessAchievement[]> {
  const res: fitnessAchievement[] = await db
    .selectFrom("fitness_achievments")
    .where("fitness_achievments.member_id", "=", member_id)
    .selectAll()
    .execute()
  return res;
}


export async function getFitnessAchievement(
  achievement_id: number
): Promise<fitnessAchievement> {
  const res: fitnessAchievement = await db
    .selectFrom("fitness_achievments")
    .where("fitness_achievments.achievement_id", "=", achievement_id)
    .selectAll()
    .executeTakeFirstOrThrow()
  return res;
}



export async function updateFitnessAchievement(
  partialAchievement: fitnessAchievementUpdate
): Promise<BigInt | undefined> {
  if (!partialAchievement.achievement_id) {
    throw new Error("achievement_id must be provided");
  }
  const res = await db
    .updateTable("fitness_achievments")
    .set(partialAchievement)
    .where("fitness_achievments.achievement_id", "=", partialAchievement.achievement_id)
    .executeTakeFirstOrThrow()
  return res.numUpdatedRows;
}



export async function deleteFitnessAchievement(
  partialAchievement: fitnessAchievementUpdate
): Promise<BigInt | undefined> {
  if (!partialAchievement.achievement_id) {
    throw new Error("achievement_id must be provided");
  }
  const res = await db
    .deleteFrom("fitness_achievments")
    .where("fitness_achievments.achievement_id", "=", partialAchievement.achievement_id)
    .executeTakeFirstOrThrow()
  return res.numDeletedRows;
}
//=============================================================================== FITNESS GOALS ==================================================================================
//

import { fitnessGoalUpdate, newFitnessGoal, fitnessGoal } from "@/db/types"
import { error } from "console";

export async function updateMemberFitnessGoals(
  partialFitnessGoal: fitnessGoalUpdate
): Promise<BigInt | undefined> {
  if (!partialFitnessGoal.member_id) {
    throw new Error("member_id or email must be provided");
  }
  const res = await db
    .updateTable("fitness_goals")
    .set(partialFitnessGoal)
    .where("fitness_goals.member_id", "=", partialFitnessGoal.member_id)
    .executeTakeFirstOrThrow()
  return res.numUpdatedRows;
}

export async function deleteMemberFitnessGoal(
  goal_id: number
): Promise<BigInt | undefined> {
  if (!goal_id) {
    throw new Error("member_id or email must be provided");
  }
  const res = await db
    .deleteFrom("fitness_goals")
    .where("fitness_goals.goal_id", "=", goal_id)
    .executeTakeFirstOrThrow()
  return res.numDeletedRows;
}

export async function createMemberFitnessGoal(
  nfg: newFitnessGoal
): Promise<BigInt | undefined> {
  if (!nfg.member_id) {
    throw new Error("member_id or email must be provided");
  }
  const res = await db
    .insertInto("fitness_goals")
    .values(nfg)
    .executeTakeFirstOrThrow()
  return res.insertId;
}

export async function getMemberFitnessGoals(
  member_id: number
): Promise<fitnessGoal[]> {
  const res: fitnessGoal[] = await db
    .selectFrom("fitness_goals")
    .where("fitness_goals.member_id", "=", member_id)
    .selectAll()
    .execute()
  return res;
}


export async function getMemberFitnessGoalsByType(
  member_id: number,
  goal_type: string
): Promise<fitnessGoal[]> {
  const res: fitnessGoal[] = await db
    .selectFrom("fitness_goals")
    .where("fitness_goals.member_id", "=", member_id)
    .where("fitness_goals.goal_type", "=", goal_type)
    .selectAll()
    .execute()
  return res;
}



export async function getFitnessGoal(
  goal_id: number
): Promise<fitnessGoal> {
  const res: fitnessGoal = await db
    .selectFrom("fitness_goals")
    .where("fitness_goals.goal_id", "=", goal_id)
    .selectAll()
    .executeTakeFirstOrThrow()
  return res;
}















