import { Navigate } from 'react-router-dom';
import { isLoggedIn } from '../store/auth';

interface Props {
  children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {
  return isLoggedIn() ? children : <Navigate to="/login" replace />;
}
