"use client"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMemberFitnessGoal, updateMemberFitnessGoals } from "@/app/actions/members";
import { newFitnessGoal, newTrainerAvailability } from "@/db/types";
import { addTrainerAvailability } from "@/app/actions/trainers";
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
export default function SlotPicker({memberId}:{memberId:number}){
  // State to manage input values
  // const [category, setCategory] = useState("");
  // const [number, setNumber] = useState("");
  // const [endDate,setDate] = useState("");
  const [startTime, setStartTime] = useState<Value>(new Date());
  const [endTime, setEndTime] = useState<Value>(new Date());


  // Handle form submission
  const handleSubmit = (event:any) => {
    event.preventDefault();  // Prevent the form from submitting in the traditional way
    console.log("Adding Goal:", {startTime, endTime});

    const newTimeSlot:newTrainerAvailability = {
      start_time:new Date(startTime?.toString() as string),
      end_time:new Date(endTime?.toString() as string),
      trainer_id:memberId
    }
    //send to db
    // createMemberFitnessGoal(newGoal);
    addTrainerAvailability(newTimeSlot).then((data)=>{
      console.log("ADDED AVAIL!", data)
    })



    // Here you would typically update some state or make an API call to add the new goal
    // For demonstration, just logging to the console

    // Reset fields
      setEndTime(new Date())
      setStartTime(new Date())
    // setCategory("");
    // setNumber("");
    // setDate("");

    // Close dialog, implement this if you have control over the Dialog's open state
    // closeDialog();
    }

  return(
   <form onSubmit={handleSubmit}>
          <div>
                  <DateTimePicker onChange={setStartTime} value={startTime} />
          </div>
          <div>
                  <DateTimePicker onChange={setEndTime} value={endTime} />

          </div>
            <Button type="submit">Save Time Slot</Button>
        </form>

  )
}
