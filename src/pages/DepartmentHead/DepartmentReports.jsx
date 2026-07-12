import React from 'react';
import { BarChart, Bar, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { BarChart3, Laptop, Wrench } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'];

export default function DepartmentReports() {
  const { assets = [], currentUser, allocationRequests = [] } = useAppContext();
  const departmentAssets = assets.filter(asset => asset.department === currentUser?.department);
  const statusData = ['Available', 'Assigned', 'Maintenance'].map(name => ({
    name,
    value: departmentAssets.filter(asset => asset.status === name).length
  }));
  const categoryData = [...new Set(departmentAssets.map(asset => asset.category))].map(name => ({
    name,
    value: departmentAssets.filter(asset => asset.category === name).length
  }));
  const pending = allocationRequests.filter(request => request.status === 'Pending Dept Head Approval').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3"><BarChart3 className="w-7 h-7 text-blue-500" />Department Reports</h1>
        <p className="text-slate-400 mt-1">Analytics for the {currentUser?.department} department.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          ['Department Assets', departmentAssets.length, Laptop, 'text-blue-400'],
          ['Pending Requests', pending, BarChart3, 'text-amber-400'],
          ['Under Maintenance', statusData.find(item => item.name === 'Maintenance')?.value || 0, Wrench, 'text-rose-400']
        ].map(([label, value, Icon, color]) => <div key={label} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex justify-between"><div><p className="text-slate-400 text-sm">{label}</p><p className="text-3xl font-bold mt-2">{value}</p></div><Icon className={`w-7 h-7 ${color}`} /></div>)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6"><h2 className="font-semibold mb-5">Assets by Category</h2><div className="h-72"><ResponsiveContainer><BarChart data={categoryData}><XAxis dataKey="name" stroke="#94a3b8" /><YAxis stroke="#94a3b8" allowDecimals={false} /><Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} /><Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6"><h2 className="font-semibold mb-5">Asset Status</h2><div className="h-72"><ResponsiveContainer><PieChart><Pie data={statusData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>{statusData.map((item, index) => <Cell key={item.name} fill={COLORS[index]} />)}</Pie><Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155' }} /></PieChart></ResponsiveContainer></div><div className="flex justify-center gap-4 text-sm text-slate-400">{statusData.map((item, index) => <span key={item.name}><i className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: COLORS[index] }} />{item.name}: {item.value}</span>)}</div></div>
      </div>
    </div>
  );
}
