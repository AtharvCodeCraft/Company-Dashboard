import { Link, useLocation } from 'react-router-dom';
import useUIStore from '../store/useUIStore';
import { LayoutDashboard, Users, Calendar, CheckSquare, Briefcase, ShoppingBag, DollarSign, LifeBuoy, FileText } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Employees', path: '/employees', icon: Users },
  { name: 'Attendance', path: '/attendance', icon: Calendar },
  { name: 'Tasks', path: '/tasks', icon: CheckSquare },
  { name: 'Projects', path: '/projects', icon: Briefcase },
  { name: 'Products', path: '/products', icon: ShoppingBag },
  { name: 'Sales', path: '/sales', icon: DollarSign },
  { name: 'Tickets', path: '/tickets', icon: LifeBuoy },
  { name: 'Contracts', path: '/contracts', icon: FileText },
];

export default function Sidebar() {
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);
  const location = useLocation();

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:block dark:bg-card dark:border-border",
      isSidebarOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex items-center justify-center h-16 border-b border-border">
        <span className="text-2xl font-bold text-primary">Worksphere</span>
      </div>
      <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-4rem)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                isActive 
                  ? "bg-primary/10 text-primary dark:bg-primary/20" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-primary" : "text-muted-foreground")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
