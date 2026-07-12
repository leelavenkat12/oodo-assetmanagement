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
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-slate-900/30 backdrop-blur border-b border-slate-800 flex items-center justify-between px-8 z-30 hidden md:flex">
          <div>
            <h2 className="text-xl font-bold text-slate-100">Welcome, {currentUser?.name || 'Admin'} 👋</h2>
            <p className="text-sm text-slate-400">Manage your entire organization from here.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-slate-950 border border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 w-64 transition-all"
              />
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-full transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                    <h3 className="font-medium text-slate-200">Notifications</h3>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">{unreadCount} New</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {myNotifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-500">No new notifications.</div>
                    ) : (
                      myNotifications.map(notif => (
                        <div key={notif.id} className={`p-4 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors ${!notif.read ? 'bg-slate-800/10' : ''}`}>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="text-sm font-medium text-slate-200">{notif.title}</h4>
                            <span className="text-[10px] text-slate-500">{new Date(notif.date).toLocaleDateString()}</span>
                          </div>
                          <p className="text-xs text-slate-400">{notif.message}</p>
                          <div className="mt-2 flex gap-2">
                            {!notif.read && (
                              <button onClick={() => markNotificationRead(notif.id)} className="text-[10px] text-blue-400 hover:text-blue-300">Mark Read</button>
                            )}
                            <button onClick={() => deleteNotification(notif.id)} className="text-[10px] text-red-400 hover:text-red-300">Delete</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 bg-slate-950/80 text-center border-t border-slate-800">
                    <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">View All Notifications</button>
                  </div>
                </div>
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
