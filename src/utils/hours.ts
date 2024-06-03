//Seg 8 as 11 - 16 as 19
//Qua 8 as 11 - 16 as 19
//Sáb 8 as 11 - 16 as 19
import { setHours, setMinutes, format, addMinutes } from "date-fns";

export function generateDayTimeListI(date: Date): string[] {
  const startTimeI = setMinutes(setHours(date, 8), 0); // Set start time to 08:00
  const endTimeI = setMinutes(setHours(date, 11), 0); // Set end time to 11:00

  
  const startTimeII = setMinutes(setHours(date, 16), 0); // Set start time to 08:00
  const endTimeII = setMinutes(setHours(date, 19), 0); // Set end time to 11:00

  const interval = 90; // interval in minutes 1:30min

  const timeList: string[] = [];

  let currentTimeI = startTimeI;
  while (currentTimeI <= endTimeI) {
    timeList.push(format(currentTimeI, "HH:mm"));
    currentTimeI = addMinutes(currentTimeI, interval);
  }

  let currentTimeII = startTimeII;
  while (currentTimeII <= endTimeII) {
    timeList.push(format(currentTimeII, "HH:mm"));
    currentTimeII = addMinutes(currentTimeII, interval);
  }

  return timeList;
}

//Qui 9 as 11
//Ter 9 as 11
//Dom 9 as 11 
export function generateDayTimeListII(date: Date): string[] {
  const startTime = setMinutes(setHours(date, 9), 0); // Set start time to 09:00
  const endTime = setMinutes(setHours(date, 11), 0); // Set end time to 11:00
  const interval = 90; // Interval in minutes 1:30min
  
  const timeList: string[] = [];

  let currentTime = startTime;

  while (currentTime <= endTime) {
    timeList.push(format(currentTime, "HH:mm"));
    currentTime = addMinutes(currentTime, interval);
  }

  return timeList;
}