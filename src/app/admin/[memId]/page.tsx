import { fitnessAchievement, fitnessGoal } from "@/db/types"
import FitnessGoalsTable from "../components/memberGoalUpdateForm"
import AchievementTable from "../components/MemberAchievementTable"
import { ProfileForm } from "../components/memberUpdateForm"
import HealthMetricsTable from "../components/memberHealthUpdateForm"
import AddMetricDialog from "../components/CreateMetricModal"
import { getMemberById, getMemberFitnessGoals, getMemberFitnessAchievements, getAllMemberHealthMetrics, getRegisteredSessionsWithTrainerName } from "@/app/actions/members"
import PTTable from "@/app/members/components/PTSlot"
import { db } from "@/db/db"
import CreateGoalModal from "../components/CreateGoalModal"
import { getClassesWithTrainerNameAll, getRegisteredClassesWithTrainerName } from "@/app/actions/classes"
import GCSlot from "../components/GCSlot"
import RegisteredClassTable from "../components/RegisteredClasses"
import PTRegistered from "../components/PTRegistered"
import EQTableWrapper from "./components/EQTableWrapper"
import NewClassBooking from "./components/NewClassBooking"
// import { getTrainerAvailability } from "@/app/api/trainers/schedule"

export type TimeSlot = {
  start_time: Date;
  end_time: Date;
  isSelected: boolean;
  ts_id: number;
  day: string;
  trainer_id: number;
  trainer_name: string;
}

function convertDateToDay(date: Date): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}


import GCTable from "./components/GCTable"
import { member as Member } from "@/db/types";
import { getAllMembers } from '@/app/actions/members';
import { getTrainerBookedSlotsForTrainer, getTrainerPTS, getTrainerWorkHours, TrainerAvailabilitySlot, TrainerTimeSlot } from "@/app/actions/trainers"
import { getEquipmentWithMaintenance } from "@/app/actions/equipment"
import { Equipment } from "./components/EQTableWrapper"

export default async function Page({ params }: { params: { memId: number } }) {
  const today = new Date();
  const oneWeekFromToday = new Date(today);
  oneWeekFromToday.setDate(oneWeekFromToday.getDate() + 7);
  const equipment:Equipment[] = await getEquipmentWithMaintenance();
  const groupClasses = await getClassesWithTrainerNameAll();
  console.log("Group Classes: ", groupClasses)
  const bills = await db.selectFrom("billing").select([
    "billing.amount",
    "billing.bill_id",
    "billing.member_id",
    "billing.payment_date",
    "billing.service_type",
    "billing.status"
  ]).execute();
  //Conver the sched to time slots

  // const memberColumns = useMemberColumns();
  return (
    <div className="flex flex-col space-y-8 space-x-8 items-center ">
      <div className="max-w-4xl flex flex-col space-y-8 items-center prose">
        <h2>
          Equipment Maintenance
        </h2>
        <EQTableWrapper data={equipment} />
        <h2>
          GC Schedule
        </h2>
        <GCTable  gcs={groupClasses}  memId={params.memId} />
        
        <h2>
          Room Booking
        </h2>
        <NewClassBooking />

        <div className="mx-auto prose">
          <h1>
            Billing
          </h1>
          {bills.map((bill) => {
            return (
<div key={bill.bill_id} className="flex flex-row space-x-4 bg-white shadow-sm rounded-lg p-4">
  <div className="flex-1">
    <p className="font-bold text-lg">
      Amount: <span className="font-normal text-gray-600">{bill.amount}</span>
    </p>
    <p className="font-bold text-lg">
      Member: <span className="font-normal text-gray-600">{bill.member_id}</span>
    </p>
    <p className="font-bold text-lg">
      Service Type: <span className="font-normal text-gray-600">{bill.service_type}</span>
    </p>
    <p className="font-bold text-lg">
      Status: <span className="font-normal text-gray-600">{bill.status}</span>
    </p>
  </div>
  <div className="flex-1">
    <p className="font-bold text-lg">
      Payment Date: <span className="font-normal text-gray-600">{(bill.payment_date as Date).getDate().toString()}</span>
    </p>
  </div>
</div>
            )
          })}
        </div>
        {/* <h1>
          TRAINER DASHBOARD
        </h1>
        <h2>
          Member Search
        </h2>
        <TableWrapper data={members} />
        <h1>
          Schedule Management
        </h1>
        <h2>
          Trainer Booked PT Sessions
        </h2>
        <TrainerPTSchedule memId={params.memId} timeSlots={trainerSched} />
        <h2>
          Open Schedule
        </h2>
        <WorkHours memId={params.memId} timeSlots={trainerWorkHours} />
        <h2>
          Add Availability
        </h2>
        <SlotPicker memberId={params.memId} /> */}

      </div>
    </div>
    // <DataTable columns={memberColumns} data={members} />
  )


}
