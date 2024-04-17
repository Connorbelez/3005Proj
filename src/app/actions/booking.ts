'use server'

import {class_, classUpdate, booking, bookingUpdate, newBooking, room, roomUpdate, newClass} from "@/db/types";
import { db } from "@/db/db"
import { trainerIsAvailable } from "./trainers";

export async function createBooking(c:newClass) {
    const start = c.start_time as Date;
    const end = c.end_time as Date;
    const isTrainerAvail = await trainerIsAvailable(c.trainer_id as number, start, end)
    if(!isTrainerAvail){
        throw new Error("Trainer is not available")
    }
    const cres = await db.insertInto("classes").values(c).executeTakeFirstOrThrow();
}
