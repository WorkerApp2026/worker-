import { createContext, useContext, useEffect, useState } from "react";

import { supabase } from "../services/supabase/client";
import { createMyProfileIfMissing } from "../services/supabase/profiles";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  async function loadProfile(currentUser) {
    if (!currentUser) {
      setProfile(null);
      return;
    }

    try {
      const profileData = await createMyProfileIfMissing();
      setProfile(profileData);
    } catch (error) {
      console.error("Profil konnte nicht geladen werden:", error.message);
      setProfile(null);
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function loadSession() {
      try {
        setIsAuthLoading(true);

        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        const currentUser = session?.user ?? null;

        setSession(session);
        setUser(currentUser);

        await loadProfile(currentUser);
      } catch (error) {
        console.error("Session konnte nicht geladen werden:", error.message);
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;

      setSession(session);
      setUser(currentUser);

      setTimeout(() => {
        loadProfile(currentUser);
      }, 0);

      setIsAuthLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAuthLoading,
        loading: isAuthLoading,
        isLoggedIn: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth muss innerhalb von AuthProvider verwendet werden.");
  }

  return context;
}