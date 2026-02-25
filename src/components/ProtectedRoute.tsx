import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }: { children: JSX.Element, allowedRoles?: string[] }) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or a proper loading spinner
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Role Check
    if (allowedRoles && user?.role && !allowedRoles.includes(user.role)) {
        // Redirect unauthorized users to a safe page (e.g. Marketplace or Home)
        return <Navigate to="/marketplace" replace />;
    }

    return children;
};

export default ProtectedRoute;
