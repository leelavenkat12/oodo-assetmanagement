import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';

export default function PendingApproval() {
  const navigate = useNavigate();
  const { logoutUser } = useAppContext();

  const handleReturn = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 text-slate-100 relative overflow-hidden">
      <AnimatedBackground />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-2xl relative z-10"
      >
        <div className="w-24 h-24 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-t-2 border-r-2 border-blue-500 opacity-50"
          ></motion.div>
          <Clock className="w-10 h-10 text-blue-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4 text-slate-100">Account Pending</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Your account has been successfully created and is currently awaiting approval from an administrator. 
          You will receive an email once your role has been assigned and your account is active.
        </p>

        <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl mb-8">
          <p className="text-sm text-slate-500 font-medium">Status Check</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-amber-500 font-semibold text-sm tracking-wide uppercase">In Review</span>
          </div>
        </div>

        <button 
          onClick={handleReturn}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl px-6 py-3 transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Login
        </button>
      </motion.div>
    </div>
  );
}
