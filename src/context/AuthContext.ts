import { useContext, createContext, useState, useEffect } from "react";

const INITIAL_USER = {
    id: "",
    email: "",
    username: "",
    fullname: "",
    imageUrl: "",
    bio: "",
    };

const INITAL_STATE = {
    user: INITIAL_USER,
    isAuthenticated: false,
    isAuthenticating: false,
    setUser: () => {},
    setIsAuthenticated: () => {},
    setIsAuthenticating: () => {},
    checkAuth: async() => false as boolean,
    };

const AuthContext = createContext(INITAL_STATE);


export const useAuth = () => {
    return useContext(AuthContext);
}