import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Plus, Upload, Download, QrCode, FileArchive, 
  MonitorSmartphone, Edit, Eye, X, Check, FileText, Wrench, User, Trash2
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

export default function AssetDirectory() {
  const { assets, addAsset, updateAsset, deleteAsset, users } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  
  const [newAsset, setNewAsset] = useState({
    name: '', brand: '', model: '', category: 'Laptop',
    serial: '', purchaseDate: '', price: '', warranty: '', department: 'IT', status: 'Available'
  });

  const filteredAssets = assets?.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'All' || a.category === categoryFilter;
    const matchesDept = deptFilter === 'All' || a.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesCat && matchesDept && matchesStatus;
  }) || [];

  const handleSaveAsset = (e) => {
    e.preventDefault();
    addAsset(newAsset);
    toast.success(`Asset ${newAsset.name} created successfully!`);
    setIsAddModalOpen(false);
    setNewAsset({ name: '', brand: '', model: '', category: 'Laptop', serial: '', purchaseDate: '', price: '', warranty: '', department: 'IT', status: 'Available' });
  };

  const handleDeleteAsset = (id) => {
    if(window.confirm('Are you sure you want to delete this asset?')) {
      deleteAsset(id);
      setSelectedAsset(null);
      toast.success('Asset deleted successfully');
    }
  };

  const handleMockImport = () => {
    toast.success('15 Assets Imported from CSV successfully');
    addAsset({ name: 'Imported Dell Laptop', category: 'Laptop', department: 'IT', status: 'Available' });
  };

  return (
    <div className="space-y-6 relative h-full flex flex-col">
      {/* Top Action Bar */}
      <div className="flex flex-col xl:flex-row justify-between gap-4 p-5 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl shadow-xl">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-sm text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} className="bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-sm text-slate-300 focus:border-blue-500 focus:outline-none">
              <option value="All">All Categories</option>
              <option value="Laptop">Laptop</option>
              <option value="Monitor">Monitor</option>
              <option value="Printer">Printer</option>
            </select>
            <select value={deptFilter} onChange={e=>setDeptFilter(e.target.value)} className="bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-sm text-slate-300 focus:border-blue-500 focus:outline-none">
              <option value="All">All Departments</option>
              <option value="IT">IT</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
            </select>
            <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="bg-slate-950 border border-slate-700 rounded-lg py-2 px-3 text-sm text-slate-300 focus:border-blue-500 focus:outline-none">
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Assigned">Assigned</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleMockImport} className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-700">
            <Upload className="w-4 h-4" /> Import CSV
          </button>
          <button onClick={() => toast.success('Exporting assets data...')} className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-700">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => toast.success('QR Codes generated successfully!')} className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-700">
            <QrCode className="w-4 h-4" /> Generate QR
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            <Plus className="w-4 h-4" /> Add Asset
          </button>
        </div>
      </div>

      {/* Asset Table */}
      <div className="flex-1 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
        <div className="overflow-auto flex-1 custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 z-10">
              <tr className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                <th className="p-4 pl-6 w-12"><input type="checkbox" className="rounded bg-slate-800 border-slate-700" /></th>
                <th className="p-4">Asset ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Brand</th>
                <th className="p-4">Assigned To</th>
                <th className="p-4">Department</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredAssets.length === 0 && (
                <tr><td colSpan="8" className="p-8 text-center text-slate-500">No assets found.</td></tr>
              )}
              {filteredAssets.map((asset, i) => (
                <motion.tr 
                  key={asset.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  onClick={() => setSelectedAsset(asset)}
                >
                  <td className="p-4 pl-6" onClick={e => e.stopPropagation()}><input type="checkbox" className="rounded bg-slate-800 border-slate-700" /></td>
                  <td className="p-4 text-blue-400 font-medium">{asset.id}</td>
                  <td className="p-4 font-semibold text-slate-200">{asset.name}</td>
                  <td className="p-4 text-slate-400">{asset.brand || 'N/A'}</td>
                  <td className="p-4 text-slate-300">{asset.assignedTo || '-'}</td>
                  <td className="p-4 text-slate-400">{asset.department}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      asset.status === 'Assigned' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      asset.status === 'Available' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="p-4 text-right pr-6 space-x-2">
                    <button className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors" onClick={(e) => { e.stopPropagation(); handleDeleteAsset(asset.id); }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Asset Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative z-10 custom-scrollbar"
            >
              <div className="sticky top-0 p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 z-20">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-3">
                  <Plus className="w-6 h-6 text-blue-400" />
                  Add New Asset
                </h3>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSaveAsset} className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Asset Name</label>
                    <input type="text" required value={newAsset.name} onChange={e=>setNewAsset({...newAsset, name: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="e.g. Dell Latitude 5440" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Brand</label>
                    <input type="text" value={newAsset.brand} onChange={e=>setNewAsset({...newAsset, brand: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-blue-500" placeholder="e.g. Dell" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Model</label>
                    <input type="text" value={newAsset.model} onChange={e=>setNewAsset({...newAsset, model: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-blue-500" placeholder="e.g. Latitude 5440" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Category</label>
                    <select value={newAsset.category} onChange={e=>setNewAsset({...newAsset, category: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-blue-500">
                      <option>Laptop</option>
                      <option>Monitor</option>
                      <option>Printer</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Serial Number</label>
                    <input type="text" value={newAsset.serial} onChange={e=>setNewAsset({...newAsset, serial: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-blue-500" placeholder="e.g. DL4455667788" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-400">Purchase Date</label>
                    <input type="date" value={newAsset.purchaseDate} onChange={e=>setNewAsset({...newAsset, purchaseDate: e.target.value})} className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 rounded-xl font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-3 rounded-xl font-medium text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                    Save Asset
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Asset Details Modal */}
      <AnimatePresence>
        {selectedAsset && !isAddModalOpen && (
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
              className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative z-10"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-3">
                  <MonitorSmartphone className="w-6 h-6 text-blue-400" />
                  {selectedAsset.name} <span className="text-sm font-medium text-slate-500 ml-2">{selectedAsset.id}</span>
                </h3>
                <button 
                  onClick={() => setSelectedAsset(null)}
                  className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-8 bg-slate-950/50">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-slate-300 font-semibold mb-3 flex items-center gap-2 border-b border-slate-800 pb-2">
                        <FileText className="w-4 h-4 text-blue-400" /> General Info
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="flex justify-between"><span className="text-slate-500">Brand</span><span className="font-medium text-slate-200">{selectedAsset.brand || 'N/A'}</span></p>
                        <p className="flex justify-between"><span className="text-slate-500">Model</span><span className="font-medium text-slate-200">{selectedAsset.model || 'N/A'}</span></p>
                        <p className="flex justify-between"><span className="text-slate-500">Serial</span><span className="font-medium text-slate-200">{selectedAsset.serial || 'N/A'}</span></p>
                        <p className="flex justify-between"><span className="text-slate-500">Category</span><span className="font-medium text-slate-200">{selectedAsset.category}</span></p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-slate-300 font-semibold mb-3 flex items-center gap-2 border-b border-slate-800 pb-2">
                        <User className="w-4 h-4 text-blue-400" /> Assignment
                      </h4>
                      <div className="space-y-2 text-sm">
                        <p className="flex justify-between"><span className="text-slate-500">Employee</span><span className="font-medium text-slate-200">{selectedAsset.assignedTo || '-'}</span></p>
                        <p className="flex justify-between"><span className="text-slate-500">Department</span><span className="font-medium text-slate-200">{selectedAsset.department}</span></p>
                        <p className="flex justify-between"><span className="text-slate-500">Status</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${
                            selectedAsset.status === 'Assigned' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            selectedAsset.status === 'Available' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}>
                            {selectedAsset.status}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-300">QR Code</p>
                        <p className="text-xs text-slate-500">{selectedAsset.id}</p>
                      </div>
                      <div className="w-16 h-16 bg-white p-1 rounded-md flex flex-wrap content-between justify-between">
                         <div className="w-3 h-3 bg-black"></div><div className="w-3 h-3 bg-black"></div>
                         <div className="w-3 h-3 bg-black"></div><div className="w-3 h-3 bg-black"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button onClick={() => handleDeleteAsset(selectedAsset.id)} className="px-4 py-2 bg-slate-800 hover:bg-red-500/20 text-red-400 font-medium rounded-lg transition-colors text-sm border border-transparent hover:border-red-500/20">Delete Asset</button>
                  <button onClick={() => {
                    updateAsset(selectedAsset.id, { status: selectedAsset.status === 'Available' ? 'Maintenance' : 'Available' });
                    setSelectedAsset({...selectedAsset, status: selectedAsset.status === 'Available' ? 'Maintenance' : 'Available'});
                    toast.success('Asset status updated');
                  }} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors text-sm">Toggle Maintenance</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
