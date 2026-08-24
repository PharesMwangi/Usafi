import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

//wrap any page that requires login
export default function ProtectedRoute({ children, role }){
    const { user, loading } = useAuth();

    if(loading){
        return(
            <div className="container" style={{ padding: "60px 0", display: "flex", justifyContent: "center" }}>
                <div className="spinner" />
            </div>
        );
    }

    if(!user){
        return<Navigate to="/login" replace />;
    }

    if(role && user.role !== role){
        //send to wherever their role belongs
        return <Navigate to={user.role === "maid" ? "/create-profile" : "/browse"} replace />;
    }

    return children;
}