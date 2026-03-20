import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>; // Wait for the /api/me check

  if (!user) {
    // No user found in context? Send them to Login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;