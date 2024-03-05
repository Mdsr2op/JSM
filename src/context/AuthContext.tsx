import { getUserAccount } from "@/lib/appwrite/api";
import { TAuthContext } from "@/types";
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
    checkAuth: async() => false as boolean,
    };


const AuthContext = createContext<TAuthContext>(INITAL_STATE);

export const AuthProvider = ({children}: {children:React.ReactNode}) => {
    const navigate = useNavigate()
    const [user, setUser] = useState(INITIAL_USER)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isAuthenticating, setIsAuthenticating] = useState(false)

    const checkAuth = async() => {
        setIsAuthenticating(true)
        try {
            const currentUser = await getUserAccount();

            if(currentUser){
                setUser({
                    id: currentUser.$id,
                    email: currentUser.email,
                    username: currentUser.username,
                    fullname: currentUser.fullname,
                    imageUrl: currentUser.imageUrl,
                    bio:  currentUser.bio,
                })
                setIsAuthenticated(true)
                return true;
            }
            return false
        } catch (error) {
            console.error(error)
            return false
        }finally{
            setIsAuthenticating(false)
        }
    }

    useEffect(()=>{
        const cookieFallback = localStorage.getItem('cookieFallback')
        if(
            cookieFallback === undefined ||
            cookieFallback === null ||
            cookieFallback === "[]" 
        ){
            navigate("/sign-in")
        }

        checkAuth();
    },[])
    
    const value ={
        user,
        isAuthenticated,
        isAuthenticating,
        setUser,
        setIsAuthenticated,
        checkAuth,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

}

export const useAuth = () => {
    return useContext(AuthContext);
}