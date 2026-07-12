import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Laptop, Search, FileText, Wrench, RotateCcw, X, Info, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

export default function MyAssets() {
  const { assets, currentUser, categories, submitAllocationRequest, returnAsset } = useAppContext();
  const navigate = useNavigate();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [reqForm, setReqForm] = useState({ category: '', reason: '' });
  const myAssets = assets.filter(a => a.assignedTo === currentUser?.name);

  const handleSubmitRequest = () => {
    if (!reqForm.category || !reqForm.reason) {
      toast.error('Please fill all fields');
      return;
    }
    submitAllocationRequest({
      employeeName: currentUser.name,
      department: currentUser.department,
      category: reqForm.category,
      reason: reqForm.reason,
      date: new Date().toISOString(),
    });
    toast.success('Allocation request submitted! Your Dept Head will review it.');
    setShowRequestModal(false);
    setReqForm({ category: '', reason: '' });
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <Laptop className="w-7 h-7 text-blue-500" />
          My Assets
        </h1>
        <p className="text-slate-400 mt-1">View and manage equipment assigned to you.</p>
      </div>
      <div className="flex justify-end">
        <button 
          onClick={() => setShowRequestModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all"
        >
          <Laptop className="w-4 h-4" />
          Request New Asset
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/30">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search my assets..." 
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-sm whitespace-nowrap">
                <th className="px-6 py-4 font-medium">Asset Name</th>
                <th className="px-6 py-4 font-medium">Asset ID</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Assigned Date</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myAssets.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">You currently have no assets assigned.</td>
                </tr>
              ) : myAssets.map((asset, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={asset.id} 
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-slate-200">{asset.name}</td>
                  <td className="px-6 py-4 text-slate-400 font-mono text-sm">{asset.assetId}</td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{asset.category}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm">{asset.purchaseDate}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      In Use
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedAsset(asset)}
                      className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                <h3 className="text-xl font-bold text-slate-100">Asset Details</h3>
                <button onClick={() => setSelectedAsset(null)} className="text-slate-400 hover:text-slate-200 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      <div>
                        <p className="text-slate-500 mb-1">Asset Name</p>
                        <p className="text-slate-200 font-medium">{selectedAsset.name}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">Asset ID</p>
                        <p className="text-slate-200 font-medium font-mono">{selectedAsset.assetId}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">Category</p>
                        <p className="text-slate-200 font-medium">{selectedAsset.category}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">Warranty</p>
                        <p className="text-emerald-400 font-medium">{selectedAsset.warranty || 'Valid'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">Assigned Date</p>
                        <p className="text-slate-200 font-medium">{selectedAsset.purchaseDate}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-1">Condition</p>
                        <p className="text-slate-200 font-medium">Excellent</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-32 h-32 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center shrink-0 flex-col gap-2 p-2 relative group overflow-hidden">
                    {/* Mock QR Code Pattern */}
                    <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-cover bg-center opacity-80 filter invert sepia hue-rotate-[180deg]"></div>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6">
                  <h4 className="text-slate-200 font-medium mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4 text-blue-400" />
                    Additional Information
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-950/50 border border-slate-800 rounded-lg text-sm text-slate-300">
                      <FileText className="w-4 h-4 text-slate-500" /> Invoice Attached
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-950/50 border border-slate-800 rounded-lg text-sm text-slate-300">
                      <Wrench className="w-4 h-4 text-slate-500" /> 0 Maintenance History
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex gap-4">
                <button 
                  onClick={() => { navigate('/employee/maintenance', { state: { assetName: selectedAsset.name } }); setSelectedAsset(null); }}
                  className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/20 rounded-xl py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Wrench className="w-4 h-4" /> Report Issue
                </button>
                <button 
                  onClick={() => { returnAsset(selectedAsset.id); toast.success(`${selectedAsset.name} returned successfully`); setSelectedAsset(null); }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Return Asset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Request New Asset Modal */}
      <AnimatePresence>
        {showRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-100">Request New Asset</h3>
                <button onClick={() => setShowRequestModal(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Asset Category</label>
                  <select
                    value={reqForm.category}
                    onChange={e => setReqForm({ ...reqForm, category: e.target.value })}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 appearance-none"
                  >
                    <option value="">Select Category</option>
                    {(categories || []).map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                    <option value="Laptop">Laptop</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Keyboard">Keyboard</option>
                    <option value="Mouse">Mouse</option>
                    <option value="Headset">Headset</option>
                    <option value="Chair">Chair</option>
                    <option value="Desk">Desk</option>
                    <option value="Projector">Projector</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Reason for Request</label>
                  <textarea
                    value={reqForm.reason}
                    onChange={e => setReqForm({ ...reqForm, reason: e.target.value })}
                    rows={3}
                    placeholder="Explain why you need this asset..."
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-xs text-blue-300">
                  📋 Your request will be reviewed by your Department Head, then the Asset Manager.
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowRequestModal(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl py-2.5 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitRequest}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-2.5 text-sm font-medium transition-colors"
                  >
                    Submit Request
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
