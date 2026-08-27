import { io } from "socket.io-client";
import { API_URL } from "./axios";

let socket = null;

// Created lazily, once, after login — reused everywhere the chat needs it
export const getSocket = () => {

    const token = localStorage.getItem("usafi_token");

    if(!socket){
        socket = io(API_URL, {
            autoConnect: false,
            auth: { token },
        });
    }else{
        // Keep the auth payload in sync in case the token changed since the socket was created
    socket.auth = { token };
    }
    return socket;
};

export const disconnectSocket = () =>{
    if (socket){
        socket.disconnect();
        socket = null;
    }
};