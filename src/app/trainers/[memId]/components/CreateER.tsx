"use client"
import { addRoutine } from "@/app/actions/trainers"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { newExcerciseRoutine } from "@/db/types"
import { Input } from "@/components/ui/input"

const RoutineSchema = z.object({
  routine_name: z.string().min(1, {
    message: "Routine name is required.",
  }),
  routine_description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  routine_type: z.string().min(1, {
    message: "Routine type is required.",
  }),
  routine: z.string().min(1, {
    message: "Routine JSON is required.",
  }),
  difficulty_level: z.string().min(1, {
    message: "Difficulty level must be at least 1",
  }),
})

export default function ExerciseRoutineForm() {
  const form = useForm<z.infer<typeof RoutineSchema>>({
    resolver: zodResolver(RoutineSchema),
  })

  function onSubmit(data: z.infer<typeof RoutineSchema>) {
    toast({
      title: "Routine submitted successfully",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
    const routine:newExcerciseRoutine = {
      routine_name:data.routine_name,
      routine_description:data.routine_description, 
      routine_type:data.routine_type,
      routine:data.routine,
      difficulty_level:data.difficulty_level.toString()
    }
    addRoutine(routine)
    //newRoutine
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="routine_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Routine Name</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter the name of the routine"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="routine_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Routine Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the routine"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="routine_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Routine Type</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter routine type (e.g., cardio, weightlifting)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="routine"
          render={({ field }) => (
            <FormItem>
              <FormLabel>JSON Routine</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="JSON ROUTINE"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="difficulty_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty Level</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter difficulty level (e.g., 1, 2, 3)"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Specify the difficulty level from 1 to 10.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
