/**
 * Time Utilities for Ethiopia Local Time (Africa/Addis_Ababa)
 * EA Time is UTC+3 with no Daylight Saving Time.
 */

export interface EthiopianTimeDetails {
  hour: number;
  minute: number;
  formattedTime: string; // 12-hour format e.g. "7:15 AM"
  greeting: string;      // "Good Morning", "Good Afternoon", "Good Evening", "Good Night"
  dateString: string;    // e.g. "Jun 17, 2026"
  yyyyMmDd: string;      // e.g. "2026-06-17"
}

export function getEthiopianTime(): EthiopianTimeDetails {
  const now = new Date();
  
  // Calculate exact UTC+3 hours
  let hour = now.getUTCHours() + 3;
  if (hour >= 24) hour -= 24;
  if (hour < 0) hour += 24;
  
  const minute = now.getUTCMinutes();
  
  // Format standard 12-hour display: e.g. "7:15 AM", "11:40 AM", "2:20 PM", "8:05 PM"
  const ampm = hour >= 12 ? "PM" : "AM";
  let displayHour = hour % 12;
  if (displayHour === 0) displayHour = 12;
  const displayMinute = minute < 10 ? `0${minute}` : minute;
  const formattedTime = `${displayHour}:${displayMinute} ${ampm}`;
  
  // Determine smart greetings using local Ethiopian hours
  let greeting = "Good Day";
  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour >= 17 && hour < 22) {
    greeting = "Good Evening";
  } else {
    greeting = "Good Night";
  }

  // Generate local Date String
  // Shift Date to Ethiopia timezone (UTC+3) to get correct year/month/day
  const etOffsetMs = 3 * 60 * 60 * 1000;
  const etDate = new Date(now.getTime() + etOffsetMs);
  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dateString = `${months[etDate.getUTCMonth()]} ${etDate.getUTCDate()}, ${etDate.getUTCFullYear()}`;
  
  const pad = (n: number) => n < 10 ? `0${n}` : n;
  const yyyyMmDd = `${etDate.getUTCFullYear()}-${pad(etDate.getUTCMonth() + 1)}-${pad(etDate.getUTCDate())}`;

  return {
    hour,
    minute,
    formattedTime,
    greeting,
    dateString,
    yyyyMmDd
  };
}

/**
 * Format a given Date object (or timestamp) to 12-hour Ethiopian local time
 */
export function formatEthiopianTime(dateSource: Date | string | number): string {
  const d = new Date(dateSource);
  let hour = d.getUTCHours() + 3;
  if (hour >= 24) hour -= 24;
  if (hour < 0) hour += 24;
  
  const ampm = hour >= 12 ? "PM" : "AM";
  let displayHour = hour % 12;
  if (displayHour === 0) displayHour = 12;
  const min = d.getUTCMinutes();
  const displayMinute = min < 10 ? `0${min}` : min;
  return `${displayHour}:${displayMinute} ${ampm}`;
}
