'use server'

import { member, trainer, classRegistration, classRegistrationUpdate, newClassRegistration, classUpdate,class_} from "@/db/types";
import { db } from "@/db/db"

export type ClassRegistrationWithNames =  {class_id: number; class_name: string; room_id: number | null; trainer_id: number | null;first_name:string; start_time: Date; end_time: Date; capacity: number; }

export async function createClassRegistration(classRegistration: newClassRegistration): Promise<BigInt | undefined> {
    if(!classRegistration.member_id || !classRegistration.class_id) {
        throw new Error("Member ID and Class ID are required");
    }
    const res = await db.insertInto("class_registrations").values(classRegistration).executeTakeFirstOrThrow();
    return res.insertId;
}


export async function getAllClasses(): Promise<class_[]> {
    const res:class_[] = await db.selectFrom("classes").selectAll().execute();
    return res;
}

export async function getClassesByTrainerId(trainerId: number): Promise<class_[]> {
    const res:class_[] = await db
        .selectFrom("classes")
        .where("trainer_id", "=", trainerId)
        .selectAll()
        .execute();
    return res;
}

export async function deleteClassRegistration(ncr:newClassRegistration): Promise<void> {
    if(!ncr.member_id || !ncr.class_id) {
        throw new Error("Member ID and Class ID are required");
    }
    const memId = ncr.member_id;
    const classId = ncr.class_id;
    await db.deleteFrom("class_registrations")
        .where( (q)=> q.and([
        q("member_id", "=", memId),
        q("class_id", "=",classId)
    ]))
        .execute();
}



export async function getClassesWithTrainerName(memberId: number): Promise<{ class_id: number; class_name: string; room_id: number | null; trainer_id: number | null; first_name: string; start_time: Date; end_time: Date; capacity: number; }[]> {
    const res = await db
        .selectFrom('classes')
        .innerJoin('trainers', 'classes.trainer_id', 'trainers.trainer_id')
        .select([
            'classes.class_id', 
            'classes.class_name', 
            'classes.room_id', 
            'classes.trainer_id', 
            'classes.start_time', 
            'classes.end_time', 
            'classes.capacity', 
            'trainers.first_name'
        ])
        .where(({eb, and, not, exists, selectFrom }) => and([
            eb('classes.start_time','>=',new Date()),
            not(exists(
                db.selectFrom("class_registrations")
                    .select("class_id")
                    .where("member_id", "=", memberId)
                    //@ts-ignore
                    .whereRef("class_id", "=", "classes.class_id")
            ))
        ]))
        .execute();

    return res as { class_id: number; class_name: string; room_id: number | null; trainer_id: number | null; first_name: string; start_time: Date; end_time: Date; capacity: number; }[];
}

export async function getClassesWithTrainerNameAll(): Promise<{ class_id: number; class_name: string; room_id: number | null; trainer_id: number | null; first_name: string; start_time: Date; end_time: Date; capacity: number; }[]> {
    const res = await db
        .selectFrom('classes')
        .innerJoin('trainers', 'classes.trainer_id', 'trainers.trainer_id')
        .select([
            'classes.class_id', 
            'classes.class_name', 
            'classes.room_id', 
            'classes.trainer_id', 
            'classes.start_time', 
            'classes.end_time', 
            'classes.capacity', 
            'trainers.first_name'
        ])
        .execute();

    return res as { class_id: number; class_name: string; room_id: number | null; trainer_id: number | null; first_name: string; start_time: Date; end_time: Date; capacity: number; }[];
}

export async function getRegisteredClassesWithTrainerName(memberId: number): Promise<{ class_id: number; class_name: string; room_id: number | null; trainer_id: number | null; first_name: string; start_time: Date; end_time: Date; capacity: number; }[]> {
    const res = await db
        .selectFrom('classes')
        .innerJoin('trainers', 'classes.trainer_id', 'trainers.trainer_id')
        .select([
            'classes.class_id', 
            'classes.class_name', 
            'classes.room_id', 
            'classes.trainer_id', 
            'classes.start_time', 
            'classes.end_time', 
            'classes.capacity', 
            'trainers.first_name'
        ])
        .where(({eb, and, exists}) => and([
            eb('classes.start_time','>=',new Date()),
            exists(
                db.selectFrom("class_registrations")
                    .select("class_id")
                    .where("member_id", "=", memberId)
                    //@ts-ignore
                    .whereRef("class_id", "=", "classes.class_id")
            )
        ]))
        .execute();

    return res as { class_id: number; class_name: string; room_id: number | null; trainer_id: number | null; first_name: string; start_time: Date; end_time: Date; capacity: number; }[];
}


//update class schedule and or trainer, not registration
export async function updateClassSchedule(c:classUpdate){
    if(!c.class_id){
        throw new Error("Class ID is required");
    }
    console.log("info: ", c)
    console.table(c)
    const res = await db.updateTable("classes").set(c).where("class_id", "=", c.class_id).execute();
}
