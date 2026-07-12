import React from 'react';
import { useAppContext } from '../../context/AppContext';

export default function AssetManagerDashboard() {
  const { assets } = useAppContext();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-blue-500/10 hover:border-blue-500/30 transition-all duration-300">
          <p className="text-slate-400 font-medium mb-1">Total Assets</p>
          <h3 className="text-3xl font-bold text-slate-100">{assets?.length || 0}</h3>
        </div>
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-green-500/10 hover:border-green-500/30 transition-all duration-300">
          <p className="text-slate-400 font-medium mb-1">Allocated</p>
          <h3 className="text-3xl font-bold text-slate-100">{assets?.filter(a => a.status === 'Assigned').length || 0}</h3>
        </div>
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all duration-300">
          <p className="text-slate-400 font-medium mb-1">Available</p>
          <h3 className="text-3xl font-bold text-slate-100">{assets?.filter(a => a.status === 'Available').length || 0}</h3>
        </div>
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-lg hover:shadow-amber-500/10 hover:border-amber-500/30 transition-all duration-300">
          <p className="text-slate-400 font-medium mb-1">Under Maintenance</p>
          <h3 className="text-3xl font-bold text-slate-100">{assets?.filter(a => a.status === 'Maintenance').length || 0}</h3>
        </div>
      </div>
      
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-bold text-slate-100 mb-4">Welcome to Asset Manager Dashboard</h3>
        <p className="text-slate-400">Complete asset directory and allocation tools will be available here.</p>
      </div>
    </div>
  );
}
