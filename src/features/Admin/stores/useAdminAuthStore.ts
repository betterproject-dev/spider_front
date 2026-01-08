import { create } from "zustand";

interface AdminAuthState {
  isAdminAuthenticated: boolean;
  authenticate: () => void;
  logout: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  isAdminAuthenticated: false,      // 기본값: 인증 안 됨
  authenticate: () => set({ isAdminAuthenticated: true }), // 인증 성공
  logout: () => set({ isAdminAuthenticated: false }),      // 로그아웃
}));
