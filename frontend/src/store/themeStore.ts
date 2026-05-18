import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: true,
      toggleTheme: () =>
        set((state) => {
          const next = !state.isDark;
          document.documentElement.classList.toggle('dark', next);
          return { isDark: next };
        }),
    }),
    { name: 'theme-storage' }
  )
);
