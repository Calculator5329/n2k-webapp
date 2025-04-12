// contexts/AuthContext.js
import React, { createContext, useEffect, useState, useContext } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserInfo } from "../utils/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // for auth check status

  const fetchAndSetUserInfo = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      const userInfo = await getUserInfo(token);
      setUser({
        firebase: firebaseUser,
        username: userInfo.username,
        profilePic: userInfo.profile_pic,
      });
    } catch (err) {
      console.error("Failed to load user info:", err);
      setUser({ firebase: firebaseUser });
    }
  };

  useEffect(() => {
    const init = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        // Immediately set user from cached token
        await fetchAndSetUserInfo(currentUser);
        setLoading(false);
      } else {
        // Wait for Firebase to call back with auth state
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            await fetchAndSetUserInfo(firebaseUser);
          } else {
            setUser(null);
          }
          setLoading(false);
        });

        return unsubscribe;
      }
    };

    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, refreshUserInfo: fetchAndSetUserInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
}
