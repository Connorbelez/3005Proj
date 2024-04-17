import { fitnessAchievement, fitnessGoal } from "@/db/types"
import dynamic from 'next/dynamic'

const FitnessGoalsTable = dynamic(() => import('../../../components/memberGoalUpdateForm'))
import { getMemberById, getMemberFitnessGoals, getMemberFitnessAchievements, getAllMemberHealthMetrics} from "@/app/actions/members"
import {db} from "@/db/db"
import CreateGoalModal  from "../../../components/CreateGoalModal"
import { getClassesWithTrainerName } from "@/app/actions/classes"
// import  GCSlot from "../../../components/GCSlot"
// import  RegisteredClassTable  from "../../../components/RegisteredClasses"
// import PTTable from "@/app/members/components/PTSlot"
const PTTable = dynamic(() => import('../../../components/PTSlot'))
const GCSlot = dynamic(() => import('../../../components/GCSlot'))
const RegisteredClassTable = dynamic(() => import('../../../components/RegisteredClasses'))

type TimeSlot = {
  start_time: Date;
  end_time: Date;
  isSelected: boolean;
  ts_id: number;
  day:string;
  trainer_id: number;
  trainer_name: string;
}

function convertDateToDay(date: Date): string {
    console.log("Converting date to day", date)
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    console.log("Converted date to day", date)
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
    const memberClasses = await db.selectFrom("class_registrations").where("member_id", "=", params.memId).select("class_id").execute()
    const groupClassesWithTrainerName = await getClassesWithTrainerName();
    const timeSlots = generateTestData(15, 5);
    console.log("finished all")
    return (
        <div className="flex mt-16">
            <div className="mx-auto ">
            <h4>
              Book a Time slot
            </h4>
            <PTTable timeSlots={timeSlots} memId={params.memId}/>
            <h4>
              Register for a Class
            </h4>
            <GCSlot gcs={ groupClassesWithTrainerName } registered={memberClasses} memId={params.memId}/>
            <h4>
              Registered Classes 
            </h4>
            <RegisteredClassTable gcs={ groupClassesWithTrainerName } registered={memberClasses} memId={params.memId}/>


            </div> 
        </div>
    )
}
