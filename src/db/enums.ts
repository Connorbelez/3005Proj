export const day_of_week = {
    mon: "mon",
    tue: "tue",
    wed: "wed",
    thu: "thu",
    fri: "fri",
    sat: "sat",
    sun: "sun"
} as const;
export type day_of_week = (typeof day_of_week)[keyof typeof day_of_week];
