
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/lib/toast";

export interface User {
  id: string;
  email: string;
  name: string;
  profilePic?: string;
}

export class AuthService {
  // Get current user from Supabase session
  static async getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) return null;
    
    // Get profile data
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
      
    if (!profile) return null;
    
    return {
      id: session.user.id,
      email: session.user.email || '',
      name: profile.name,
      profilePic: profile.profile_pic
    };
  }
  
  // Sign up with email and password
  static async registerUser(user: { name: string, email: string, password: string }): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            name: user.name
          }
        }
      });
      
      if (error) {
        toast(error.message, {
          description: "Please try again with different credentials."
        });
        console.error("Registration error:", error);
        return false;
      }
      
      // Success - the profile is created automatically via database trigger
      return true;
    } catch (err) {
      console.error("Registration exception:", err);
      return false;
    }
  }
  
  // Sign in with email and password
  static async login(email: string, password: string): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast(error.message, {
          description: "Please check your credentials and try again."
        });
        console.error("Login error:", error);
        return null;
      }
      
      if (!data.user) return null;
      
      // Get profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      return {
        id: data.user.id,
        email: data.user.email || '',
        name: profile?.name || '',
        profilePic: profile?.profile_pic
      };
    } catch (err) {
      console.error("Login exception:", err);
      return null;
    }
  }
  
  // Sign out
  static async logout(): Promise<void> {
    await supabase.auth.signOut();
  }
  
  // Set up auth state change listener
  static onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      // Only handle sign_in and sign_out events
      if (event !== 'SIGNED_IN' && event !== 'SIGNED_OUT') return;
      
      if (!session?.user) {
        callback(null);
        return;
      }
      
      // For sign in, fetch the profile
      if (event === 'SIGNED_IN') {
        // Use setTimeout to prevent blocking the auth state change callback
        setTimeout(async () => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profile) {
            callback({
              id: session.user.id,
              email: session.user.email || '',
              name: profile.name,
              profilePic: profile.profile_pic
            });
          }
        }, 0);
      }
    });
  }
}
