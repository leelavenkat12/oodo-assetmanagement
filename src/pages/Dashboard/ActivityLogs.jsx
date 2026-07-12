import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Clock, Filter, Search, Calendar, User, History } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function ActivityLogs() {
  const { activities } = useAppContext();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Activity className="w-7 h-7 text-blue-500" />
            Activity Logs
          </h1>
          <p className="text-slate-400 mt-1">Audit trail of all system activities.</p>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-800 flex flex-wrap gap-4 items-center bg-slate-900/30">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-slate-950/50 border border-slate-800 hover:bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-sm transition-colors">
              <Calendar className="w-4 h-4" /> Date
            </button>
            <button className="flex items-center gap-2 bg-slate-950/50 border border-slate-800 hover:bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-sm transition-colors">
              <User className="w-4 h-4" /> User
            </button>
            <button className="flex items-center gap-2 bg-slate-950/50 border border-slate-800 hover:bg-slate-800 text-slate-300 px-4 py-2.5 rounded-xl text-sm transition-colors">
              <Filter className="w-4 h-4" /> More
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="relative border-l-2 border-slate-800 ml-3 md:ml-4 space-y-8">
            {activities.map((log, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={log.id} 
                className="relative pl-8 md:pl-10"
              >
                <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                
                <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition-colors">
                  <p className="text-slate-200 font-medium">{log.action}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {log.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <History className="w-3.5 h-3.5" />
                      {log.time}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}
