import { create } from 'zustand';
import { createAuthSlice } from '../../auth/store/auth.slice';
import type { IAuthSlice } from '../../auth/store/interfaces';

export const useAppStore = create<IAuthSlice>((...a) => ({
  ...createAuthSlice(...a),
}));
