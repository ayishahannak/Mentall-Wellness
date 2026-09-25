import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectRoute=({children,requiredRole})=>{
    const {isAuthenticated,user}= useSelector((state)=> state.userState);

    if (!isAuthenticated){
        return <Navigate to ={'/login'}/>
    }

 if(requiredRole && !requiredRole.includes(user.role))
        return <Navigate to ={'/forbidden'}/>

    return children
    
}


export default ProtectRoute;