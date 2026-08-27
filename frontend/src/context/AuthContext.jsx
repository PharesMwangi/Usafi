import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import {disconnectSocket} from "../api/socket";

const AuthContext = createContext(null);
const TOKEN_KEY = "usafi_token";

export function AuthProvider ({ children}){
    const [user, setUser] = useState(null);
    const [loading, setLoading ] = useState(true);// true while checking for an existing session

    useEffect(() => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) {
          setLoading(false);
          return;
        }
    
        // We have a stored token — check it's still valid and load the user
        api
          .get("/auth/me")
          .then((res) => setUser(res.data.user))
          .catch(() => {
            localStorage.removeItem(TOKEN_KEY); // stale/expired token, clear it
            setUser(null);
          })
          .finally(() => setLoading(false));
      }, []);

    const signup = async(payload) =>{
        const res = await api.post("/auth/signup", payload);
        localStorage.setItem(TOKEN_KEY, res.data.token);
        setUser(res.data.user);
        return res.data.user;
    };

    const login = async(payload) =>{
        const res = await api.post("/auth/login", payload);
        localStorage.setItem(TOKEN_KEY, res.data.token);
        setUser(res.data.user);
        return res.data.user;
    };

    const logout = async () => {
        try {
          await api.post("/auth/logout");
        } finally {
          localStorage.removeItem(TOKEN_KEY);
          disconnectSocket();
          setUser(null);
        }
      };

    return(
        <AuthContext.Provider value={{user, loading, signup, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);