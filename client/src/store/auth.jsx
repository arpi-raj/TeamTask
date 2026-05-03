import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

  const [token,setToken] =useState(localStorage.getItem("token"));
  const [user,setUser] =useState("");
  const [isLoading,setIsLoading] =useState(true);
  const authorizationToken=`Bearer ${token}`;
  const storetokenInLS = (serverToken) => {
    setToken(serverToken);
    return localStorage.setItem("token", serverToken);
  };
  let isLoggedIn=!!token;    
const LogOutUser=()=>{
    setToken("");
    return  localStorage.removeItem("token");
}


const userAuthentication=async ()=>{
   try {
    setIsLoading(true);
    const user_response = await fetch(
      `http://localhost:5000/api/auth/user`,
      {
        method: "GET",
        headers: {
          "Authorization": authorizationToken,
        }
      }
    );

    if (user_response.ok){
      const data=await user_response.json();
      console.log("User data : "+JSON.stringify(data));
      setUser(data.msg);
      setIsLoading(false);
    }else{
      setIsLoading(false);
    }
    
   } catch (error) {
    console.log("userAuthentication failed");
   }
}
useEffect(()=>{
      userAuthentication();
},[]);

  return (
    <AuthContext.Provider value={{ storetokenInLS,LogOutUser,isLoggedIn,user,authorizationToken,isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};



export const useAuth = () => {
  const authContextValue = useContext(AuthContext);
  if (!authContextValue) {
    throw new Error("useAuth use outside of provider");
  }

  return authContextValue;
};
