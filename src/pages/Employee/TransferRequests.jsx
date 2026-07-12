import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft, Plus, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

export default function TransferRequests() {
  const { transferRequests, assets, currentUser, users, requestTransfer } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  
  const myAssets = assets.filter(a => a.assignedTo === currentUser?.name);
  const myRequests = transferRequests;

  const [formData, setFormData] = useState({ asset: '', transferTo: '', reason: '' });

  const handleSubmit = () => {
    if (!formData.asset || !formData.transferTo || !formData.reason) {
      toast.error('Please fill in all details');
      return;
    }
    requestTransfer({
      assetName: formData.asset,
      transferTo: formData.transferTo,
      reason: formData.reason,
      from: currentUser?.name
    });
    toast.success('Transfer request submitted successfully!');
    setShowModal(false);
    setFormData({ asset: '', transferTo: '', reason: '' });
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <ArrowRightLeft className="w-7 h-7 text-purple-500" />
            Transfer Requests
          </h1>
          <p className="text-slate-400 mt-1">Request transferring an asset to another employee.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl px-5 py-2.5 text-sm font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          Request Transfer
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 text-sm whitespace-nowrap">
                <th className="px-6 py-4 font-medium">Asset</th>
                <th className="px-6 py-4 font-medium">To</th>
                <th className="px-6 py-4 font-medium">Reason</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500">No transfer requests found.</td>
                </tr>
              ) : myRequests.map((req, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={req.id} 
                  className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-slate-200">{req.assetName}</td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{req.transferTo}</td>
                  <td className="px-6 py-4 text-slate-300 text-sm">{req.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      req.status === 'Rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {req.status}
                    </span>
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
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-100">Transfer Asset</h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Select Asset to Transfer</label>
                  <select 
                    value={formData.asset}
                    onChange={(e) => setFormData({...formData, asset: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500 appearance-none"
                  >
                    <option value="">-- Choose Asset --</option>
                    {myAssets.map(a => <option key={a.id} value={a.name}>{a.name}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Transfer To</label>
                  <select 
                    value={formData.transferTo}
                    onChange={(e) => setFormData({...formData, transferTo: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500 appearance-none"
                  >
                    <option value="">-- Select Employee --</option>
                    {users.filter(u => u.status === 'Active' && u.name !== currentUser?.name).map(u => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Reason for Transfer</label>
                  <textarea 
                    placeholder="E.g., Department Change..."
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-purple-500 min-h-[100px] resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl py-3 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmit}
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white rounded-xl py-3 text-sm font-medium transition-colors"
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
