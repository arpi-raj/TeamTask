import { useEffect } from "react";
import { Navigate} from "react-router-dom";
import { useAuth } from "../store/auth";

export default function Logout() {
    const {LogOutUser}=useAuth();

    useEffect(()=>{
        LogOutUser();
    },[LogOutUser])

  return (
    <div >
      <Navigate to="/login"/>
    </div>
  );
}
