import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { MonitorSmartphone, Users, CheckCircle, Clock } from 'lucide-react';

export default function DepartmentDashboard() {
  const { currentUser, assets, users } = useAppContext();
  
  // Department specific stats
  const deptAssets = assets?.filter(a => a.department === currentUser?.department) || [];
  const deptUsers = users?.filter(u => u.department === currentUser?.department) || [];
  
  const allocated = deptAssets.filter(a => a.status === 'Assigned').length;
  const available = deptAssets.filter(a => a.status === 'Available').length;
  const maintenance = deptAssets.filter(a => a.status === 'Maintenance').length;

  const statCards = [
    { title: 'Department Assets', value: deptAssets.length, icon: MonitorSmartphone, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { title: 'Allocated Assets', value: allocated, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    { title: 'Available Assets', value: available, icon: MonitorSmartphone, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { title: 'Pending Requests', value: 5, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-slate-100">Welcome, {currentUser?.name} 👋</h2>
        <p className="text-slate-400 mt-1">Role: {currentUser?.role} • Department: {currentUser?.department}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`bg-slate-900/80 backdrop-blur border ${stat.border} rounded-2xl p-6 shadow-lg transition-all duration-300 relative overflow-hidden group`}
            >
              <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity ${stat.bg.replace('/10', '')}`}></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <p className="text-slate-400 font-medium mb-2">{stat.title}</p>
                  <h3 className="text-4xl font-bold text-slate-100">{stat.value}</h3>
                </div>
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-100 mb-6 border-b border-slate-800 pb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
              <div>
                <p className="text-slate-200 font-medium">Laptop allocated to Neha</p>
                <p className="text-slate-500 text-sm">Today, 10:30 AM</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
              <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
              <div>
                <p className="text-slate-200 font-medium">Projector booking approved</p>
                <p className="text-slate-500 text-sm">Yesterday, 2:15 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors">
              <div className="w-2 h-2 mt-2 rounded-full bg-purple-500"></div>
              <div>
                <p className="text-slate-200 font-medium">Maintenance request completed</p>
                <p className="text-slate-500 text-sm">Yesterday, 11:00 AM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-100 mb-6 border-b border-slate-800 pb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium hover:bg-blue-500/20 hover:scale-[1.02] transition-all">
              Approve Allocation
            </button>
            <button className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-medium hover:bg-purple-500/20 hover:scale-[1.02] transition-all">
              Approve Transfer
            </button>
            <button className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-medium hover:bg-green-500/20 hover:scale-[1.02] transition-all">
              Book Resource
            </button>
            <button className="p-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-medium hover:bg-slate-700 hover:scale-[1.02] transition-all">
              View Assets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
