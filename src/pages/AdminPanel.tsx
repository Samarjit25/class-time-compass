
import { useState } from 'react';
import { useTimetable } from '@/contexts/TimetableContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClassEntry, Day, dayOrder, ClassStatus } from '@/lib/types';
import { AlertCircle, Check, Clock, Edit, MapPin, Plus, X, Mail } from 'lucide-react';
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

const AdminPanel = () => {
  const { getClassesByDay, updateClassStatus, getClassesByCode } = useTimetable();
  const { user, isProfessor } = useAuth();
  const [classToUpdate, setClassToUpdate] = useState<ClassEntry | null>(null);
  const [targetStatus, setTargetStatus] = useState<ClassStatus>('scheduled');
  const { toast } = useToast();
  
  // Get today's day name
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as Day;

  // Redirect if not a professor
  if (!isProfessor) {
    return <Navigate to="/dashboard" />;
  }

  const handleUpdateClassStatus = () => {
    if (classToUpdate) {
      updateClassStatus(classToUpdate.id, targetStatus);
      setClassToUpdate(null);
      
      toast({
        title: "Class Updated",
        description: `Class status has been updated to ${targetStatus}`,
      });
    }
  };

  const getStatusBadge = (status: ClassStatus) => {
    switch(status) {
      case 'canceled':
        return <Badge variant="destructive" className="ml-2">Canceled</Badge>;
      case 'rescheduled':
        return <Badge variant="outline" className="ml-2 bg-yellow-500 text-white">Rescheduled</Badge>;
      default:
        return <Badge variant="outline" className="ml-2">Scheduled</Badge>;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Professor Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your class schedule and make adjustments
            </p>
            {user?.classCode && (
              <p className="text-sm text-muted-foreground mt-1">
                Class code: <span className="font-mono bg-muted px-1.5 py-0.5 rounded">{user.classCode}</span>
              </p>
            )}
          </div>
          <Button onClick={() => window.location.href = '/add-class'}>
            <Plus className="mr-1 h-4 w-4" /> Add New Class
          </Button>
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
            const dayClasses = user?.classCode
              ? getClassesByCode(user.classCode).filter(c => c.day === day)
              : getClassesByDay(day);
            
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
                          <div key={cls.id} className="border rounded-md p-4">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-lg flex items-center">
                                {cls.subject}
                                {getStatusBadge(cls.status || 'scheduled')}
                                {cls.classCode && (
                                  <Badge variant="outline" className="ml-2">
                                    <Mail className="h-3 w-3 mr-1" /> Notifications Enabled
                                  </Badge>
                                )}
                              </h3>
                              <div className="flex space-x-2">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        setClassToUpdate(cls);
                                        setTargetStatus('scheduled');
                                      }}
                                    >
                                      <Check className="h-4 w-4 mr-1" /> Set as Scheduled
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Confirm Class Status Change</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to set {cls.subject} as scheduled?
                                        {cls.classCode && (
                                          <p className="mt-2">
                                            <Mail className="h-4 w-4 inline mr-1" /> 
                                            An email notification will be sent to all students in class code {cls.classCode}.
                                          </p>
                                        )}
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel onClick={() => setClassToUpdate(null)}>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction onClick={handleUpdateClassStatus}>
                                        Confirm
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => {
                                        setClassToUpdate(cls);
                                        setTargetStatus('canceled');
                                      }}
                                    >
                                      <X className="h-4 w-4 mr-1" /> Cancel Class
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Cancel Class</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to cancel {cls.subject} on {day}?
                                        {cls.classCode && (
                                          <p className="mt-2">
                                            <Mail className="h-4 w-4 inline mr-1" /> 
                                            An email notification will be sent to all students in class code {cls.classCode}.
                                          </p>
                                        )}
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel onClick={() => setClassToUpdate(null)}>
                                        No, Keep Class
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        onClick={handleUpdateClassStatus}
                                      >
                                        Yes, Cancel Class
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
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
                        <Button onClick={() => window.location.href = '/add-class'}>
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

export default AdminPanel;
