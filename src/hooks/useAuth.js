import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

export default function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    return {
      user: { email: "test@test.com" },
      profile: { name: "Burak" },
    };
  }

  return context;
}