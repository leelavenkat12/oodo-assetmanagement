import React from 'react';
import { motion } from 'framer-motion';
import { Laptop, Calendar, Wrench, Bell } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function EmployeeHome() {
 const context = useAppContext();
const currentUser = context.currentUser ?? {};
const assets = context.assets ?? [];
const bookings = context.bookings ?? [];
const maintenanceRequests = context.maintenanceRequests ?? [];

  const myAssetsCount = assets.filter(a => a.assignedTo === currentUser?.name).length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const activeMaintenance = maintenanceRequests.filter(m => m.status === 'In Progress' || m.status === 'Pending').length;

  const statCards = [
    { title: 'Assigned Assets', value: myAssetsCount, icon: Laptop, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Pending Bookings', value: pendingBookings, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Maintenance Requests', value: `${activeMaintenance} Active`, icon: Wrench, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: 'Recent Notifications', value: 5, icon: Bell, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-slate-100 mb-4">Good Morning, {currentUser?.name.split(' ')[0]} 👋</h1>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300">
              ID : EMP2026-{currentUser?.id.replace('u','')}
            </span>
            <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300">
              Department : {currentUser?.department}
            </span>
            <span className="px-3 py-1 bg-slate-800 border border-slate-700 rounded-full text-slate-300">
              Role : {currentUser?.role}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-start justify-between group hover:border-slate-700 transition-colors"
          >
            <div>
              <p className="text-sm text-slate-400 font-medium mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-100">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Recent Activity</h3>
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-blue-500 bg-slate-900 text-blue-500 group-[.is-active]:bg-blue-500 group-[.is-active]:text-slate-100 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
              </div>
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-4 rounded-xl border border-slate-800 bg-slate-900/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-200 text-sm">Laptop assigned successfully</span>
                  <span className="text-xs text-slate-500">Yesterday</span>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-slate-700 bg-slate-900 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
              </div>
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-4 rounded-xl border border-slate-800 bg-slate-900/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-200 text-sm">Meeting Room booked</span>
                  <span className="text-xs text-slate-500">2 days ago</span>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-5 h-5 rounded-full border border-slate-700 bg-slate-900 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
              </div>
              <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-4 rounded-xl border border-slate-800 bg-slate-900/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-200 text-sm">Maintenance request approved</span>
                  <span className="text-xs text-slate-500">3 days ago</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">You're all caught up!</h3>
          <p className="text-sm text-slate-400">No urgent pending tasks or assets requiring immediate attention.</p>
        </div>
      </div>
    </div>
  );
}
