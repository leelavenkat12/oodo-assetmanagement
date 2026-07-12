import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderTree, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

export default function Categories() {
  const { categories, addCategory } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    depreciationPeriod: '5 Years',
    warrantyRequired: false,
    qrEnabled: true
  });

  const handleSave = () => {
    if (!formData.name) {
      toast.error('Category name is required');
      return;
    }
    addCategory(formData);
    toast.success('Category added successfully');
    setShowModal(false);
    setFormData({ name: '', depreciationPeriod: '5 Years', warrantyRequired: false, qrEnabled: true });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <FolderTree className="w-7 h-7 text-blue-500" />
            Categories
          </h1>
          <p className="text-slate-400 mt-1">Organize and configure asset classifications.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-5 py-2.5 text-sm font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search categories..." 
              className="w-full bg-slate-950/50 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-sm">
                <th className="px-6 py-4 font-medium">Category Name</th>
                <th className="px-6 py-4 font-medium">Depreciation Period</th>
                <th className="px-6 py-4 font-medium">Warranty Required</th>
                <th className="px-6 py-4 font-medium">QR Enabled</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={cat.id} 
                  className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-200">{cat.name}</td>
                  <td className="px-6 py-4 text-slate-400">{cat.depreciationPeriod}</td>
                  <td className="px-6 py-4">
                    {cat.warrantyRequired ? (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">Yes</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs border border-slate-700">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {cat.qrEnabled ? (
                      <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">Enabled</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs border border-slate-700">Disabled</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-lg font-bold text-slate-100 mb-4">Add Category</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Category Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Laptop, Projector"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Depreciation Period</label>
                  <select 
                    value={formData.depreciationPeriod}
                    onChange={(e) => setFormData({...formData, depreciationPeriod: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 appearance-none"
                  >
                    <option>1 Year</option>
                    <option>3 Years</option>
                    <option>5 Years</option>
                    <option>10 Years</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-950/30 rounded-xl border border-slate-800">
                  <div>
                    <p className="font-medium text-slate-200 text-sm">Warranty Required</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.warrantyRequired} onChange={(e) => setFormData({...formData, warrantyRequired: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-950/30 rounded-xl border border-slate-800">
                  <div>
                    <p className="font-medium text-slate-200 text-sm">QR Enabled</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.qrEnabled} onChange={(e) => setFormData({...formData, qrEnabled: e.target.checked})} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl py-2.5 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-2.5 text-sm font-medium transition-colors"
                  >
                    Save Category
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
