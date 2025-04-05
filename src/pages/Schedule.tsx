
import { useTimetable } from '@/contexts/TimetableContext';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClassEntry, Day, dayOrder } from '@/lib/types';
import { AlertCircle, Clock, MapPin, Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const Schedule = () => {
  const { getClassesByDay, deleteClass } = useTimetable();
  const navigate = useNavigate();
  const [classToDelete, setClassToDelete] = useState<ClassEntry | null>(null);
  const { isProfessor } = useAuth();
  
  // Get today's day name
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as Day;

  const handleDeleteClass = () => {
    if (classToDelete) {
      deleteClass(classToDelete.id);
      setClassToDelete(null);
    }
  };

  const getStatusBadge = (status: ClassEntry['status']) => {
    if (!status || status === 'scheduled') return null;
    
    switch(status) {
      case 'canceled':
        return <Badge variant="destructive" className="ml-2">Canceled</Badge>;
      case 'rescheduled':
        return <Badge variant="warning" className="ml-2 bg-yellow-500">Rescheduled</Badge>;
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Weekly Schedule</h1>
            <p className="text-muted-foreground">
              View your classes for the entire week
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/add-class')}>
              Add New Class
            </Button>
            {isProfessor && (
              <Button variant="outline" onClick={() => navigate('/admin')}>
                Professor Dashboard
              </Button>
            )}
          </div>
        </div>

        <Tabs defaultValue={today.toLowerCase()}>
          <TabsList className="mb-4 flex flex-wrap h-auto">
            {dayOrder.map((day) => (
              <TabsTrigger 
                key={day} 
                value={day.toLowerCase()}
                className="flex-1"
              >
                {day}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {dayOrder.map((day) => {
            const dayClasses = getClassesByDay(day);
            
            return (
              <TabsContent key={day} value={day.toLowerCase()}>
                <Card>
                  <CardHeader>
                    <CardTitle>{day}</CardTitle>
                    <CardDescription>
                      {dayClasses.length > 0
                        ? `${dayClasses.length} class${dayClasses.length > 1 ? 'es' : ''} scheduled`
                        : 'No classes scheduled for this day'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {dayClasses.length > 0 ? (
                      <div className="space-y-4">
                        {dayClasses.map((cls) => (
                          <div 
                            key={cls.id} 
                            className={`border rounded-md p-4 ${cls.status === 'canceled' ? 'bg-red-50 border-red-200 dark:bg-red-900/10' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-lg flex items-center">
                                {cls.subject}
                                {getStatusBadge(cls.status)}
                              </h3>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive"
                                    onClick={() => setClassToDelete(cls)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Class</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {cls.subject} on {day}? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setClassToDelete(null)}>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      onClick={handleDeleteClass}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                            <div className="mt-2 flex flex-col gap-2">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{cls.startTime} - {cls.endTime}</span>
                              </div>
                              {cls.location && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span>{cls.location}</span>
                                </div>
                              )}
                              {cls.status === 'canceled' && (
                                <div className="flex items-center gap-2 text-red-600 mt-1">
                                  <AlertCircle className="h-4 w-4" />
                                  <span>This class has been canceled</span>
                                </div>
                              )}
                              {cls.notes && (
                                <div className="mt-2 text-sm text-muted-foreground">
                                  <p>{cls.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-8 text-center">
                        <p className="text-muted-foreground mb-4">No classes scheduled for {day}</p>
                        <Button onClick={() => navigate('/add-class')}>
                          Add Class for {day}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Schedule;
