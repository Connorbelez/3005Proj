'use server'
import {db} from "@/db/db"
import {trainerAvailability, trainerAvailabilityUpdate, newTrainerAvailability, class_, newClass, classUpdate, personalTrainingSession, personalTrainingSessionUpdate, newPersonalTrainingSession, newTrainer, DB, newExcerciseRoutine} from "@/db/types"
import { error } from "console";
import { DeleteResult, Transaction } from "kysely";

import { sql } from 'kysely'

export async function registerTrainer(t: newTrainer): Promise<BigInt | undefined> {
    const res = await db
        .insertInto("trainers")
        .values(t)
        .executeTakeFirstOrThrow()
    return res.insertId;
}

export async function trainerLogin(email: string, password: string): Promise<newTrainer | undefined> {
    const res = await db
        .selectFrom("trainers")
        .where("email", "=", email)
        .where("password", "=", password)
        .selectAll()
        .executeTakeFirstOrThrow();
    return res;
}


/**
 * Creates a weekly repeating class for a trainer over a specified number of weeks.
 * @param c The class to be scheduled, containing initial start and end times.
 * @param weeks The number of weeks to repeat the class.
 * @returns The ID of the last class created.
 */
export async function createWeeklyClass(c: newClass, weeks: number): Promise<BigInt | undefined> {
    let resultId: BigInt | undefined = undefined;

    // Ensure c includes start_time and end_time as Date objects or ISO string.
    let startTime = new Date(c.start_time);
    let endTime = new Date(c.end_time);

    for (let i = 0; i < weeks; i++) {
        // Create a class for the current week
        resultId = await createClass({
            ...c,
            start_time: startTime,
            end_time: endTime
        });

        // Increment the start and end times by 7 days for the next iteration
        startTime.setDate(startTime.getDate() + 7);
        endTime.setDate(endTime.getDate() + 7);
    }

    return resultId;
}


export async function getTrainerWorkHours(
    trainer_id: number, start_date: Date, end_date: Date
): Promise<TrainerAvailabilitySlot[]> {
    const res:trainerAvailability[] = await db
    .selectFrom("trainer_availability")
    .where("trainer_availability.trainer_id", "=", trainer_id)
    .where("trainer_availability.start_time", ">=", start_date)
    .where("trainer_availability.end_time", "<=", end_date)
    .selectAll()
    .execute()
    const slots:TrainerAvailabilitySlot[] = []
    for (const sl of res) {
      const nsl:TrainerAvailabilitySlot = {
        start_time:sl.start_time,
        ts_id:sl.availability_id,
        end_time:sl.end_time,
        day:convertDateToDay(sl.start_time),
        date:sl.start_time.getDate(),
        trainer_id:sl.trainer_id as number,
      } 
      slots.push(nsl)
    }
    return slots;
}

//Get the trainers booked classes 
export async function getTrainerClasses(
    trainer_id: number, start_date: Date, end_date: Date
): Promise<class_[]> {
    const res:class_[] = await db
    .selectFrom("classes")
    .where("classes.trainer_id", "=", trainer_id)
    .where("classes.start_time", ">=", start_date)
    .where("classes.end_time", "<=", end_date)
    .selectAll()
    .execute()
    return res;
}

//Get the trainers booked personal training sessions
export async function getTrainerPTS(
    trainer_id: number, start_date: Date, end_date: Date
): Promise<personalTrainingSession[]> {
    const res:personalTrainingSession[] = await db
    .selectFrom("personal_training_sessions")
    .where("personal_training_sessions.trainer_id", "=", trainer_id)
    .where("personal_training_sessions.start_time", ">=", start_date)
    .where("personal_training_sessions.end_time", "<=", end_date)
    .selectAll()
    .execute()
    return res;
}




export interface TimeSlot {
    start_time: Date;
    end_time: Date;
}

export type TrainerTimeSlot = {
    start_time: Date;
    end_time: Date;
    trainer_id: number;
    subject_id: number; // class_id or session_id
    type: "class" | "session";
    subject_name: string; // class_name or member_name
    day: string | undefined; 
    date: number;
}
function convertDateToDay(date: Date): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
  }

export async function getTrainerBookedSlotsForTrainer(
    trainer_id: number, start_date: Date, end_date: Date
): Promise<TrainerTimeSlot[]> {
    const bookedSlots = await db.selectFrom('classes').innerJoin('trainers', 'classes.trainer_id', 'trainers.trainer_id')
    .select([
        sql<Date>`classes.start_time`.as("u_start_time"),
        sql<Date>`classes.end_time`.as("u_end_time"),
        sql<number>`classes.class_id`.as("booking_id"),
        sql<string>`classes.class_name`.as("booking_name"),
        sql<number>`trainers.trainer_id`.as("trainer_id"),
        sql<number>`0`.as("is_personal_training")
        // 'classes.class_id as booking_id',
        // 'classes.class_name as booking_name',
        // // 'trainers.first_name as trainer_name',
        // 'trainers.trainer_id as trainer_id'
      ])
    .where('classes.trainer_id', '=', trainer_id)
    .union(
      db.selectFrom('personal_training_sessions')
        .innerJoin('members', 'personal_training_sessions.member_id', 'members.member_id')
        .select([
          sql<Date>`personal_training_sessions.start_time`.as('u_start_time'),
          sql<Date>`personal_training_sessions.end_time`.as('u_end_time'),
          sql<number>`personal_training_sessions.member_id`.as('booking_id'),
         sql<string>`members.first_name`.as('booking_name'),
         sql<number>`personal_training_sessions.trainer_id`.as('trainer_id'),
         sql<number>`1`.as("is_personal_training")
        //   sql<Date>'personal_training_sessions.end_time as u_end_time',
        //   'personal_training_sessions.session_id as booking_id',
        //   'trainers.trainer_id as trainer_id'
        ])
        .where('trainer_id',"=", trainer_id)
    )
    .orderBy('u_start_time','asc')
    .execute();

    console.log("Booked slots: ", bookedSlots)
  

    const slots:TrainerTimeSlot[] = [];
    for (const slot of bookedSlots){
        const start_day = slot.u_start_time.getDate();
        const day = convertDateToDay(slot.u_start_time);
        console.log("day: ", day)
        console.log("start_day: ", start_day)
        const ts:TrainerTimeSlot = {
            start_time: slot.u_start_time,
            end_time: slot.u_end_time,
            trainer_id: slot.trainer_id,
            subject_id: slot.booking_id,
            type: slot.is_personal_training ? "session" : "class",
            subject_name: slot.booking_name,
            day: day,
            date: start_day
        }
        console.log("ts: ", ts)
        console.table(ts)
        slots.push(
            ts
        )
        console.log("DAY OF MONTH:", slot.u_start_time.getDate())
        console.log("Slot: ", slot)
        console.table(slot)
        }
    return slots;
    }
  






export async function getTrainerBookedSlots(
    trainer_id: number, start_date: Date, end_date: Date
): Promise<TimeSlot[]> {
    //get union of trainer's classes and personal training sessions
    const bookedSlots = await db.selectFrom("classes")
        .innerJoin("personal_training_sessions", "classes.trainer_id", "personal_training_sessions.trainer_id")
        .where((q) => q.and([
            q("classes.trainer_id", "=", trainer_id),
            q("start_time", ">=", start_date),
            q("end_time", "<=", end_date),
        ]))
        .orderBy("start_time")
        .select(["start_time", "end_time"])
        .execute()
    return bookedSlots;
}

export async function getTrainerAvailability(
    trainer_id: number, start_date: Date, end_date: Date
): Promise<TimeSlot[]> {
    //for each interval in the trainer's work hours, check when the trainer is booked, and split the interval accordingly. ie 
    //work hours: 8am-12pm, 1pm-5pm
    //booked: 8am-10am, 2pm-3pm
    //available: 10am-12pm, 12pm-1pm, 3pm-5pm

    const workIntervals = await getTrainerWorkHours(trainer_id, start_date, end_date);
    const bookedSlots = await getTrainerBookedSlots(trainer_id, start_date, end_date);
    const availability:TimeSlot[] = [];
    
    for (const interval of workIntervals) {
        let start = interval.start_time;
        for (const slot of bookedSlots) {
            if (slot.start_time > start) {
                availability.push({start_time: start, end_time: slot.start_time});
            }
            start = slot.end_time;
        }
        if (start < interval.end_time) {
            availability.push({start_time: start, end_time: interval.end_time});
        }
    }
    return availability;

}


//Update trainer availability by removing timeslots. 
export async function setTimeIntervalUnavailable(
    trainer_id: number, start_time: Date, end_time: Date
): Promise<DeleteResult[]> {
    //remove any existing availability for the trainer in the specified time interval, if 
    //any classes or personal training sessions are scheduled during that time
    //throw an error
    const workIntervals = await getTrainerWorkHours(trainer_id, start_time, end_time);
    if (workIntervals.length > 0) {
        throw new Error("Trainer is scheduled for a class or personal training session during this time");
    }
    const res = await db
        .deleteFrom("trainer_availability")
        .where((q) => q.or([
            q("trainer_id", "=", trainer_id),
            q("start_time", ">=", start_time).and("start_time", "<=", end_time),
            q("end_time", "<=", end_time).and("end_time", ">=", start_time)
        ]))
        .execute()
    return res
}

export type TrainerAvailabilitySlot = {
  start_time: Date, 
  ts_id:number,
  end_time: Date, 
  trainer_id:number, 
  day:string,
  date:number,

}

export async function removeTrainerTimeSlot(
  {trainer_id, time_slot_id, start_time, end_time}:{trainer_id:number, time_slot_id:number, start_time:Date, end_time:Date}
): Promise<DeleteResult[]>{
  
    //remove any existing availability for the trainer in the specified time interval, if 
    //any classes or personal training sessions are scheduled during that time
    //throw an error
    
    const workIntervals = await getTrainerWorkHours(trainer_id, start_time, end_time);
    if (workIntervals.length > 0) {
        throw new Error("Trainer is scheduled for a class or personal training session during this time");
    }
    const res = await db
        .deleteFrom("trainer_availability")
        .where("availability_id","=",time_slot_id)
        .execute()
    return res
}

//================================== Creating/merging availabilities ==========================

export async function addTrainerAvailability(ta: newTrainerAvailability): Promise<number | undefined> {
    if (!ta.trainer_id) {
        throw new Error("Trainer ID must be provided");
    }
    const startTime = new Date(ta.start_time);
    const endTime = new Date(ta.end_time);

    // Start transaction for atomic operations
    return db.transaction().execute(async trx => {
        // Check and merge overlaps
        if (!ta.trainer_id){
            throw new Error("Trainer ID must be provided");
        }
        await mergeOverlaps(trx, ta.trainer_id, startTime, endTime);
        const newAvailabilityId = await insertNewAvailability(trx, ta.trainer_id, startTime, endTime);
        return newAvailabilityId;
    });
}

async function mergeOverlaps(trx:Transaction<DB>, trainerId: number, startTime: Date, endTime: Date): Promise<void> {
    const overlappingAvailabilities: trainerAvailability[] = await trx
        .selectFrom('trainer_availability')
        .where((q)=>q.and([
            q("trainer_id", "=", trainerId),
            q("end_time", ">=", startTime),
            q("start_time", "<=", endTime)
        ]))
        .selectAll()
        .orderBy("start_time")
        .execute()

    let mergedStartTime = startTime;
    let mergedEndTime = endTime;

    for (const avail of overlappingAvailabilities) {
        if (avail.start_time < mergedStartTime) {
            mergedStartTime = avail.start_time;
        }
        if (avail.end_time > mergedEndTime) {
            mergedEndTime = avail.end_time;
        }
    }

    await trx.deleteFrom('trainer_availability')
        .where((q)=>q.and([
            q("trainer_id", "=", trainerId),
            q("end_time", ">=", startTime),
            q("start_time", "<=", endTime)
        ]))
        .execute();

    // Insert the merged availability block
    await trx.insertInto('trainer_availability')
        .values({
            trainer_id: trainerId,
            start_time: mergedStartTime,
            end_time: mergedEndTime
        })
        .execute();
}

async function insertNewAvailability(trx:Transaction<DB>, trainerId: number, startTime: Date, endTime: Date): Promise<number | undefined> {
    // Check if there is still a gap to fill
    const existingCount = await trx.selectFrom('trainer_availability')
        .where('trainer_id', '=', trainerId)
        .where('start_time', '<=', startTime)
        .where('end_time', '>=', endTime)
        .select((q) => q.fn.count<number>('availability_id').as('count'))
        .executeTakeFirst();

    if (existingCount && existingCount.count > 0) {
        // The new timeslot is completely covered by an existing one
        return undefined;
    } else {
        // Insert the new availability block, possibly adjusted
        const result = await trx.insertInto('trainer_availability')
            .values({
                trainer_id: trainerId,
                start_time: startTime,
                end_time: endTime
            })
            .returning('availability_id')
            .executeTakeFirstOrThrow();
        return result.availability_id
    }
}
//================================== END ===========================================



export async function updateTrainerAvailability(
    partialAvailability: trainerAvailabilityUpdate
): Promise<BigInt | undefined> {
    if (!partialAvailability.availability_id) {
        throw new Error("availability_id must be provided");
    }
    const res = await db
        .updateTable("trainer_availability")
        .set(partialAvailability)
        .where("trainer_availability.availability_id", "=", partialAvailability.availability_id)
        .executeTakeFirstOrThrow()
    return res.numUpdatedRows;
}



//ToDo: Need to check availability first 
// add personal training session to trainer
export async function createPersonalTrainingSession(
    pts: newPersonalTrainingSession
): Promise<BigInt | undefined> {
    if(!pts.trainer_id || !pts.end_time || !pts.start_time || !pts.member_id){
      throw error("trainer ID, start and end time must be included");
      
  }
    const isAvailable = trainerIsAvailable(pts.trainer_id, new Date(pts.start_time), new Date( pts.end_time ));
    if(!isAvailable){
    throw error("Trainer not available")
  }
    const res = await db
        .insertInto("personal_training_sessions")
        .values(pts)
        .executeTakeFirstOrThrow()
    return res.insertId;
}

export async function deletePTS(pts: newPersonalTrainingSession): Promise<void> {
    if (!pts.member_id || !pts.trainer_id || !pts.start_time || !pts.end_time) {
        throw new Error("member_id, trainer_id, start_time, and end_time must be provided");
    }
    const mid = pts.member_id;
    const tid = pts.trainer_id;
    const st = new Date(pts.start_time);
    const et = new Date(pts.end_time);
    await db.deleteFrom("personal_training_sessions")
        .where((q) => q.and([
            q("member_id", "=", mid),
            q("trainer_id", "=", tid),
            q("start_time", "=", st),
            q("end_time", "=", et)
        ])
        )   
        .execute();
}


export async function trainerIsAvailable(
    trainer_id: number, start_time: Date, end_time: Date
): Promise<boolean> {
    try{
    const res:trainerAvailability = await db
    .selectFrom("trainer_availability")
    .where("trainer_availability.trainer_id", "=", trainer_id)
    .where((q)=> q.and([
        q("trainer_availability.start_time", "<=", start_time),
        q("trainer_availability.end_time", ">=", end_time)
    ]))
    .selectAll()
    .executeTakeFirstOrThrow()
    return true;
}catch(e){
    return false;
}

}

export async function createClass(c: newClass): Promise<BigInt | undefined> {
    if (!c.trainer_id) {
        throw new Error("Trainer ID must be provided");
    }

    const startTime = new Date(c.start_time);
    const endTime = new Date(c.end_time);

    // Start transaction for atomic operations
    return db.transaction().execute(async trx => {
        // Check and merge overlaps
        if (!c.trainer_id){
            throw new Error("Trainer ID must be provided");
        }
        if (!trainerIsAvailable(c.trainer_id, startTime, endTime)) {
            throw new Error("Trainer is not available during this time");
        }
        //ToDo: Check if room is available
        const res = await db
            .insertInto("classes")    
            .values(c)
            .executeTakeFirstOrThrow()
        return res.insertId;
        // Insert new availability if it does not completely overlap existing ones
    });
}

export async function updateClass(
    partialClass: classUpdate
): Promise<BigInt | undefined> {
    if (!partialClass.class_id) {
        throw new Error("class_id must be provided");
    }
    const res = await db
        .updateTable("classes")
        .set(partialClass)
        .where("classes.class_id", "=", partialClass.class_id)
        .executeTakeFirstOrThrow()
    return res.numUpdatedRows;
}



export async function addRoutine(
  routine: newExcerciseRoutine
) : Promise<BigInt | undefined> {
  const res = await db
    .insertInto("excercise_routine")
    .values(routine)
    .executeTakeFirstOrThrow()
  return res.insertId;
}


export async function assignMemberRoutine(
  {routineId, memberId}:{routineId:number, memberId:number}
) : Promise<BigInt | undefined> {
  console.log("ASSIGNING ", routineId," to :",memberId )
  const res = await db
    .insertInto("member_routines")
    .values([routineId,memberId])
    .executeTakeFirstOrThrow()
  return res.insertId
}
