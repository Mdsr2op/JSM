

export type TNewUser = {
    fullname: string,
    username: string,
    email: string,
    password: string
}

export type TUser = {
    id: string;
    fullname: string;
    username: string;
    email: string;
    imageUrl: string;
    bio: string;
  };


export type TAuthContext = {
    user: TUser,
    isAuthenticated: boolean,
    isAuthenticating: boolean,
    setUser: React.Dispatch<React.SetStateAction<TUser>>
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
    checkAuth: () => Promise<boolean>
}