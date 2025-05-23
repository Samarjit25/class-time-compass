
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClassEntry, Day, dayOrder, ClassStatus } from '@/lib/types';
import { useAuth } from './AuthContext';
import { useToast } from "@/components/ui/use-toast";

interface TimetableContextType {
  classes: ClassEntry[];
  addClass: (classEntry: Omit<ClassEntry, 'id'>) => void;
  updateClass: (id: string, classEntry: Partial<ClassEntry>) => void;
  deleteClass: (id: string) => void;
  getClassesByDay: (day: Day) => ClassEntry[];
  getClassesByCode: (classCode: string) => ClassEntry[];
  updateClassStatus: (id: string, status: ClassStatus) => void;
}

const TimetableContext = createContext<TimetableContextType>({
  classes: [],
  addClass: () => {},
  updateClass: () => {},
  deleteClass: () => {},
  getClassesByDay: () => [],
  getClassesByCode: () => [],
  updateClassStatus: () => {},
});

export const useTimetable = () => useContext(TimetableContext);

interface TimetableProviderProps {
  children: React.ReactNode;
}

export const TimetableProvider = ({ children }: TimetableProviderProps) => {
  const [classes, setClasses] = useState<ClassEntry[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Load all class data regardless of user type
    const savedClasses = localStorage.getItem('timetable-classes');
    if (savedClasses) {
      setClasses(JSON.parse(savedClasses));
    }
  }, [user]);

  const saveClasses = (updatedClasses: ClassEntry[]) => {
    localStorage.setItem('timetable-classes', JSON.stringify(updatedClasses));
  };

  const addClass = (classEntry: Omit<ClassEntry, 'id'>) => {
    const newClass = {
      ...classEntry,
      id: Math.random().toString(36).slice(2),
    };
    
    const updatedClasses = [...classes, newClass];
    setClasses(updatedClasses);
    saveClasses(updatedClasses);
  };

  const updateClass = (id: string, classEntry: Partial<ClassEntry>) => {
    const updatedClasses = classes.map(c => 
      c.id === id ? { ...c, ...classEntry } : c
    );
    setClasses(updatedClasses);
    saveClasses(updatedClasses);
  };

  const deleteClass = (id: string) => {
    const updatedClasses = classes.filter(c => c.id !== id);
    setClasses(updatedClasses);
    saveClasses(updatedClasses);
  };

  const getClassesByDay = (day: Day) => {
    let filteredClasses = classes;
    
    // If user is a student, only show classes without a class code or with same class code
    if (user?.role === 'student') {
      filteredClasses = classes.filter(c => !c.classCode || c.classCode === user?.classCode);
    }
    
    return filteredClasses
      .filter(c => c.day === day)
      .sort((a, b) => {
        // Sort by time
        return a.startTime.localeCompare(b.startTime);
      });
  };
  
  const getClassesByCode = (classCode: string) => {
    return classes.filter(c => c.classCode === classCode);
  };
  
  const updateClassStatus = (id: string, status: ClassStatus) => {
    const classToUpdate = classes.find(c => c.id === id);
    if (!classToUpdate) return;

    updateClass(id, { status });
    
    // If the class has a class code, notify students
    if (classToUpdate.classCode && user?.role === 'professor') {
      // In a real app, this would send an email to all students with this class code
      // For now, we'll just show a toast notification
      sendEmailNotification(classToUpdate, status);
    }
  };
  
  // Mock email notification function
  const sendEmailNotification = (classEntry: ClassEntry, status: ClassStatus) => {
    // In a real application, this would call a backend API to send emails
    console.log(`Sending email notifications for ${classEntry.subject} status: ${status}`);
    
    // Show a toast notification to simulate email sending
    const statusMessage = status === 'canceled' 
      ? `The class ${classEntry.subject} has been canceled` 
      : status === 'scheduled' 
        ? `The class ${classEntry.subject} is confirmed to take place as scheduled`
        : `The class ${classEntry.subject} has been rescheduled`;
    
    toast({
      title: "Email Notification Sent",
      description: `Notification: "${statusMessage}" has been sent to all students in class code ${classEntry.classCode}`,
    });
    
    // Additional information would be included in a real email:
    const emailContent = {
      subject: `Class Update: ${classEntry.subject}`,
      body: `
        Dear Student,
        
        ${statusMessage} for ${classEntry.day} at ${classEntry.startTime}.
        
        ${status === 'canceled' 
          ? 'Please adjust your schedule accordingly.' 
          : 'Please ensure you attend the class on time.'}
        
        Location: ${classEntry.location || 'TBD'}
        
        Regards,
        Class Time Compass
      `
    };
    
    console.log('Email content:', emailContent);
  };

  return (
    <TimetableContext.Provider
      value={{
        classes,
        addClass,
        updateClass,
        deleteClass,
        getClassesByDay,
        getClassesByCode,
        updateClassStatus
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
};
