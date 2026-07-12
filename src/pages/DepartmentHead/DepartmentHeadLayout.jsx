import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  MonitorSmartphone, 
  ArrowRightLeft,
  CalendarDays,
  FileBarChart,
  Bell,
  LogOut,
  Building2,
  Search
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { AnimatedBackground } from '../../components/ui/AnimatedBackground';

export default function DepartmentHeadLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const { currentUser, logoutUser, notifications, markNotificationRead, deleteNotification, allocationRequests } = useAppContext();

  const myNotifications = notifications?.filter(n => n.recipientRole === 'Department Head' || n.recipientRole === 'All') || [];
  const unreadCount = myNotifications.filter(n => !n.read).length;
  const pendingRequests = (allocationRequests || []).filter(r => r.status === 'Pending Dept Head Approval').length;

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const menuItems = [
    { path: '/department-head/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/department-head/assets', icon: MonitorSmartphone, label: 'Department Assets' },
    { path: '/department-head/requests', icon: ArrowRightLeft, label: 'Requests' },
    { path: '/department-head/bookings', icon: CalendarDays, label: 'Bookings' },
    { path: '/department-head/reports', icon: FileBarChart, label: 'Reports' },
  ];

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex overflow-hidden">
      <AnimatedBackground />
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-slate-950/80 backdrop-blur-xl border-r border-slate-800/60 flex flex-col z-20 shrink-0"
      >
        <div className="p-6 border-b border-slate-800/60">
          <div className="flex items-center gap-3 text-blue-500 mb-6">
            <Building2 className="w-8 h-8" />
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">AssetFlow</h1>
          </div>
          
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
            <p className="font-semibold text-slate-200">{currentUser?.name}</p>
            <p className="text-xs text-slate-400">{currentUser?.role}</p>
            <div className="mt-2 inline-block px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-400 font-medium">
              {currentUser?.department} Dept
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname.includes(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 hover:scale-[1.02]'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                <span className="font-medium flex-1">{item.label}</span>
                {item.label === 'Requests' && pendingRequests > 0 && (
                  <span className="text-xs bg-orange-500 text-white rounded-full px-2 py-0.5 font-bold">{pendingRequests}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Top Header */}
        <header className="h-20 bg-slate-950/50 backdrop-blur border-b border-slate-800 flex items-center justify-between px-8 z-30">
          <div>
            <h2 className="text-xl font-bold text-slate-100 capitalize">
              {location.pathname.split('/').pop().replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-slate-900 border border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 w-64 transition-all"
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
                  <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-950"></span>
                )}
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
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
                      <button className="text-xs text-blue-400 hover:text-blue-300 font-medium">View All</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
