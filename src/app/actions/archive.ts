//
// import type { Insertable, Selectable, Updateable } from "kysely";
// export type newClassRegistration = Insertable<class_registrations>;
// export type classRegistration = Selectable<class_registrations>;
// export type classRegistrationUpdate = Updateable<class_registrations>;
//
// export type newBooking = Insertable<bookings>;
// export type booking = Selectable<bookings>;
// export type bookingUpdate = Updateable<bookings>;
//
// export type newClass = Insertable<classes>;
// export type class_ = Selectable<classes>;
// export type classUpdate = Updateable<classes>;
//
// export type newFitnessAchievement = Insertable<fitness_achievments>;
// export type fitnessAchievement = Selectable<fitness_achievments>;
// export type fitnessAchievementUpdate = Updateable<fitness_achievments>;
//
// export type newFitnessGoal = Insertable<fitness_goals>;
// export type fitnessGoal = Selectable<fitness_goals>;
// export type fitnessGoalUpdate = Updateable<fitness_goals>;
//
// export type newHealthMetric = Insertable<health_metrics>;
// export type healthMetric = Selectable<health_metrics>;
// export type healthMetricUpdate = Updateable<health_metrics>;
//
// export type newMember = Insertable<members>;
// export type member = Selectable<members>;
// export type memberUpdate = Updateable<members>;
//
// export type newRoom = Insertable<rooms>;
// export type room = Selectable<rooms>;
// export type roomUpdate = Updateable<rooms>;
//
// export type newTrainerAvailability = Insertable<trainer_availability>;
// export type trainerAvailability = Selectable<trainer_availability>;
// export type trainerAvailabilityUpdate = Updateable<trainer_availability>;
//
// export type newTrainer = Insertable<trainers>;
// export type trainer = Selectable<trainers>;
// export type trainerUpdate = Updateable<trainers>;
//
// export type excerciseRoutine = Selectable<excercise_routine>;
// export type excerciseRoutineUpdate = Updateable<excercise_routine>;
// export type newExcerciseRoutine = Insertable<excercise_routine>;
// export type memberRoutine = Selectable<member_routines>;
// export type memberRoutineUpdate = Updateable<member_routines>;
// export type newMemberRoutine = Insertable<member_routines>;
//
// export type newPersonalTrainingSession = Insertable<personal_training_sessions>;
// export type personalTrainingSession = Selectable<personal_training_sessions>;
// export type personalTrainingSessionUpdate = Updateable<personal_training_sessions>;
//
// import {db} from "@/db/db"
// import {trainerAvailability, trainerAvailabilityUpdate, newTrainerAvailability, class_, newClass, classUpdate, personalTrainingSession, personalTrainingSessionUpdate, newPersonalTrainingSession, newTrainer, DB} from "@/db/types"
// import { error } from "console";
// import { DeleteResult, Transaction } from "kysely";
//
//
//
// //Get the availability of a trainer over a date range
// //collect all classes and personal training sessions that the trainer is scheduled for
// //collect the trainer's availability/work hours for the week
// //compare the two to determine the trainer's availability
//
// export async function getTrainerWorkHours(
//     trainer_id: number, start_date: Date, end_date: Date
// ): Promise<trainerAvailability[]> {
//     const res:trainerAvailability[] = await db
//     .selectFrom("trainer_availability")
//     .where("trainer_availability.trainer_id", "=", trainer_id)
//     .where("trainer_availability.start_time", ">=", start_date)
//     .where("trainer_availability.end_time", "<=", end_date)
//     .selectAll()
//     .execute()
//     return res;
// }
//
// //Get the trainers booked classes 
// export async function getTrainerClasses(
//     trainer_id: number, start_date: Date, end_date: Date
// ): Promise<class_[]> {
//     const res:class_[] = await db
//     .selectFrom("classes")
//     .where("classes.trainer_id", "=", trainer_id)
//     .where("classes.start_time", ">=", start_date)
//     .where("classes.end_time", "<=", end_date)
//     .selectAll()
//     .execute()
//     return res;
// }
//
// //Get the trainers booked personal training sessions
// export async function getTrainerPTS(
//     trainer_id: number, start_date: Date, end_date: Date
// ): Promise<personalTrainingSession[]> {
//     const res:personalTrainingSession[] = await db
//     .selectFrom("personal_training_sessions")
//     .where("personal_training_sessions.trainer_id", "=", trainer_id)
//     .where("personal_training_sessions.start_time", ">=", start_date)
//     .where("personal_training_sessions.end_time", "<=", end_date)
//     .selectAll()
//     .execute()
//     return res;
// }
//
//
//
//
// export interface TimeSlot {
//     start_time: Date;
//     end_time: Date;
// }
// export async function getTrainerBookedSlots(
//     trainer_id: number, start_date: Date, end_date: Date
// ): Promise<TimeSlot[]> {
//     //get union of trainer's classes and personal training sessions
//     const bookedSlots = await db.selectFrom("classes")
//         .innerJoin("personal_training_sessions", "classes.trainer_id", "personal_training_sessions.trainer_id")
//         .where((q) => q.and([
//             q("classes.trainer_id", "=", trainer_id),
//             q("start_time", ">=", start_date),
//             q("end_time", "<=", end_date),
//         ]))
//         .orderBy("start_time")
//         .select(["start_time", "end_time"])
//         .execute()
//     return bookedSlots;
// }
//
// export async function getTrainerAvailability(
//     trainer_id: number, start_date: Date, end_date: Date
// ): Promise<TimeSlot[]> {
//     //for each interval in the trainer's work hours, check when the trainer is booked, and split the interval accordingly. ie 
//     //work hours: 8am-12pm, 1pm-5pm
//     //booked: 8am-10am, 2pm-3pm
//     //available: 10am-12pm, 12pm-1pm, 3pm-5pm
//
//     const workIntervals = await getTrainerWorkHours(trainer_id, start_date, end_date);
//     const bookedSlots = await getTrainerBookedSlots(trainer_id, start_date, end_date);
//     const availability:TimeSlot[] = [];
//     
//     for (const interval of workIntervals) {
//         let start = interval.start_time;
//         for (const slot of bookedSlots) {
//             if (slot.start_time > start) {
//                 availability.push({start_time: start, end_time: slot.start_time});
//             }
//             start = slot.end_time;
//         }
//         if (start < interval.end_time) {
//             availability.push({start_time: start, end_time: interval.end_time});
//         }
//     }
//     return availability;
//
// }
//
//
// //Update trainer availability by removing timeslots. 
// export async function setTimeIntervalUnavailable(
//     trainer_id: number, start_time: Date, end_time: Date
// ): Promise<DeleteResult[]> {
//     //remove any existing availability for the trainer in the specified time interval, if 
//     //any classes or personal training sessions are scheduled during that time
//     //throw an error
//     const workIntervals = await getTrainerWorkHours(trainer_id, start_time, end_time);
//     if (workIntervals.length > 0) {
//         throw new Error("Trainer is scheduled for a class or personal training session during this time");
//     }
//     const res = await db
//         .deleteFrom("trainer_availability")
//         .where((q) => q.or([
//             q("trainer_id", "=", trainer_id),
//             q("start_time", ">=", start_time).and("start_time", "<=", end_time),
//             q("end_time", "<=", end_time).and("end_time", ">=", start_time)
//         ]))
//         .execute()
//     return res
// }
//
// //================================== Creating/merging availabilities ==========================
//
// export async function addTrainerAvailability(ta: newTrainerAvailability): Promise<number | undefined> {
//     if (!ta.trainer_id) {
//         throw new Error("Trainer ID must be provided");
//     }
//     const startTime = new Date(ta.start_time);
//     const endTime = new Date(ta.end_time);
//
//     // Start transaction for atomic operations
//     return db.transaction().execute(async trx => {
//         // Check and merge overlaps
//         if (!ta.trainer_id){
//             throw new Error("Trainer ID must be provided");
//         }
//     /* In the provided code, `trx` is a transaction object used for performing
//         atomic operations within a database transaction. Database transactions
//         ensure that a series of database operations are executed as a single
//         unit of work, either all succeeding or all failing. */
//
//         await mergeOverlaps(trx, ta.trainer_id, startTime, endTime);
//
//         // Insert new availability if it does not completely overlap existing ones
//         const newAvailabilityId = await insertNewAvailability(trx, ta.trainer_id, startTime, endTime);
//         return newAvailabilityId;
//     });
// }
//
// async function mergeOverlaps(trx:Transaction<DB>, trainerId: number, startTime: Date, endTime: Date): Promise<void> {
//     const overlappingAvailabilities: trainerAvailability[] = await trx
//         .selectFrom('trainer_availability')
//         .where((q)=>q.and([
//             q("trainer_id", "=", trainerId),
//             q("end_time", ">=", startTime),
//             q("start_time", "<=", endTime)
//         ]))
//         .selectAll()
//         .orderBy("start_time")
//         .execute()
//         // .where('trainer_id', '=', trainerId)
//         // .where((sql) => sql.('end_time', '>=', startTime)
//         //     .where('start_time', '<=', endTime))
//         // .where('trainer_id', '=', trainerId)
//         // .where(sql => sql
//         //     .where('end_time', '>=', startTime)
//         //     .where('start_time', '<=', endTime))
//         // .orderBy('start_time')
//         // .execute();
//
//     let mergedStartTime = startTime;
//     let mergedEndTime = endTime;
//
//     for (const avail of overlappingAvailabilities) {
//         // Extend the merged block to include the current availability
//         if (avail.start_time < mergedStartTime) {
//             mergedStartTime = avail.start_time;
//         }
//         if (avail.end_time > mergedEndTime) {
//             mergedEndTime = avail.end_time;
//         }
//     }
//
//     // Remove all overlapping availabilities
//     await trx.deleteFrom('trainer_availability')
//         .where((q)=>q.and([
//             q("trainer_id", "=", trainerId),
//             q("end_time", ">=", startTime),
//             q("start_time", "<=", endTime)
//         ]))
//         // .where('trainer_id', '=', trainerId)
//         // .where(sql => sql
//         //     .where('end_time', '>=', startTime)
//         //     .where('start_time', '<=', endTime))
//         .execute();
//
//     // Insert the merged availability block
//     await trx.insertInto('trainer_availability')
//         .values({
//             trainer_id: trainerId,
//             start_time: mergedStartTime,
//             end_time: mergedEndTime
//         })
//         .execute();
// }
//
// async function insertNewAvailability(trx:Transaction<DB>, trainerId: number, startTime: Date, endTime: Date): Promise<number | undefined> {
//     // Check if there is still a gap to fill
//     const existingCount = await trx.selectFrom('trainer_availability')
//         .where('trainer_id', '=', trainerId)
//         .where('start_time', '<=', startTime)
//         .where('end_time', '>=', endTime)
//         .select((q) => q.fn.count<number>('availability_id').as('count'))
//         .executeTakeFirst();
//
//     if (existingCount && existingCount.count > 0) {
//         // The new timeslot is completely covered by an existing one
//         return undefined;
//     } else {
//         // Insert the new availability block, possibly adjusted
//         const result = await trx.insertInto('trainer_availability')
//             .values({
//                 trainer_id: trainerId,
//                 start_time: startTime,
//                 end_time: endTime
//             })
//             .returning('availability_id')
//             .executeTakeFirstOrThrow();
//         return result.availability_id
//     }
// }
// //================================== END ===========================================
//
//
//
// export async function updateTrainerAvailability(
//     partialAvailability: trainerAvailabilityUpdate
// ): Promise<BigInt | undefined> {
//     if (!partialAvailability.availability_id) {
//         throw new Error("availability_id must be provided");
//     }
//     const res = await db
//         .updateTable("trainer_availability")
//         .set(partialAvailability)
//         .where("trainer_availability.availability_id", "=", partialAvailability.availability_id)
//         .executeTakeFirstOrThrow()
//     return res.numUpdatedRows;
// }
//
//
//
// //ToDo: Need to check availability first 
// // add personal training session to trainer
// export async function createPersonalTrainingSession(
//     pts: newPersonalTrainingSession
// ): Promise<BigInt | undefined> {
//     if(!pts.trainer_id || !pts.end_time || !pts.start_time || !pts.member_id){
//       throw error("trainer ID, start and end time must be included");
//       
//   }
//     const isAvailable = trainerIsAvailable(pts.trainer_id, new Date(pts.start_time), new Date( pts.end_time ));
//     if(!isAvailable){
//     throw error("Trainer not available")
//   }
//     const res = await db
//         .insertInto("personal_training_sessions")
//         .values(pts)
//         .executeTakeFirstOrThrow()
//     return res.insertId;
// }
//
//
//
//
// export async function trainerIsAvailable(
//     trainer_id: number, start_time: Date, end_time: Date
// ): Promise<boolean> {
//     try{
//     const res:trainerAvailability = await db
//     .selectFrom("trainer_availability")
//     .where("trainer_availability.trainer_id", "=", trainer_id)
//     .where((q)=> q.and([
//         q("trainer_availability.start_time", "<=", start_time),
//         q("trainer_availability.end_time", ">=", end_time)
//     ]))
//     .selectAll()
//     .executeTakeFirstOrThrow()
//     return true;
// }catch(e){
//     return false;
// }
//
// }
//
// export async function createClass(c: newClass): Promise<BigInt | undefined> {
//     if (!c.trainer_id) {
//         throw new Error("Trainer ID must be provided");
//     }
//
//     const startTime = new Date(c.start_time);
//     const endTime = new Date(c.end_time);
//
//     // Start transaction for atomic operations
//     return db.transaction().execute(async trx => {
//         // Check and merge overlaps
//         if (!c.trainer_id){
//             throw new Error("Trainer ID must be provided");
//         }
//         if (!trainerIsAvailable(c.trainer_id, startTime, endTime)) {
//             throw new Error("Trainer is not available during this time");
//         }
//         //ToDo: Check if room is available
//         const res = await db
//             .insertInto("classes")    
//             .values(c)
//             .executeTakeFirstOrThrow()
//         return res.insertId;
//         // Insert new availability if it does not completely overlap existing ones
//     });
// }
//
// export async function updateClass(
//     partialClass: classUpdate
// ): Promise<BigInt | undefined> {
//     if (!partialClass.class_id) {
//         throw new Error("class_id must be provided");
//     }
//     const res = await db
//         .updateTable("classes")
//         .set(partialClass)
//         .where("classes.class_id", "=", partialClass.class_id)
//         .executeTakeFirstOrThrow()
//     return res.numUpdatedRows;
// }
//
// 'use server'
//
// import { member, newMember } from "@/db/types";
// import { db } from "@/db/db"
//
//
//
// // ==================================================== Member Registration and Personal info +=========d===============================================
//
// export async function registerMember(
//   mem: newMember
// ): Promise<BigInt | undefined> {
//   const member = await db
//     .insertInto("members")
//     .values
//     ({
//       first_name: mem.first_name,
//       last_name: mem.last_name,
//       email: mem.email,
//       password: mem.password,
//       join_date: new Date(),
//       member_status: "active"
//     }).executeTakeFirstOrThrow()
//   return member.insertId;
//
//
// }
//
//
// export async function getAllMembers(): Promise<member[]> {
//   try{
//   console.log("Getting all members:")
//   const mems: member[] = await db
//     .selectFrom("members")
//     .selectAll()
//     .execute()
//   return mems
//   }catch(e:any)
//   {
//     console.log("ERROR: ", e)   
//     throw e
//   }
// }
//
//
//
// import { memberUpdate } from "@/db/types"
//
// export async function updatePersonalInfo(
//   partialMember: memberUpdate, member_id: number
// ): Promise<BigInt | undefined> {
//   const member = await db
//     .updateTable("members")
//     .set(partialMember)
//     .where(
//       (eb) =>
//         eb("members.member_id", "=", partialMember.member_id ? partialMember.member_id : null)
//           .or("members.email", "=", partialMember.email ? partialMember.email : null)
//     )
//     .executeTakeFirstOrThrow()
//   return member.numUpdatedRows;
// }
//
//
//
//
//
//
//
//
//
//
//
// //
// //============================================================= HEALTH METRICS =================================
//
//
// import { newHealthMetric, healthMetricUpdate, healthMetric } from "@/db/types"
// export async function updateMemberHealthMetrics(
//   partialHealthMetric: healthMetricUpdate
// ): Promise<BigInt | undefined> {
//   if (!partialHealthMetric.metric_id) {
//     throw new Error("member_id or email must be provided");
//   }
//   const res = await db
//     .updateTable("health_metrics")
//     .set(partialHealthMetric)
//     .where("health_metrics.metric_id", "=", partialHealthMetric.metric_id)
//     .executeTakeFirstOrThrow()
//   return res.numUpdatedRows;
// }
//
// export async function deleteMemberHealthMetric(
//   partialHealthMetric: healthMetricUpdate
// ): Promise<BigInt | undefined> {
//   if (!partialHealthMetric.metric_id) {
//     throw new Error("member_id or email must be provided");
//   }
//   const res = await db
//     .deleteFrom("health_metrics")
//     .where("health_metrics.metric_id", "=", partialHealthMetric.metric_id)
//     .executeTakeFirstOrThrow()
//   return res.numDeletedRows;
// }
//
// export async function createMemberHealthMetric(
//   nhm: newHealthMetric
// ): Promise<BigInt | undefined> {
//   if (!nhm.member_id) {
//     throw new Error("member_id or email must be provided");
//   }
//   const res = await db
//     .insertInto("health_metrics")
//     .values(nhm)
//     .executeTakeFirstOrThrow()
//   return res.insertId;
// }
//
//
// export async function getAllMemberHealthMetrics(
//   member_id: number
// ): Promise<healthMetric[]> {
//   const res: healthMetric[] = await db
//     .selectFrom("health_metrics")
//     .where("health_metrics.member_id", "=", member_id)
//     .selectAll()
//     .execute()
//   return res;
// }
//
// export async function getHealthMetric(
//   metric_id: number
// ): Promise<healthMetric> {
//   const res: healthMetric = await db
//     .selectFrom("health_metrics")
//     .where("health_metrics.metric_id", "=", metric_id)
//     .selectAll()
//     .executeTakeFirstOrThrow()
//   return res;
// }
//
// //Get health metrics clustered by type and sorted by date
// export async function getHealthMetricsByType(
//   member_id: number
// ): Promise<healthMetric[]> {
//   const res: healthMetric[] = await db
//     .selectFrom("health_metrics")
//     .where("health_metrics.member_id", "=", member_id)
//     .orderBy("health_metrics.metric_type")
//     .orderBy("health_metrics.date_recorded")
//     .selectAll()
//     .execute()
//   return res;
// }
//
//
//
//
//
//
//
//
// //============================================================================== Routines ===============================================================
// //
//
// import type { newMemberRoutine, newExcerciseRoutine, excerciseRoutineUpdate, excerciseRoutine, memberRoutine, memberRoutineUpdate } from "@/db/types";
//
// export async function createExcerciseRoutine(
//   routine: newExcerciseRoutine
// ): Promise<BigInt | undefined> {
//   const res = await db
//     .insertInto("excercise_routine")
//     .values(routine)
//     .executeTakeFirstOrThrow()
//   return res.insertId;
// }
//
// export async function createMemeberRoutine(
//   routine: newExcerciseRoutine,
//   member_id: number
// ): Promise<BigInt | undefined> {
//   if (!routine.routine_id || routine.routine_id === undefined) {
//     throw new Error("routine_id must be provided");
//   }
//   const rest = await db.transaction().execute(async (db) => {
//     const r1 = await createExcerciseRoutine(routine);
//     const r2 = await db
//       .insertInto("member_routines")
//       .values({ member_id, routine_id: r1 })
//       .executeTakeFirstOrThrow()
//     return r2.insertId;
//   });
//   return rest;
// }
//
//
//
// export async function getMemberRoutine(
//   member_id: number
// ): Promise<memberRoutine[]> {
//   const res: memberRoutine[] = await db
//     .selectFrom("member_routines")
//     .where("member_routines.member_id", "=", member_id)
//     .selectAll()
//     .execute()
//   return res;
// }
//
// // add routine to member
// export async function addRoutineToMember(
//   routine_id: number, member_id: number
// ): Promise<BigInt | undefined> {
//   const res = await db
//     .insertInto("member_routines")
//     .values({ member_id, routine_id })
//     .executeTakeFirstOrThrow()
//   return res.insertId;
// }
//
// export async function getExcerciseRoutine(
//   routine_id: number
// ): Promise<excerciseRoutine> {
//   const res: excerciseRoutine = await db
//     .selectFrom("excercise_routine")
//     .where("excercise_routine.routine_id", "=", routine_id)
//     .selectAll()
//     .executeTakeFirstOrThrow()
//   return res;
// }
//
// export async function updateExcerciseRoutine(
//   partialRoutine: excerciseRoutineUpdate
// ): Promise<BigInt | undefined> {
//   if (!partialRoutine.routine_id) {
//     throw new Error("routine_id must be provided");
//   }
//   const res = await db
//     .updateTable("excercise_routine")
//     .set(partialRoutine)
//     .where("excercise_routine.routine_id", "=", partialRoutine.routine_id)
//     .executeTakeFirstOrThrow()
//   return res.numUpdatedRows;
// }
//
// export async function deleteExcerciseRoutine(
//   routine_id: number
// ): Promise<BigInt | undefined> {
//   const res = await db
//     .deleteFrom("excercise_routine")
//     .where("excercise_routine.routine_id", "=", routine_id)
//     .executeTakeFirstOrThrow()
//   return res.numDeletedRows;
// }
//
//
// //================================================================================ FITNESS ACHIEVEMENTS ================================================================
// //
//
// import { newFitnessAchievement, fitnessAchievement, fitnessAchievementUpdate } from "@/db/types";
//
// export async function createFitnessAchievement(
//   nfa: newFitnessAchievement
// ): Promise<BigInt | undefined> {
//   if (!nfa.member_id) {
//     throw new Error("member_id must be provided");
//   }
//   const res = await db
//     .insertInto("fitness_achievments")
//     .values(nfa)
//     .executeTakeFirstOrThrow()
//   return res.insertId;
// }
//
//
//
// export async function getFitnessAchievement(
//   achievement_id: number
// ): Promise<fitnessAchievement> {
//   const res: fitnessAchievement = await db
//     .selectFrom("fitness_achievments")
//     .where("fitness_achievments.achievement_id", "=", achievement_id)
//     .selectAll()
//     .executeTakeFirstOrThrow()
//   return res;
// }
//
//
//
// export async function updateFitnessAchievement(
//   partialAchievement: fitnessAchievementUpdate
// ): Promise<BigInt | undefined> {
//   if (!partialAchievement.achievement_id) {
//     throw new Error("achievement_id must be provided");
//   }
//   const res = await db
//     .updateTable("fitness_achievments")
//     .set(partialAchievement)
//     .where("fitness_achievments.achievement_id", "=", partialAchievement.achievement_id)
//     .executeTakeFirstOrThrow()
//   return res.numUpdatedRows;
// }
//
//
//
// export async function deleteFitnessAchievement(
//   partialAchievement: fitnessAchievementUpdate
// ): Promise<BigInt | undefined> {
//   if (!partialAchievement.achievement_id) {
//     throw new Error("achievement_id must be provided");
//   }
//   const res = await db
//     .deleteFrom("fitness_achievments")
//     .where("fitness_achievments.achievement_id", "=", partialAchievement.achievement_id)
//     .executeTakeFirstOrThrow()
//   return res.numDeletedRows;
// }
// //=============================================================================== FITNESS GOALS ==================================================================================
// //
//
// import { fitnessGoalUpdate, newFitnessGoal, fitnessGoal } from "@/db/types"
//
// export async function updateMemberFitnessGoals(
//   partialFitnessGoal: fitnessGoalUpdate
// ): Promise<BigInt | undefined> {
//   if (!partialFitnessGoal.member_id) {
//     throw new Error("member_id or email must be provided");
//   }
//   const res = await db
//     .updateTable("fitness_goals")
//     .set(partialFitnessGoal)
//     .where("fitness_goals.member_id", "=", partialFitnessGoal.member_id)
//     .executeTakeFirstOrThrow()
//   return res.numUpdatedRows;
// }
//
// export async function deleteMemberFitnessGoal(
//   partialFitnessGoal: fitnessGoalUpdate
// ): Promise<BigInt | undefined> {
//   if (!partialFitnessGoal.goal_id) {
//     throw new Error("member_id or email must be provided");
//   }
//   const res = await db
//     .deleteFrom("fitness_goals")
//     .where("fitness_goals.goal_id", "=", partialFitnessGoal.goal_id)
//     .executeTakeFirstOrThrow()
//   return res.numDeletedRows;
// }
//
// export async function createMemberFitnessGoal(
//   nfg: newFitnessGoal
// ): Promise<BigInt | undefined> {
//   if (!nfg.member_id) {
//     throw new Error("member_id or email must be provided");
//   }
//   const res = await db
//     .insertInto("fitness_goals")
//     .values(nfg)
//     .executeTakeFirstOrThrow()
//   return res.insertId;
// }
//
// export async function getMemberFitnessGoals(
//   member_id: number
// ): Promise<fitnessGoal[]> {
//   const res: fitnessGoal[] = await db
//     .selectFrom("fitness_goals")
//     .where("fitness_goals.member_id", "=", member_id)
//     .selectAll()
//     .execute()
//   return res;
// }
//
// export async function getMemberFitnessGoalsByType(
//   member_id: number,
//   goal_type: string
// ): Promise<fitnessGoal[]> {
//   const res: fitnessGoal[] = await db
//     .selectFrom("fitness_goals")
//     .where("fitness_goals.member_id", "=", member_id)
//     .where("fitness_goals.goal_type", "=", goal_type)
//     .selectAll()
//     .execute()
//   return res;
// }
//
//
//
// export async function getFitnessGoal(
//   goal_id: number
// ): Promise<fitnessGoal> {
//   const res: fitnessGoal = await db
//     .selectFrom("fitness_goals")
//     .where("fitness_goals.goal_id", "=", goal_id)
//     .selectAll()
//     .executeTakeFirstOrThrow()
//   return res;
// }
