import * as React from "react";
import {createContext, useContext, useState} from "react";

export type UserContextValue = {
    loggedIn: boolean;
    logUserOut: () => void;
}

type userContextProviderProps = {
    children: React.ReactNode;
}

const UserContext = createContext<UserContextValue | null>(null);

export const useUserContext = () => {
    const userCtx = useContext(UserContext);
    if (!userCtx) {
        throw new Error("useUserContext should not be null.");
    }
    return userCtx;
}

const UserContextProvider = ({ children, }: userContextProviderProps) => {

const [loggedIn, setLoggedIn] = useState(false);

const logUserOut = () => {
    setLoggedIn(false);
}
const contextValue: UserContextValue = {
    loggedIn,
    logUserOut,
};
    return (
       <UserContext.Provider value={contextValue}>
           {children}
       </UserContext.Provider>
    );
};

export default UserContext;