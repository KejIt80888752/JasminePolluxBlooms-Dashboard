import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const CREDS = {
  users: ["admin", "jasmine", "jasminepolluxblooms@gmail.com"],
  pass: "bloom@2026",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (user: string, pass: string) => {
    if (CREDS.users.includes(user.trim().toLowerCase()) && pass === CREDS.pass) {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const logout = () => setIsLoggedIn(false);

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
