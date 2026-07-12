import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Users, 
  FolderTree, 
  UserSquare2, 
  Laptop, 
  BarChart3, 
  History, 
  Bell, 
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import dummyData from '../data/dummyData.json';

const NAV_ITEMS = [
  { name: 'Organization Setup', path: '/admin/organization-setup', icon: Building2 },
  { name: 'Departments', path: '/admin/departments', icon: Users },
  { name: 'Categories', path: '/admin/categories', icon: FolderTree },
  { name: 'Employee Directory', path: '/admin/employee-directory', icon: UserSquare2 },
  { name: 'Assets', path: '/admin/assets', icon: Laptop },
  { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
  { name: 'Activity Logs', path: '/admin/activity-logs', icon: History },
  { name: 'Settings', path: '/admin/settings', icon: SettingsIcon },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = dummyData.notifications;

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 280 : 0,
          opacity: isSidebarOpen ? 1 : 0
        }}
        className="bg-slate-900 border-r border-slate-800 flex flex-col z-20 shrink-0 overflow-hidden"
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-800 min-w-[280px]">
          <div className="flex items-center gap-3 text-blue-500">
            <Building2 className="w-6 h-6" />
            <span className="text-xl font-bold text-white tracking-tight">AssetFlow</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 min-w-[280px] custom-scrollbar">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-blue-600/10 text-blue-400 font-medium' 
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }
              `}
            >
              <item.icon className={`w-5 h-5 transition-colors`} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800 min-w-[280px]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-6 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                    <h3 className="font-medium text-slate-200">Notifications</h3>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{notifications.length} New</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map(notif => (
                      <div key={notif.id} className="px-4 py-3 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                        <p className="text-sm font-medium text-slate-200">{notif.title}</p>
                        <p className="text-xs text-slate-400 mt-1">{notif.message}</p>
                        <p className="text-[10px] text-slate-500 mt-2">{notif.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 bg-slate-900">
                    <button className="w-full py-2 text-sm text-blue-400 hover:text-blue-300 text-center transition-colors">
                      Mark all as read
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-medium">
                A
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-slate-950 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
