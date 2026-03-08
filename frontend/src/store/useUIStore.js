import { create } from 'zustand';

const useUIStore = create((set) => ({
  isSidebarOpen: true,
  theme: localStorage.getItem('theme') || 'light',
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setTheme: (newTheme) => {
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme: newTheme });
  },
}));

export default useUIStore;
