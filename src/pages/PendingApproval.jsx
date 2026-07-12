import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';

export default function PendingApproval() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "Rahul"}');

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100 relative overflow-hidden p-4">
      <AnimatedBackground />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        className="w-full max-w-lg z-10"
      >
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-10 shadow-2xl text-center relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500"></div>

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 mx-auto mb-6 relative"
          >
            <div className="absolute inset-0 border-4 border-dashed border-orange-500/50 rounded-full"></div>
            <div className="absolute inset-2 border-4 border-amber-500/30 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center text-4xl">
              ⏳
            </div>
          </motion.div>

          <h1 className="text-3xl font-bold mb-2">Account Pending Approval</h1>
          
          <div className="space-y-4 text-slate-400 mt-6">
            <p className="text-lg text-slate-300">
              Hello <span className="text-white font-semibold">{user.name}</span>,
            </p>
            <p>Your account has been created successfully.</p>
            <p>It is currently waiting for approval by an administrator.</p>
            <p>You will receive an email once your account has been approved.</p>
          </div>

          <div className="mt-10 p-4 rounded-xl bg-slate-950/50 border border-slate-800 inline-flex items-center gap-3">
            <span className="text-sm font-medium text-slate-400">Current Status</span>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-sm font-medium">
              <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse"></div>
              Pending Approval
            </div>
          </div>

          <div className="mt-10">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
