import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, Plus, Download, Upload, QrCode, Search, Filter, MoreHorizontal, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

export default function Assets() {
  const { assets, categories, departments, addAsset, deleteAsset, organizationSettings } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [qrAsset, setQrAsset] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    assetId: `AST-00${Math.floor(Math.random() * 900) + 100}`,
    category: 'Select Category',
    department: 'Select Department',
    status: 'Available',
    assignedTo: '',
  });

  const handleSave = () => {
    if (!formData.name || formData.category === 'Select Category' || formData.department === 'Select Department') {
      toast.error('Please fill required fields');
      return;
    }
    addAsset({
      ...formData,
      purchaseDate: new Date().toISOString().split('T')[0],
      warranty: 'Valid till 2030'
    });
    toast.success('Asset added successfully!');
    setShowModal(false);
    setFormData({
      name: '',
      assetId: `AST-00${Math.floor(Math.random() * 900) + 100}`,
      category: 'Select Category',
      department: 'Select Department',
      status: 'Available',
      assignedTo: '',
    });
  };

  const handleImport = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const lines = String(reader.result).trim().split(/\r?\n/);
      const headers = lines.shift().split(',').map(header => header.trim().toLowerCase());
      const imported = lines.map((line, index) => {
        const values = line.split(',').map(value => value.trim());
        const row = Object.fromEntries(headers.map((header, column) => [header, values[column] || '']));
        return { name: row.name || `Imported Asset ${index + 1}`, assetId: row.assetid || row.id || `AST-IMP-${Date.now() + index}`, category: row.category || 'Laptop', department: row.department || 'Inventory', status: row.status || 'Available', assignedTo: row.assignedto || null, purchaseDate: row.purchasedate || new Date().toISOString().slice(0, 10), warranty: row.warranty || 'Not specified' };
      }).filter(asset => asset.name);
      imported.forEach(addAsset);
      toast.success(`${imported.length} asset${imported.length === 1 ? '' : 's'} imported successfully`);
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const headers = ['assetId', 'name', 'category', 'department', 'status', 'assignedTo', 'purchaseDate', 'warranty'];
    const csv = [headers.join(','), ...assets.map(asset => headers.map(key => `"${String(asset[key] || '').replaceAll('"', '""')}"`).join(','))].join('\n');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    link.download = 'assetflow-assets.csv';
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('Assets exported to CSV');
  };

  const filteredAssets = assets.filter(asset => {
    const term = searchTerm.toLowerCase();
    return (!term || [asset.name, asset.assetId, asset.assignedTo].filter(Boolean).some(value => value.toLowerCase().includes(term))) &&
      (categoryFilter === 'All' || asset.category === categoryFilter) &&
      (statusFilter === 'All' || asset.status === statusFilter);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Laptop className="w-7 h-7 text-blue-500" />
            Assets Management
          </h1>
          <p className="text-slate-400 mt-1">Track and manage all company equipment.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <input ref={fileInputRef} type="file" accept=".csv,text/csv" onChange={handleImport} className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors">
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button onClick={handleExport} className="bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Asset
          </button>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/30">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search assets by name, ID, or owner..." value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button onClick={() => setShowFilters(!showFilters)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-sm transition-colors">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl text-sm transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
          </div>
        </div>
        {showFilters && <div className="px-4 pb-4 flex flex-wrap gap-3 bg-slate-900/30"><select value={categoryFilter} onChange={event => setCategoryFilter(event.target.value)} className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm"><option value="All">All categories</option>{categories.map(category => <option key={category.id} value={category.name}>{category.name}</option>)}</select><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm"><option value="All">All statuses</option><option>Available</option><option>Assigned</option><option>Maintenance</option></select><button onClick={() => { setSearchTerm(''); setCategoryFilter('All'); setStatusFilter('All'); }} className="text-sm text-blue-400">Clear filters</button></div>}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-sm whitespace-nowrap">
                <th className="px-6 py-4 font-medium">Asset Details</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Assigned To</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={asset.id} 
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400">
                        <Laptop className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-200">{asset.name}</p>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{asset.assetId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{asset.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      asset.status === 'Assigned' 
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {asset.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                          {asset.assignedTo.charAt(0)}
                        </div>
                        <span className="text-sm text-slate-300">{asset.assignedTo}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{asset.department}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => organizationSettings?.qrEnabled ? setQrAsset(asset) : toast.error('QR Codes are disabled in Organization Setup')} className="p-2 text-slate-400 hover:text-violet-300 hover:bg-violet-500/10 rounded-lg transition-colors" title="View QR and asset details">
                        <QrCode className="w-4 h-4" />
                      </button>
                      <div className="relative group/menu">
                        <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 mt-2 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                          <button onClick={() => {
                            if(window.confirm('Delete this asset?')) {
                              deleteAsset(asset.id);
                              toast.success('Asset deleted!');
                            }
                          }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 transition-colors">Delete</button>
                        </div>
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredAssets.length === 0 && <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-500">No assets match these filters.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {qrAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center mb-5"><h3 className="text-xl font-bold">Asset QR Details</h3><button onClick={() => setQrAsset(null)} className="text-slate-400 hover:text-white"><X /></button></div>
              <div className="flex gap-5 items-center"><img className="w-32 h-32 bg-white rounded-xl p-2" alt={`QR code for ${qrAsset.assetId}`} src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(JSON.stringify({ assetId: qrAsset.assetId, name: qrAsset.name, category: qrAsset.category, status: qrAsset.status, assignedTo: qrAsset.assignedTo || 'Unassigned', department: qrAsset.department }))}`} /><div className="space-y-2 text-sm"><p className="font-bold text-lg">{qrAsset.name}</p><p className="text-violet-300 font-mono">{qrAsset.assetId}</p><p className="text-slate-400">Category: <span className="text-slate-200">{qrAsset.category}</span></p><p className="text-slate-400">Status: <span className="text-slate-200">{qrAsset.status}</span></p><p className="text-slate-400">Assigned to: <span className="text-slate-200">{qrAsset.assignedTo || 'Unassigned'}</span></p><p className="text-slate-400">Department: <span className="text-slate-200">{qrAsset.department}</span></p></div></div>
              <p className="text-xs text-slate-500 mt-5">This is a real QR code. Scanning it shows this asset’s identification and assignment details.</p>
            </motion.div>
          </div>
        )}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl"
            >
              <h3 className="text-lg font-bold text-slate-100 mb-4">Add Asset</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Asset Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Asset ID (Auto)</label>
                    <input 
                      type="text" 
                      disabled
                      value={formData.assetId}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-500" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Category</label>
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 appearance-none"
                    >
                      <option>Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Department</label>
                    <select 
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 appearance-none"
                    >
                      <option>Select Department</option>
                      {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>
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
                    Save Asset
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
