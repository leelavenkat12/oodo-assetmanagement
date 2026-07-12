import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserSquare2, Search, Filter, MoreVertical, Edit2, ShieldAlert, Ban, ShieldCheck, Mail, Phone, Laptop, Clock, CheckCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

export default function EmployeeDirectory() {
  const { users, approveUser } = useAppContext();
  const [selectedUser, setSelectedUser] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [assignRole, setAssignRole] = useState('Employee');

  const handleReviewClick = (user, e) => {
    e.stopPropagation();
    setSelectedUser(user);
    setShowReviewModal(true);
  };

  const handleApprove = () => {
    approveUser(selectedUser.id, assignRole);
    setShowReviewModal(false);
    setSelectedUser(null);
    toast.success(`📧 Email Sent to ${selectedUser.email}: Account Approved!`);
  };

  const handleReject = () => {
    setShowReviewModal(false);
    setSelectedUser(null);
    toast.error(`Account rejected for ${selectedUser.name}`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* List Panel */}
      <div className={`flex-1 flex flex-col bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden ${selectedUser && !showReviewModal ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-4 border-b border-slate-800 bg-slate-900/30 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <UserSquare2 className="w-5 h-5 text-blue-500" />
              Employee Directory
            </h2>
            <button className="text-slate-400 hover:text-slate-200">
              <Filter className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by name, role, or department..." 
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {users.map((user, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              key={user.id}
              onClick={() => user.status !== 'Pending' && setSelectedUser(user)}
              className={`p-4 rounded-xl border transition-all ${
                user.status === 'Pending' ? 'bg-orange-500/5 border-orange-500/20' :
                selectedUser?.id === user.id ? 'bg-blue-600/10 border-blue-500/50' : 
                'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/30 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  user.role === 'Admin' ? 'bg-purple-500/20 text-purple-400' : 
                  user.role === 'Department Head' ? 'bg-amber-500/20 text-amber-400' : 
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-200">{user.name}</h3>
                  <p className="text-sm text-slate-400">{user.role} • {user.department}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs border ${
                    user.status === 'Pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {user.status}
                  </span>
                  {user.status === 'Pending' && (
                    <button 
                      onClick={(e) => handleReviewClick(user, e)}
                      className="text-xs bg-orange-500 hover:bg-orange-400 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                    >
                      Review
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Details Panel */}
      {selectedUser && !showReviewModal && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-96 bg-slate-900/50 border border-slate-800 rounded-2xl flex flex-col overflow-hidden"
        >
          <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/30">
            <h3 className="font-semibold text-slate-200">Employee Profile</h3>
            <button 
              onClick={() => setSelectedUser(null)}
              className="lg:hidden text-slate-400 hover:text-slate-200"
            >
              Close
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-4xl mb-4 border-4 border-slate-900 shadow-xl">
                👤
              </div>
              <h2 className="text-2xl font-bold text-slate-100">{selectedUser.name}</h2>
              <p className="text-blue-400 font-medium">{selectedUser.role}</p>
              <span className="mt-3 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm border border-slate-700">
                {selectedUser.department} Department
              </span>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50 space-y-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span className="text-sm">{selectedUser.email}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span className="text-sm">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-slate-500" />
                  <span className="text-sm">ID: EMP-2026-{selectedUser.id.replace('u','00')}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <h3 className="text-xl font-bold text-slate-100 mb-2">Employee Details</h3>
              <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800 mb-6 space-y-2">
                <p className="text-sm text-slate-400 flex justify-between">Name: <span className="text-slate-200 font-medium">{selectedUser.name}</span></p>
                <p className="text-sm text-slate-400 flex justify-between">Email: <span className="text-slate-200 font-medium">{selectedUser.email}</span></p>
                <p className="text-sm text-slate-400 flex justify-between">Department: <span className="text-slate-200 font-medium">{selectedUser.department}</span></p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Assign Role</label>
                  <select 
                    value={assignRole}
                    onChange={(e) => setAssignRole(e.target.value)}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                  >
                    <option value="Employee">Employee</option>
                    <option value="Department Head">Department Head</option>
                    <option value="Asset Manager">Asset Manager</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={handleReject}
                    className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl py-2.5 text-sm font-medium transition-colors"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={handleApprove}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
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
