'use server'

import { equipment, maintenance_logs, equipmentItem, maintenanceLog, maintenanceLogUpdate, equipmentItemUpdate, newMaintenanceLog} from "@/db/types";
import { db } from "@/db/db"
import { Equipment } from "../admin/[memId]/components/EQTableWrapper"; 
import { sql } from 'kysely';


//get all equipment
export async function getFunctioningEquipment(){
    const res = await db.selectFrom("equipment").where("operational","=",true).selectAll().execute();
}

//Get equipment with the most recent maintenance_date
export async function getEquipmentWithMaintenance() {
  const recentMaintenance = db
    .selectFrom('maintenance_logs')
    .select([
      'equipment_id',
      'log_id',
      'maintenance_date',
      'maintenance_description',
    ])
    .distinctOn('equipment_id')
    .orderBy('equipment_id')
    .orderBy('maintenance_date', 'desc')
    .as('recent_maintenance');

  const res = await db
    .selectFrom('equipment')
    .innerJoin(recentMaintenance, 'recent_maintenance.equipment_id', 'equipment.equipment_id')
    .select([
      'equipment.equipment_id',
      'equipment.equipment_name',
      'equipment.equipment_type',
      'equipment.operational',
      'equipment.room_id',
      'recent_maintenance.log_id as recent_log_id',
      'recent_maintenance.maintenance_date as recent_maintenance_date',
      'recent_maintenance.maintenance_description as recent_maintenance_description',
    ])
    .execute();
    const eqs:Equipment[] = []
    res.forEach((eq)=>{
        const newEq:Equipment = {
            equipment_id: eq.equipment_id,
            equipment_name: eq.equipment_name,
            equipment_type: eq.equipment_type,
            operational: eq.operational,
            room_id: eq.room_id,
            last_maintenance: eq.recent_maintenance_date
        }
        console.log(newEq)
        eqs.push(newEq)
    })
  return eqs; }

//Do maintenance on equipment, update operational status and add maintenance log
export async function doMaintenance({equipmentId}:{equipmentId:number}){
    //update equipment operational status
    const eqUpdate: equipmentItemUpdate = {
        equipment_id: equipmentId,
        operational: true
    }
    const newMlog: newMaintenanceLog = {
        equipment_id: equipmentId,
        maintenance_date: new Date(),
        maintenance_description: "Fixed"
    }
    //add maintenance log
    //transaction to update equipment and add maintenance log
    try{
    db.transaction().execute(async (trx)=>{
        const res = await db.insertInto("maintenance_logs").values(newMlog).executeTakeFirstOrThrow();

        const res2 = await db.updateTable("equipment").set(eqUpdate).where("equipment_id","=",equipmentId).executeTakeFirstOrThrow();
    })
}catch(error){
    console.error("ERROR MAINTAINING ", equipmentId)
    console.error("ERROR: ",error)
}

}
