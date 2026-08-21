import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/xios";
import {disconnectSocket} from "../api/socket";

const AuthContext = createContext(null);

export function AuthProvider ({ children}){
    const [user, setUser] = useState(null);
    const [loading, setLoading ] = useState(true);// true while checking for an existing session

    useEffect (() =>{
        api
        .get("/auth/me")
        .then((res) => setUser(res.data.user))
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    }, []);

    const signup = async(payload) =>{
        const res = await api.post("/auth/signup", payload);
        setUser(res.data.user);
        return res.data.user;
    };

    const login = async(payload) =>{
        const res = await api.post("/auth/login", payload);
        setUser(res.data.user);
        return res.data.user;
    };

    const logout = async () =>{
        await api.post("/auth/logout");
        disconnectSocket();
        setUser(null);
    };

    return(
        <AuthContext.Provider value={{user, loading, signup, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);