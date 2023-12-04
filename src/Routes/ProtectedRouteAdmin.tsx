import { useNavigate } from 'react-router-dom';
import { ReactNode, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import { destroyCookie, parseCookies } from 'nookies';

interface ProtectedRouteAdminProps {
  children: ReactNode;
}

interface DecodedToken {
  exp: number;
}

function ProtectedRouteAdmin({ children }: ProtectedRouteAdminProps) {
  
  const navigate = useNavigate();
  const  isAuthenticatedAdmin  = parseCookies().token
  
  useEffect(() => {
    if (isAuthenticatedAdmin) {
      const decodedToken = jwt_decode(parseCookies().token) as DecodedToken
      if (decodedToken.exp * 1000 < Date.now()) {
        destroyCookie(null, 'token');
        navigate('/admin/sign-in');
      }
    }else {
      navigate('/admin/sign-in');
    }
    
  }, [isAuthenticatedAdmin]);
  
  
  return <>{children}</>;
}
export default ProtectedRouteAdmin;