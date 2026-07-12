import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Laptop, Calendar, Wrench, ArrowRightLeft, Bell, User, LogOut, Menu, X 
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/employee/dashboard', icon: Home },
  { name: 'My Assets', path: '/employee/my-assets', icon: Laptop },
  { name: 'Book Resource', path: '/employee/book-resource', icon: Calendar },
  { name: 'My Bookings', path: '/employee/my-bookings', icon: Calendar },
  { name: 'Maintenance Requests', path: '/employee/maintenance', icon: Wrench },
  { name: 'Transfer Requests', path: '/employee/transfer', icon: ArrowRightLeft },
];

export default function EmployeeLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logoutUser, notifications, markNotificationRead, deleteNotification } = useAppContext();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const myNotifications = notifications?.filter(n => n.recipientRole === 'Employee' || n.recipientRole === 'All') || [];
  const unreadCount = myNotifications.filter(n => !n.read).length;

  const PageTitle = NAV_ITEMS.find(item => item.path === location.pathname)?.name || 'Profile';

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans relative">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950 pointer-events-none"></div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/60 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
              AssetFlow
            </h1>
            <p className="text-xs text-slate-500 font-medium tracking-wider uppercase mt-1">Employee Portal</p>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-4 pb-4">
          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200 truncate">{currentUser.name}</p>
              <p className="text-xs text-slate-400">{currentUser.department}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4 px-2">Menu</div>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isActive ? 'text-blue-400 bg-blue-500/10 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                {isActive && (
                  <motion.div layoutId="activeEmployeeNav" className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full" />
                )}
                <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : 'text-slate-500 group-hover:text-slate-400'}`} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800/60 space-y-2">
          <button onClick={() => navigate('/employee/profile')} className="flex items-center gap-3 w-full px-3 py-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 rounded-xl transition-colors">
            <User className="w-5 h-5 text-slate-500" />
            Profile
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors">
            <LogOut className="w-5 h-5 text-red-500/70" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen relative z-10">
        <header className="h-16 border-b border-slate-800/60 bg-slate-950/50 backdrop-blur-md flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden text-slate-400">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-slate-200 hidden sm:block">{PageTitle}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-full transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full"></span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-xl overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/30">
                      <h3 className="font-semibold text-slate-200">Notifications</h3>
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
    </div>
  );
}
