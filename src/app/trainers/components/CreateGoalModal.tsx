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
import { newFitnessGoal } from "@/db/types";

export default function AddGoalDialog({memberId} : {memberId:number}) {
  // State to manage input values
  const [category, setCategory] = useState("");
  const [number, setNumber] = useState("");
  const [endDate,setDate] = useState("");


  // Handle form submission
  const handleSubmit = (event:any) => {
    event.preventDefault();  // Prevent the form from submitting in the traditional way
    console.log("Adding Goal:", { category, number, endDate});

    //send to db
    const newGoal:newFitnessGoal = {
        goal_type: category,
        target_value: number,
        member_id: memberId,
        start_date: new Date(),
        end_date: new Date(endDate)
        }
    createMemberFitnessGoal(newGoal);

    // Here you would typically update some state or make an API call to add the new goal
    // For demonstration, just logging to the console

    // Reset fields
    setCategory("");
    setNumber("");
    setDate("");

    // Close dialog, implement this if you have control over the Dialog's open state
    // closeDialog();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add New Goal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Goal</DialogTitle>
            <DialogDescription>
              Enter the details of the new goal.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                Target Number
              </Label>
              <Input id="number" type="number" value={number} onChange={(e) => setNumber(e.target.value)} className="col-span-3" />
            </div>
          </div>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                    End Date
                </Label>
                <Input id="endDate" type="date" value={endDate} onChange={(e) => setDate(e.target.value)} className="col-span-3" />
                </div>
            </div>

          <DialogFooter>
            <Button type="submit">Save Goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
