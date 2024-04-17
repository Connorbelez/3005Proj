
"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createMemberFitnessGoal, updateMemberFitnessGoals } from "@/app/actions/members";
import { newFitnessGoal, newTrainerAvailability } from "@/db/types";
import { addTrainerAvailability } from "@/app/actions/trainers";
import DateTimePicker from 'react-datetime-picker';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];
export default function AddAvailabilityModal({memberId} : {memberId:number}) {
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
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add New Goal</Button>
      </DialogTrigger>
      <DialogContent className="w-full h-full p-8">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Availability Slot</DialogTitle>
            <DialogDescription>
              enter a new time slot
            </DialogDescription>
          </DialogHeader>
          <div>

                <Label htmlFor="startDate" className="text-right">
                    Start Day
                </Label>
                  <DateTimePicker onChange={setStartTime} value={startTime} />
          </div>
          <div>
                <Label htmlFor="endDate" className="text-right">
                    End Day
                </Label>
                  <DateTimePicker onChange={setEndTime} value={endTime} />

          </div>
          <DialogFooter>
            <Button type="submit">Save Time Slot</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
