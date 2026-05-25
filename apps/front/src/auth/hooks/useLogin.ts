import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { LoginFormValues } from '../schemas/login.schema';
import { useAppStore } from '../../common/store/store';
import { authService } from '../service/auth.service';
import { ROUTES } from '../../router/routePaths';
import { Encoder } from '../../common/helpers/encoder';

export const useLogin = () => {
  const navigate = useNavigate();
  const setSession = useAppStore((state) => state.setSession);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const login = async (values: LoginFormValues) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      let { email, password: rPass } = values;
      rPass = Encoder.encode(values.password);

      const response = await authService.login({
        email,
        password: rPass,
      });

      setSession({
        at_secret: response.at_secret,
        rt_secret: response.rt_secret,
        user: response.user,
      });

      navigate(ROUTES.dashboard, { replace: true });
    } catch (error: any) {
      const { message } = error.response.data;
      const capitalizedMessage = message.charAt(0).toUpperCase() + message.slice(1);

      setSubmitError(
        error instanceof Error ? capitalizedMessage : 'Unable to sign in right now.',
      );
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    login,
    isSubmitting,
    submitError,
  };
};
