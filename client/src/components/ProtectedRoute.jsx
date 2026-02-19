import { Navigate } from "react-router-dom";

import { useAppContext } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAppContext();

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    return children; // render protected component
};

export default ProtectedRoute;



