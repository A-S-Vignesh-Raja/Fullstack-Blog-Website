import { createContext, useState } from "react";

export const UserContext = createContext({});

export function userContextProvider({children}){
    const [userInfo,setUserInfo]=useState({});
    return(
        <UserContext.Provider value={{userInfo,setUserInfo}}>
            {children}
        </UserContext.Provider>
    );
}