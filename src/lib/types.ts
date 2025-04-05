
// Type definitions for our application

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'professor';
  classCode?: string;
}

export interface ClassEntry {
  id: string;
  day: Day;
  subject: string;
  startTime: string;
  endTime: string;
  location?: string;
  notes?: string;
  status: ClassStatus;
  classCode?: string;
}

export type ClassStatus = 'scheduled' | 'canceled' | 'rescheduled';

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const dayOrder: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export interface TimeSlot {
  time: string;
  label: string;
}

// Generate time slots from 8 AM to 10 PM
export const timeSlots: TimeSlot[] = Array.from({ length: 29 }, (_, i) => {
  const hour = Math.floor(i / 2) + 8;
  const minute = i % 2 === 0 ? '00' : '30';
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return {
    time: `${hour.toString().padStart(2, '0')}:${minute}`,
    label: `${displayHour}:${minute} ${period}`
  };
});
