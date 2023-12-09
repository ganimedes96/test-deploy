import { useNavigate } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';
import { ContextAuthApp } from '../context/auth-context';

interface ProtectedRouteProps {
  children: ReactNode;
}
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = ContextAuthApp()
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      return navigate('/sign-in');
    }
    
  }, [isAuthenticated])
  
  return <>{children}</>;
}

export default ProtectedRoute;