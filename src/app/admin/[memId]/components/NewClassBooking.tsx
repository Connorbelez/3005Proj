
"use client"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMemberFitnessGoal, updateMemberFitnessGoals } from "@/app/actions/members";
import { newBooking, newClass, newFitnessGoal, newTrainerAvailability } from "@/db/types";
import { addTrainerAvailability, createClass, trainerIsAvailable } from "@/app/actions/trainers";
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { createBooking } from "@/app/actions/booking";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
export default function SlotPicker(){
  // State to manage input values
  // const [category, setCategory] = useState("");
  // const [number, setNumber] = useState("");
  // const [endDate,setDate] = useState("");
  const [startTime, setStartTime] = useState<Value>(new Date());
  const [endTime, setEndTime] = useState<Value>(new Date());
  const [trainerId, setTrainerId] = useState(-1)
  const [roomId, setRoomId] = useState(-1)
  const [title, setClassTitle] = useState("")


  // Handle form submission
  const handleSubmit = (event:any) => {
    event.preventDefault();  // Prevent the form from submitting in the traditional way
    console.log("Adding Goal:", {startTime, endTime});
    //confirm trainer availability
    const start = new Date(startTime as Date)
    const end = new Date(endTime as Date)
    const isTrainerAvail = trainerIsAvailable(trainerId, start, end)
    if(!isTrainerAvail){
      console.log("Trainer is not available")
      return
    }
    const nc:newClass = {
      class_name: title,
      room_id: roomId,
      trainer_id: trainerId,
      start_time: start,
      end_time: end,
      capacity: 10
    }
    createBooking(nc).then((data)=>{  
      console.log("ADDED CLASS!", data)
    })
      setEndTime(new Date())
      setStartTime(new Date())

    }

  return(
   <form onSubmit={handleSubmit}>
          <div className={"flex flex-col items-center"}>

          <div>
            <Label>Class Title</Label>
            <Input type="text" placeholder="Enter Class Title" onChange={(e)=>setClassTitle(e.target.value)} />
          </div>
          <div>
            <Label>Room ID</Label>
            <Input type="text" placeholder="Enter Room ID" onChange={(e)=>setRoomId(parseInt(e.target.value))} />
          </div>
          <div>
            <Label>Trainer ID</Label>
            <Input type="text" placeholder="Enter Trainer ID" onChange={(e)=>setTrainerId(parseInt(e.target.value))} />
            </div>
          <div>
                  <DateTimePicker onChange={setStartTime} value={startTime} />
          </div>
          <div>
                  <DateTimePicker onChange={setEndTime} value={endTime} />

          </div>
            <Button type="submit">Save Time Slot</Button>
          </div>
        </form>

  )
}
