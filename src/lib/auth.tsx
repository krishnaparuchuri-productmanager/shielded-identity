import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export interface DemoUser {
  email: string;
  password: string;
  name: string;
  role: string;
  company: string;
  initials: string;
}

export const demoUsers: DemoUser[] = [
  {
    email: "kiran.patel@fraudshield.in",
    password: "demo1234",
    name: "Kiran Patel",
    role: "Senior Fraud Analyst",
    company: "FraudShield India Pvt. Ltd.",
    initials: "KP",
  },
  {
    email: "ananya.rao@fraudshield.in",
    password: "demo1234",
    name: "Ananya Rao",
    role: "KYC Operations Lead",
    company: "FraudShield India Pvt. Ltd.",
    initials: "AR",
  },
];

interface AuthContextValue {
  user: Omit<DemoUser, "password"> | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "fraudshield_demo_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<Omit<DemoUser, "password"> | null>(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else sessionStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const login = (email: string, password: string) => {
    const found = demoUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!found) return { ok: false, error: "Invalid email or password" };
    const { password: _pw, ...safe } = found;
    setUser(safe);
    return { ok: true };
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
