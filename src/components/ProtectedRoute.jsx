import { Navigate, useLocation } from 'react-router-dom';
import { useShipmentStore } from '../store/shipmentStore';

export const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useShipmentStore();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
};

export const AuthRoute = ({ children }) => {
  const { isLoggedIn } = useShipmentStore();
  const location = useLocation();

  if (isLoggedIn) {
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
