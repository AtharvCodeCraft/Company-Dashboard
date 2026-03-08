import { Bell, Menu, Moon, Sun, User } from 'lucide-react';
import useUIStore from '../store/useUIStore';
import useAuthStore from '../store/useAuthStore';

export default function Navbar() {
  const { toggleSidebar, theme, setTheme } = useUIStore();
  const { user, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-40 w-full bg-card border-b border-border flex h-16 items-center px-4 md:px-6 shadow-sm">
      <button 
        onClick={toggleSidebar}
        className="mr-4 p-2 rounded-md hover:bg-accent hover:text-accent-foreground lg:hidden text-muted-foreground"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1" />

      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button className="relative p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </button>

        <div className="flex items-center space-x-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden md:flex flex-col text-sm">
            <span className="font-medium text-foreground">{user?.name || 'User'}</span>
            <span className="text-xs text-muted-foreground">{user?.role || 'Role'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
