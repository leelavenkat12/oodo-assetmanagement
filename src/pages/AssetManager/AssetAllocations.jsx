import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Laptop } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext';

export default function AssetAllocations() {
  const { allocationRequests, approveAllocationAssetManager, rejectAllocation } = useAppContext();

  // Filter requests that are pending Asset Manager approval
  const requests = allocationRequests?.filter(r => r.status === 'Pending Asset Manager') || [];

  const handleApprove = (req) => {
    approveAllocationAssetManager(req.id);
    toast.success(`Request ${req.id} fully approved!`);
  };

  const handleReject = (req) => {
    rejectAllocation(req.id);
    toast.error(`Request ${req.id} rejected.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Laptop className="w-8 h-8 text-blue-500" />
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Asset Allocations</h1>
          <p className="text-slate-400 mt-1">Review allocation requests approved by Department Heads.</p>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-2xl overflow-hidden shadow-xl p-6">
        <h3 className="text-xl font-bold text-slate-100 mb-6">Pending Final Approval</h3>
        
        <div className="space-y-4">
          {requests.length === 0 ? (
            <p className="text-slate-400">No pending allocation requests.</p>
          ) : (
            requests.map((req, i) => (
              <motion.div 
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-900/80 border border-slate-700 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-600 transition-all hover:shadow-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-200">{req.employeeName}</h4>
                    <span className="text-sm text-slate-500">requested</span>
                    <span className="font-semibold text-blue-400">{req.category}</span>
                  </div>
                  <p className="text-slate-400 text-sm">Reason: {req.reason} • {new Date(req.date).toLocaleDateString()}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleReject(req)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors font-medium"
                  >
                    <X className="w-4 h-4" /> Reject
                  </button>
                  <button 
                    onClick={() => handleApprove(req)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors font-medium"
                  >
                    <Check className="w-4 h-4" /> Final Approve
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
