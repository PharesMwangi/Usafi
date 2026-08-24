import { io } from "socket.io-client";
import { API_URL } from "./axios";

let socket = null;

// Created lazily, once, after login — reused everywhere the chat needs it
export const getSocket = () => {
    if(!socket){
        socket = io(API_URL, {
            withCredentials: true, // sends the same httpOnly cookie the REST API uses
            autoConnect: false,
        });
    }
    return socket;
};

export const disconnectSocket = () =>{
    if (socket){
        socket.disconnect();
        socket = null;
    }
};