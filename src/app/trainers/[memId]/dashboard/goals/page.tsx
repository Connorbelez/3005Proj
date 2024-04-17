
import dynamic from 'next/dynamic'

const FitnessGoalsTable = dynamic(() => import('../../../components/memberGoalUpdateForm'))
const AchievementTable = dynamic(() => import('../../../components/MemberAchievementTable'))
const HealthMetricsTable = dynamic(() => import('../../../components/memberHealthUpdateForm'))
const AddMetricDialog = dynamic(() => import('../../../components/CreateMetricModal'))
const AddGoalDialog = dynamic(() => import('../../../components/CreateGoalModal'))
import { fitnessGoal, fitnessAchievement } from "@/db/types"
import { db } from "@/db/db"
import { getClassesWithTrainerName } from "@/app/actions/classes"
import { getMemberById, getMemberFitnessGoals, getMemberFitnessAchievements, getAllMemberHealthMetrics} from "@/app/actions/members"
export type TimeSlot = {
  start_time: Date;
  end_time: Date;
  isSelected: boolean;
  ts_id: number;
  day:string;
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
    const ids =[1,2,3]
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
   

  
export default async function Page({ params }: { params: { memId: number } }) {
    const member = await getMemberById(params.memId)
    const memberGoals:fitnessGoal[] = await getMemberFitnessGoals(params.memId)
    const memberAchievements:fitnessAchievement[] = await getMemberFitnessAchievements(params.memId)
    const memberHealthMetrics = await getAllMemberHealthMetrics(params.memId)
    const memberClasses = await db.selectFrom("class_registrations").where("member_id", "=", params.memId).select("class_id").execute()
    const groupClassesWithTrainerName = await getClassesWithTrainerName();
    const timeSlots = generateTestData(15, 5);
    return (
        <div className="flex mt-16">
            <div className="mx-auto ">
              Fitness Goals
            <FitnessGoalsTable goals={memberGoals}  />
            <AddGoalDialog memberId={params.memId} />
            <h4>
              Member Achievements 
            </h4>
            <AchievementTable achievements={memberAchievements}/>
            <h4>
              Member Health Metrics 
            </h4>
            <HealthMetricsTable metrics={memberHealthMetrics}/>
            <AddMetricDialog memberId={params.memId}/>
           

            </div> 
        </div>
    )
}
