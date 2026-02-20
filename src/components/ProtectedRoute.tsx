import {Navigate, Outlet} from "react-router-dom";
import {useUserContext} from "../lib/UserContext.tsx";

interface ProtectedRouteProps {
    redirectPath?: string;
    children?: React.ReactNode;
}

export const ProtectedRoute = ({redirectPath = '/login', children}: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading } = useUserContext();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectPath} replace />;
    }

    return children ? <> {children} </> : <Outlet/>
};