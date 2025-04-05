
import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClassEntry, Day, dayOrder } from '@/lib/types';
import { useAuth } from './AuthContext';

interface TimetableContextType {
  classes: ClassEntry[];
  addClass: (classEntry: Omit<ClassEntry, 'id'>) => void;
  updateClass: (id: string, classEntry: Partial<ClassEntry>) => void;
  deleteClass: (id: string) => void;
  getClassesByDay: (day: Day) => ClassEntry[];
}

const TimetableContext = createContext<TimetableContextType>({
  classes: [],
  addClass: () => {},
  updateClass: () => {},
  deleteClass: () => {},
  getClassesByDay: () => [],
});

export const useTimetable = () => useContext(TimetableContext);

interface TimetableProviderProps {
  children: React.ReactNode;
}

export const TimetableProvider = ({ children }: TimetableProviderProps) => {
  const [classes, setClasses] = useState<ClassEntry[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const savedClasses = localStorage.getItem(`timetable-${user.id}`);
      if (savedClasses) {
        setClasses(JSON.parse(savedClasses));
      }
    } else {
      setClasses([]);
    }
  }, [user]);

  const saveClasses = (updatedClasses: ClassEntry[]) => {
    if (user) {
      localStorage.setItem(`timetable-${user.id}`, JSON.stringify(updatedClasses));
    }
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
    return classes
      .filter(c => c.day === day)
      .sort((a, b) => {
        // Sort by time
        return a.startTime.localeCompare(b.startTime);
      });
  };

  return (
    <TimetableContext.Provider
      value={{
        classes,
        addClass,
        updateClass,
        deleteClass,
        getClassesByDay,
      }}
    >
      {children}
    </TimetableContext.Provider>
  );
};
