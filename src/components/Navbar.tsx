
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { AuthService } from "@/services/AuthService";
import { Dumbbell, LogOut, User, Home, Plus } from 'lucide-react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = () => {
      const user = AuthService.getCurrentUser();
      setIsLoggedIn(!!user);
    };
    
    checkAuth();
    
    // Listen for storage events (logout from another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  const handleLogout = () => {
    AuthService.logout();
    setIsLoggedIn(false);
    navigate('/login');
  };
  
  return (
    <nav className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Dumbbell className="h-8 w-8 text-neon-purple" />
            <span className="text-2xl font-bold gradient-text">GymBuddy</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link to="/">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    <span className="hidden sm:inline">Home</span>
                  </Button>
                </Link>
                <Link to="/create">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    <span className="hidden sm:inline">Create Session</span>
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="default" className="bg-neon-purple hover:bg-neon-purple/90">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
