import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

import type { day_of_week } from "./enums";

export type admin = {
    admin_id: Generated<number>;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
};
export type billing = {
    bill_id: Generated<number>;
    member_id: number;
    service_type: string;
    amount: string;
    payment_date: Timestamp | null;
    status: string;
};
export type bookings = {
    booking_id: Generated<number>;
    class_id: number | null;
    room_id: number | null;
    start_time: Timestamp;
    end_time: Timestamp;
};
export type class_registrations = {
    registration_id: Generated<number>;
    member_id: number | null;
    class_id: number | null;
};
export type classes = {
    class_id: Generated<number>;
    class_name: string;
    room_id: number | null;
    trainer_id: number | null;
    start_time: Timestamp;
    end_time: Timestamp;
    capacity: number;
};
export type equipment = {
    equipment_id: Generated<number>;
    equipment_name: string;
    equipment_type: string;
    operational: boolean;
    room_id: number | null;
};
export type excercise_routine = {
    routine_id: Generated<number>;
    routine_name: string;
    routine_description: string | null;
    routine_type: string;
    routine: unknown;
    difficulty_level: string;
};
export type fitness_achievments = {
    achievement_id: Generated<number>;
    member_id: number | null;
    achievement_type: string;
    target_value: string;
    achievement_date: Timestamp | null;
};
export type fitness_goals = {
    goal_id: Generated<number>;
    member_id: number | null;
    goal_type: string;
    target_value: string;
    start_date: Timestamp;
    end_date: Timestamp | null;
};
export type health_metrics = {
    metric_id: Generated<number>;
    member_id: number | null;
    metric_type: string;
    value: string;
    date_recorded: Timestamp;
};
export type maintenance_logs = {
    log_id: Generated<number>;
    equipment_id: number | null;
    maintenance_date: Timestamp;
    maintenance_description: string | null;
};
export type member_routines = {
    member_routine_id: Generated<number>;
    member_id: number | null;
    routine_id: number | null;
};
export type members = {
    member_id: Generated<number>;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    join_date: Timestamp;
    member_status: string | null;
};
export type payroll = {
    payment_id: Generated<number>;
    employee_id: number;
    payment_type: string;
    amount: string;
    payment_date: Timestamp;
    period_start: Timestamp;
    period_end: Timestamp;
    description: string | null;
};
export type personal_training_sessions = {
    session_id: Generated<number>;
    member_id: number | null;
    trainer_id: number | null;
    start_time: Timestamp;
    end_time: Timestamp;
};
export type rooms = {
    room_id: Generated<number>;
    room_name: string;
    capacity: number;
};
export type trainer_availability = {
    availability_id: Generated<number>;
    trainer_id: number | null;
    start_time: Timestamp;
    end_time: Timestamp;
};
export type trainers = {
    trainer_id: Generated<number>;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    certification: string | null;
};
export type DB = {
    admin: admin;
    billing: billing;
    bookings: bookings;
    class_registrations: class_registrations;
    classes: classes;
    equipment: equipment;
    excercise_routine: excercise_routine;
    fitness_achievments: fitness_achievments;
    fitness_goals: fitness_goals;
    health_metrics: health_metrics;
    maintenance_logs: maintenance_logs;
    member_routines: member_routines;
    members: members;
    payroll: payroll;
    personal_training_sessions: personal_training_sessions;
    rooms: rooms;
    trainer_availability: trainer_availability;
    trainers: trainers;
};


import type { Insertable, Selectable, Updateable } from "kysely";
export type newClassRegistration = Insertable<class_registrations>;
export type classRegistration = Selectable<class_registrations>;
export type classRegistrationUpdate = Updateable<class_registrations>;

export type newBooking = Insertable<bookings>;
export type booking = Selectable<bookings>;
export type bookingUpdate = Updateable<bookings>;

export type newClass = Insertable<classes>;
export type class_ = Selectable<classes>;
export type classUpdate = Updateable<classes>;

export type newFitnessAchievement = Insertable<fitness_achievments>;
export type fitnessAchievement = Selectable<fitness_achievments>;
export type fitnessAchievementUpdate = Updateable<fitness_achievments>;

export type newFitnessGoal = Insertable<fitness_goals>;
export type fitnessGoal = Selectable<fitness_goals>;
export type fitnessGoalUpdate = Updateable<fitness_goals>;

export type newHealthMetric = Insertable<health_metrics>;
export type healthMetric = Selectable<health_metrics>;
export type healthMetricUpdate = Updateable<health_metrics>;

export type newMember = Insertable<members>;
export type member = Selectable<members>;
export type memberUpdate = Updateable<members>;

export type newRoom = Insertable<rooms>;
export type room = Selectable<rooms>;
export type roomUpdate = Updateable<rooms>;

export type newTrainerAvailability = Insertable<trainer_availability>;
export type trainerAvailability = Selectable<trainer_availability>;
export type trainerAvailabilityUpdate = Updateable<trainer_availability>;

export type newTrainer = Insertable<trainers>;
export type trainer = Selectable<trainers>;
export type trainerUpdate = Updateable<trainers>;

export type excerciseRoutine = Selectable<excercise_routine>;
export type excerciseRoutineUpdate = Updateable<excercise_routine>;
export type newExcerciseRoutine = Insertable<excercise_routine>;
export type memberRoutine = Selectable<member_routines>;
export type memberRoutineUpdate = Updateable<member_routines>;
export type newMemberRoutine = Insertable<member_routines>;

export type newPersonalTrainingSession = Insertable<personal_training_sessions>;
export type personalTrainingSession = Selectable<personal_training_sessions>;
export type personalTrainingSessionUpdate = Updateable<personal_training_sessions>;

export type maintenanceLog = Selectable<maintenance_logs>;
export type maintenanceLogUpdate = Updateable<maintenance_logs>;
export type newMaintenanceLog = Insertable<maintenance_logs>;

export type equipmentItem = Selectable<equipment>;
export type equipmentItemUpdate = Updateable<equipment>;
export type newEquipmentItem = Insertable<equipment>;

export type newBilling = Insertable<billing>;
export type billingItem = Selectable<billing>;
export type billingItemUpdate = Updateable<billing>;
