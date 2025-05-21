
import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { BookOpen, School, User, Book, GitBranch, Code } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProfessor, setIsProfessor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Student fields
  const [name, setName] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [batch, setBatch] = useState('');
  const [semester, setSemester] = useState('');
  const [branch, setBranch] = useState('');
  
  // Professor fields
  const [classCode, setClassCode] = useState('');
  
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const role = isProfessor ? 'professor' : 'student';
      const userData = isProfessor 
        ? { 
            name, 
            branch, 
            semester, 
            classCode 
          }
        : { 
            name, 
            schoolId, 
            batch, 
            semester, 
            branch 
          };

      await login(email, password, role, userData);
      toast({
        title: "Success!",
        description: "You have successfully logged in.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to login",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      toast({
        title: "Success!",
        description: "You have successfully logged in with Google.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to login with Google",
        variant: "destructive",
      });
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary rounded-full p-3 mb-4">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Class Time Compass</h1>
          <p className="text-muted-foreground">Organize your academic schedule with ease</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email"
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input 
                  id="password"
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="name"
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe" 
                    required
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Switch 
                  id="professor-mode" 
                  checked={isProfessor}
                  onCheckedChange={setIsProfessor}
                />
                <Label htmlFor="professor-mode" className="flex items-center gap-2">
                  <School className="h-4 w-4" />
                  I am a professor
                </Label>
              </div>
              
              {!isProfessor ? (
                // Student fields
                <>
                  <div className="space-y-2">
                    <Label htmlFor="schoolId">School ID</Label>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="schoolId"
                        value={schoolId} 
                        onChange={(e) => setSchoolId(e.target.value)}
                        placeholder="S12345" 
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="batch">Batch</Label>
                    <div className="flex items-center space-x-2">
                      <Book className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="batch"
                        value={batch} 
                        onChange={(e) => setBatch(e.target.value)}
                        placeholder="2022-2026" 
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <div className="flex items-center space-x-2">
                      <Book className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="semester"
                        value={semester} 
                        onChange={(e) => setSemester(e.target.value)}
                        placeholder="3rd" 
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <div className="flex items-center space-x-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="branch"
                        value={branch} 
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="Computer Science" 
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                // Professor fields
                <>
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <div className="flex items-center space-x-2">
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="branch"
                        value={branch} 
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="Computer Science" 
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="semester">Semester</Label>
                    <div className="flex items-center space-x-2">
                      <Book className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="semester"
                        value={semester} 
                        onChange={(e) => setSemester(e.target.value)}
                        placeholder="3rd" 
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="classCode">Class Code</Label>
                    <div className="flex items-center space-x-2">
                      <Code className="h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="classCode"
                        value={classCode} 
                        onChange={(e) => setClassCode(e.target.value)}
                        placeholder="CS101" 
                        required
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
              
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-2 text-xs text-muted-foreground">OR</span>
                </div>
              </div>
              
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleGoogleSignIn}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" className="mr-2">
                  <g transform="matrix(1, 0, 0, 1, 0, 0)">
                    <path d="M15.0827 8.18263c0-.49394-.0449-.96751-.128-1.42217H8.00012v2.85948h3.95236c-.1708.9188-.6932 1.6976-1.4756 2.2167v1.8428h2.3895c1.3978-1.2869 2.2063-3.1808 2.2063-5.49681z" fill="#4285F4"/>
                    <path d="M8.00011 15.9999c1.999 0 3.6707-.6562 4.8954-1.7808l-2.3895-1.8428c-.6617.4434-1.5093.7053-2.5059.7053-1.9274 0-3.5579-1.2982-4.1433-3.0435H1.37582v1.9018c1.2171 2.4165 3.6983 4.06 6.62429 4.06z" fill="#34A853"/>
                    <path d="M3.8568 10.0381c-.14828-.4434-.23282-.9173-.23282-1.40315 0-.48585.08454-.95975.23282-1.40316V5.29504H1.37583c-.473546.938-.74148 1.99822-.74148 3.11995s.267934 2.18191.741475 3.11991l2.48097-1.5368z" fill="#FBBC05"/>
                    <path d="M8.00011 4.58243c1.0865 0 2.0621.37138 2.8287 1.10147l2.1178-2.11526C11.669 2.35686 9.99717 1.6 8.00011 1.6c-2.92599 0-5.40783 1.64297-6.62428 4.05997l2.48097 1.90183c.58536-1.74534 2.21585-3.03937 4.14331-3.03937z" fill="#EA4335"/>
                  </g>
                </svg>
                Sign in with Google
              </Button>
              
              <p className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Create one
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
