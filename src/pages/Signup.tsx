
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import { AuthService } from '@/services/AuthService';
import { Dumbbell } from 'lucide-react';
import Navbar from '@/components/Navbar';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Add simple validation
    if (!name || !email || !password) {
      toast("Missing information", {
        description: "Please fill out all required fields",
      });
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      toast("Password mismatch", {
        description: "Passwords do not match",
      });
      setIsLoading(false);
      return;
    }
    
    setTimeout(() => {
      const success = AuthService.registerUser({
        id: "",
        name,
        email,
        password,
      });
      
      if (success) {
        AuthService.login(email, password);
        toast("Account created!", {
          description: "Your account has been created successfully",
        });
        navigate('/');
      } else {
        toast("Registration failed", {
          description: "Email already in use",
        });
      }
      
      setIsLoading(false);
    }, 800); // Simulate network delay
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[calc(100vh-80px)]">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <Dumbbell className="h-12 w-12 text-neon-purple" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
            <CardDescription className="text-center">
              Join GymBuddy to find workout partners and achieve your fitness goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="your.email@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-neon-purple hover:bg-neon-purple/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <div className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-neon-purple hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default Signup;
