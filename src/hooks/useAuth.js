import { useContext } from 'react';
import { AuthContext } from '../components/Auth/AuthContext';

export function useAuth() {
  return useContext(AuthContext);
}