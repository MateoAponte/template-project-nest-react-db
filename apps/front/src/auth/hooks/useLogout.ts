import { authService } from '../service/auth.service';
import { useAppStore } from '../../common/store/store';

export const useLogout = () => {
  const clearSession = useAppStore((state) => state.logout);

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      clearSession();
      window.location.href = '/login';
    }
  };

  return { logout };
};
