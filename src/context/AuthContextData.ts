import { createContext } from "react";
import { Admin } from "collections";

export interface AuthContextType {
  user: Admin | null;
  loading: boolean;
  error: Error | null;
  logout: () => Promise<void>;
  login: (data: { email: string; password: string }) => Promise<void>;
  signup: (data: { email: string; password: string; fullName: string }) => Promise<void>;
}

export const AuthContextData = createContext<AuthContextType | undefined>(undefined);
