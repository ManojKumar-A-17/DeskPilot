import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from "@/lib/api";

export type UserRole = "employee" | "technician" | "admin";

interface User {
  _id: string;
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  department?: string;
  phoneNumber?: string;
  avatar?: string;
  isActive?: boolean;
  lastLogin?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: UserRole;
  userName: string;
  loading: boolean;
  login: (role: UserRole, name: string, userData?: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  role: "employee",
  userName: "",
  loading: true,
  login: () => {},
  logout: () => {},
  setUser: () => {},
});

export const useAuth = () => useContext(AuthContext);
export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("employee");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = api.getToken();
      if (token) {
        try {
          const response = await api.getMe();
          if (response.success && response.data.user) {
            const userData = response.data.user;
            setUser(userData);
            setRole(userData.role);
            setUserName(userData.name);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          api.removeToken();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (r: UserRole, name: string, userData?: User) => {
    setRole(r);
    setUserName(name);
    setIsAuthenticated(true);
    if (userData) {
      setUser(userData);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserName("");
    setUser(null);
    setRole("employee");
    api.removeToken();
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      role, 
      userName, 
      loading, 
      login, 
      logout,
      setUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
