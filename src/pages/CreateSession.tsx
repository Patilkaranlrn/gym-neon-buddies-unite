
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/lib/toast";
import { AuthService, User } from '@/services/AuthService';
import { SessionService } from '@/services/SessionService';
import Navbar from '@/components/Navbar';
import { format } from 'date-fns';

const CreateSession = () => {
  const [title, setTitle] = useState('');
  const [workoutType, setWorkoutType] = useState('');
  const [location, setLocation] = useState('');
  const [datetime, setDatetime] = useState('');
  const [details, setDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(AuthService.getCurrentUserSync());
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!currentUser) {
      // Try to load user asynchronously
      const loadUser = async () => {
        const user = await AuthService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
        } else {
          toast("Not logged in", {
            description: "You need to be logged in to create a session",
          });
          navigate('/login');
        }
      };
      
      loadUser();
    }
  }, [navigate, currentUser]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast("Not logged in", {
        description: "You need to be logged in to create a session",
      });
      navigate('/login');
      return;
    }
    
    // Validate form
    if (!title || !workoutType || !location || !datetime || !details) {
      toast("Missing information", {
        description: "Please fill out all fields",
      });
      return;
    }
    
    // Validate datetime is in the future
    const sessionDate = new Date(datetime);
    if (sessionDate <= new Date()) {
      toast("Invalid date", {
        description: "Session date must be in the future",
      });
      return;
    }
    
    setIsLoading(true);
    
    // Create session with the correct parameter structure
    try {
      const newSession = SessionService.createSession({
        title,
        workoutType,
        location,
        datetime,
        details,
        creator: {
          id: currentUser.id,
          name: currentUser.name,
          profilePic: currentUser.profilePic
        }
      }, currentUser);
      
      toast("Session created!", {
        description: "Your workout session has been created successfully",
      });
      
      navigate('/');
    } catch (error) {
      toast("Error", {
        description: "Failed to create session",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get min datetime (current time)
  const now = new Date();
  const minDatetime = format(now, "yyyy-MM-dd'T'HH:mm");
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Create Workout Session</CardTitle>
              <CardDescription>
                Create a new workout session to find gym buddies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Session Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Morning Leg Day"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="workout-type">Workout Type</Label>
                  <Select value={workoutType} onValueChange={setWorkoutType} required>
                    <SelectTrigger id="workout-type">
                      <SelectValue placeholder="Select workout type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardio">Cardio</SelectItem>
                      <SelectItem value="strength">Strength Training</SelectItem>
                      <SelectItem value="yoga">Yoga</SelectItem>
                      <SelectItem value="hiit">HIIT</SelectItem>
                      <SelectItem value="crossfit">CrossFit</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g. Fitness First, Downtown"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="datetime">Date & Time</Label>
                  <Input
                    id="datetime"
                    type="datetime-local"
                    min={minDatetime}
                    value={datetime}
                    onChange={(e) => setDatetime(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="details">Session Details</Label>
                  <Textarea
                    id="details"
                    placeholder="Describe your workout session, experience level needed, what to bring, etc."
                    rows={4}
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    required
                  />
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSubmit}
                className="w-full bg-neon-purple hover:bg-neon-purple/90"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create Session"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateSession;
