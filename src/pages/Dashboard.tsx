
import { useTimetable } from '@/contexts/TimetableContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClassEntry, Day, dayOrder } from '@/lib/types';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { classes, getClassesByDay } = useTimetable();
  const navigate = useNavigate();
  
  // Get today's day name
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as Day;
  const todayClasses = getClassesByDay(today);
  
  // Get upcoming classes for the next day with classes
  let upcomingDay: Day | null = null;
  let upcomingClasses: ClassEntry[] = [];
  
  if (todayClasses.length === 0) {
    // If no classes today, find the next day with classes
    const todayIndex = dayOrder.indexOf(today);
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (todayIndex + i) % 7;
      const nextDay = dayOrder[nextDayIndex];
      const nextDayClasses = getClassesByDay(nextDay);
      if (nextDayClasses.length > 0) {
        upcomingDay = nextDay;
        upcomingClasses = nextDayClasses;
        break;
      }
    }
  }
  
  // Get total classes count per day
  const classesByDay = dayOrder.map(day => ({
    day,
    count: getClassesByDay(day).length
  }));

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your class schedule and view upcoming classes
            </p>
          </div>
          <Button onClick={() => navigate('/add-class')}>
            Add New Class
          </Button>
        </div>

        {classes.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No classes added yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                Start by adding classes to your schedule
              </p>
              <Button onClick={() => navigate('/add-class')}>
                Add Your First Class
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Today's Classes */}
            <Card className="col-span-full md:col-span-1 lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Today's Classes ({today})
                </CardTitle>
                <CardDescription>
                  {todayClasses.length > 0
                    ? `You have ${todayClasses.length} class${todayClasses.length > 1 ? 'es' : ''} today`
                    : 'No classes scheduled for today'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {todayClasses.length > 0 ? (
                  <ul className="space-y-4">
                    {todayClasses.map((cls) => (
                      <li key={cls.id} className="border rounded-md p-4 flex flex-col gap-2">
                        <div className="font-medium text-lg">{cls.subject}</div>
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
                      </li>
                    ))}
                  </ul>
                ) : upcomingDay ? (
                  <div className="flex flex-col items-center py-6 text-center">
                    <p className="text-muted-foreground mb-2">Your next classes are on:</p>
                    <h3 className="text-lg font-medium mb-4">{upcomingDay}</h3>
                    <Button variant="outline" onClick={() => navigate('/schedule')}>
                      View Full Schedule
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-6 text-center">
                    <p className="text-muted-foreground">You don't have any classes scheduled yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly Overview */}
            <Card className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Weekly Overview
                </CardTitle>
                <CardDescription>
                  Your classes distribution throughout the week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {classesByDay.map(({ day, count }) => (
                    <div key={day} className="flex items-center gap-2">
                      <div className="w-20 font-medium">{day}</div>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: count ? `${Math.min(100, count * 20)}%` : '0%' }}
                        />
                      </div>
                      <div className="w-6 text-center">{count}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <Button variant="outline" onClick={() => navigate('/schedule')}>
                    View Full Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="col-span-full md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your class schedule
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <Button variant="secondary" onClick={() => navigate('/add-class')}>
                  Add New Class
                </Button>
                <Button variant="outline" onClick={() => navigate('/schedule')}>
                  View Weekly Schedule
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
