
export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  profilePic?: string;
}

export class AuthService {
  private static readonly USERS_KEY = 'gym_buddy_users';
  private static readonly CURRENT_USER_KEY = 'gym_buddy_current_user';
  
  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }
  
  static setCurrentUser(user: User): void {
    // Remove password from stored current user for security
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
  }
  
  static logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }
  
  static getUsers(): User[] {
    const usersStr = localStorage.getItem(this.USERS_KEY);
    return usersStr ? JSON.parse(usersStr) : [];
  }
  
  static registerUser(user: User): boolean {
    const users = this.getUsers();
    
    // Check if email already exists
    if (users.some(u => u.email === user.email)) {
      return false;
    }
    
    // Add user with new ID
    const newUser = {
      ...user,
      id: crypto.randomUUID(),
      profilePic: user.profilePic || `https://api.dicebear.com/7.x/thumbs/svg?seed=${user.name}`
    };
    
    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return true;
  }
  
  static login(email: string, password: string): User | null {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.setCurrentUser(user);
      return user;
    }
    
    return null;
  }
}
