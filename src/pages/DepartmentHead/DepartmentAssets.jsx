import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MonitorSmartphone, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export default function DepartmentAssets() {
  const { currentUser, assets } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);

  // Get only department assets
  const deptAssets = assets?.filter(a => a.department === currentUser?.department) || [];

  const filteredAssets = deptAssets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search department assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-lg"
          />
        </div>
        <button className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 hover:bg-slate-800 text-slate-300 px-4 py-3 rounded-xl transition-all shadow-lg hover:scale-[1.02]">
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </button>
      </div>

      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-sm font-medium uppercase tracking-wider">
                <th className="p-4 pl-6">Asset</th>
                <th className="p-4">ID</th>
                <th className="p-4">Assigned To</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredAssets.map((asset, i) => (
                <motion.tr 
                  key={asset.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <MonitorSmartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-200">{asset.name}</p>
                        <p className="text-xs text-slate-500">{asset.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-400 font-medium">{asset.id}</td>
                  <td className="p-4 text-slate-300">{asset.assignedTo || '-'}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      asset.status === 'Assigned' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      asset.status === 'Available' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6">
                    <button 
                      onClick={() => setSelectedAsset(asset)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition-all hover:scale-[1.05]"
                    >
                      View Details
                    </button>
                  </td>
                </motion.tr>
              ))}
              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    No assets found in your department.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAsset(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative z-10"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-3">
                  <MonitorSmartphone className="w-6 h-6 text-blue-400" />
                  Asset Details
                </h3>
                <button 
                  onClick={() => setSelectedAsset(null)}
                  className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Asset Name</p>
                    <p className="font-medium text-slate-200">{selectedAsset.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Asset ID</p>
                    <p className="font-medium text-slate-200">{selectedAsset.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Brand</p>
                    <p className="font-medium text-slate-200">Dell / HP</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Model</p>
                    <p className="font-medium text-slate-200">Standard</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Assigned To</p>
                    <p className="font-medium text-slate-200">{selectedAsset.assignedTo || 'Unassigned'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-block mt-1 ${
                      selectedAsset.status === 'Assigned' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      selectedAsset.status === 'Available' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {selectedAsset.status}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-800">
                  <p className="text-sm text-amber-400 font-medium bg-amber-500/10 border border-amber-500/20 p-3 rounded-lg">
                    As a Department Head, you can view assets but only the Asset Manager can edit purchase details, warranty, or delete assets.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
