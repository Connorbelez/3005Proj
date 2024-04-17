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
import { getClassesWithTrainerName, getRegisteredClassesWithTrainerName } from "@/app/actions/classes"
import GCSlot from "../components/GCSlot"
import RegisteredClassTable from "../components/RegisteredClasses"
import PTRegistered from "../components/PTRegistered"
import CreateER from "./components/CreateER"
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

const generateTestData = (numDays: number, slotsPerDay: number): TimeSlot[] => {
  const data: TimeSlot[] = [];
  const baseDate = new Date(); // Using today as the base date
  const hours = [9, 11, 13, 15, 17]; // Different starting hours for slots
  const ids = [1, 2, 3]
  const names = ['John Doe', 'Jane Doe', 'Alice Doe']
  for (let day = 0; day < numDays; day++) {
    for (let slot = 0; slot < slotsPerDay; slot++) {
      const hourIndex = slot % hours.length;
      const startHour = hours[hourIndex];

      const startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + day, startHour, 0, 0);
      const endDate = new Date(startDate);
      endDate.setHours(startHour + 1); // Setting end time one hour after start time

      data.push({
        start_time: startDate,
        end_time: endDate,
        isSelected: false,
        ts_id: data.length,
        day: convertDateToDay(startDate),
        trainer_id: ids[slot % ids.length],
        trainer_name: names[slot % names.length]
      });
    }
  }

  return data;
};



import { DataTable } from '@/app/trainers/components/DataTable';
import TableWrapper from "./components/dataTableWrapper"
import { member as Member } from "@/db/types";
// import useMemberColumns from '../components/membersColumns';
import { getAllMembers } from '@/app/actions/members';
import TrainerPTSchedule from "@/app/trainers/[memId]/components/TrainerSchedule"
import WorkHours from "./components/TrainerWorkHours"
import { getTrainerBookedSlotsForTrainer, getTrainerPTS, getTrainerWorkHours, TrainerAvailabilitySlot, TrainerTimeSlot } from "@/app/actions/trainers"
import SlotPicker from "./components/SlotPicker"
import ERTableWrapper from "./components/ERTableWrapper"
import AddAvailability from "./components/createAvailabilityModal"
// Simulating an API call
const fetchMembers = async (): Promise<Member[]> => {
  const mems: Member[] = await getAllMembers();
  return mems;
};

export default async function Page({ params }: { params: { memId: number } }) {
  const members = await fetchMembers();
  const today = new Date();
  const oneWeekFromToday = new Date(today);
  oneWeekFromToday.setDate(oneWeekFromToday.getDate() + 7);

  const routines = await db.selectFrom("excercise_routine").selectAll().execute()
  const trainerSched: TrainerTimeSlot[] = await getTrainerBookedSlotsForTrainer(params.memId, today, oneWeekFromToday);
  const trainerWorkHours: TrainerAvailabilitySlot[] = await getTrainerWorkHours(params.memId, today, oneWeekFromToday);
  //Conver the sched to time slots

  // const memberColumns = useMemberColumns();
  return (
    <div className="flex flex-col space-y-8 space-x-8 items-center ">
      <div className="max-w-4xl flex flex-col space-y-8 items-center prose">
        <h1>
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
        <SlotPicker memberId={params.memId} />
        <h2>
          Routine Management
        </h2>
        <ERTableWrapper data={routines}/>
        <h2>
          Create New Routine
        </h2>
        <CreateER />
      </div>
    </div>
    // <DataTable columns={memberColumns} data={members} />
  )


}
