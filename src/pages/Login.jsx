import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { emailService } from '../lib/emailService';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const { users, loginUser, registerUser } = useAppContext();
  
  // Modes: 'login', 'signup', 'otp'
  const [mode, setMode] = useState('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [generatedOtp, setGeneratedOtp] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const routeUser = (user) => {
    loginUser(user);
    if (user.status === 'Pending') {
      navigate('/pending-approval');
    } else if (user.role === 'Admin') {
      navigate('/admin/reports');
    } else if (user.role === 'Asset Manager') {
      navigate('/asset-manager/dashboard');
    } else if (user.role === 'Department Head') {
      navigate('/department-head/dashboard');
    } else {
      navigate('/employee/dashboard');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);

    const user = users.find((u) => u.email === email);

    if (!user) {
      setError('User not found.');
      return;
    }

    const validPassword = user.password || 'password123';
    
    if (password !== validPassword) {
      setError('Incorrect password.');
      return;
    }

    routeUser(user);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (users.find(u => u.email === email)) {
      setError('Email already exists. Please login.');
      return;
    }

    setIsLoading(true);
    
    // Generate a fake 6 digit OTP for demo
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    
    // Send email using our mock service
    await emailService.sendOTP(email, newOtp);
    
    setIsLoading(false);
    toast.success('OTP sent to ' + email);
    setMode('otp');
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const otpString = otp.join('');
    if (otpString.length < 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    if (otpString === generatedOtp || otpString === '123456') { // Allow 123456 as a backdoor for testing
      registerUser({ email, password });
      toast.success('Account created successfully!');
      
      // Notify Admin
      await emailService.sendAdminApprovalRequest('admin@abc.com', { name: email.split('@')[0], email });
      setIsLoading(false);

      // Auto-login the new user to pending page
      const newUser = {
        id: `temp_${Date.now()}`,
        name: email.split('@')[0],
        email: email,
        role: 'Employee',
        department: 'Unassigned',
        status: 'Pending',
      };
      routeUser(newUser);
    } else {
      setIsLoading(false);
      setError('Invalid OTP. Please check your email console logs.');
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
      </div>

      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center p-16 z-10 border-r border-slate-800/50 bg-slate-950/40 backdrop-blur-sm relative">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-lg space-y-8 relative z-10"
        >
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-br from-blue-400 to-indigo-600 text-transparent bg-clip-text">
              AssetFlow ERP
            </h1>
            <p className="text-xl text-slate-400 font-medium">Smart Asset Lifecycle Management</p>
          </div>

          <div className="space-y-4 pt-4">
            {[
              "Asset Tracking",
              "QR Code Enabled",
              "Department Wise Management",
              "Maintenance Tracking",
              "Enterprise Grade Security"
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="flex items-center gap-3 text-slate-300"
              >
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <span className="font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="text-slate-200 font-bold">Secure Infrastructure</h4>
                <p className="text-slate-500 text-sm">Role-based access and data encryption.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Login/Signup Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 z-10 relative">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          
          <AnimatePresence mode="wait">
            {mode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2 tracking-tight text-slate-100">Welcome Back 👋</h2>
                  <p className="text-slate-400">Sign in to your account to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 ml-1">Email</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="admin@abc.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-12 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900" />
                      <span className="text-sm text-slate-400 select-none">Remember me</span>
                    </label>
                    <a href="#" className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors">Forgot Password?</a>
                  </div>

                  {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl py-3.5 mt-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Login'}
                  </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-slate-800">
                  <p className="text-sm text-slate-400">
                    Don't have an account?{' '}
                    <button onClick={() => {
                      setMode('signup'); 
                      setError('');
                      setEmail('');
                      setPassword('');
                      setConfirmPassword('');
                    }} className="text-blue-500 font-semibold hover:text-blue-400 transition-colors">
                      Sign Up
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {mode === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2 tracking-tight text-slate-100">Create Account ✨</h2>
                  <p className="text-slate-400">Join AssetFlow to manage your work easily</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="you@company.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-12 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="Create a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-300 ml-1">Confirm Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-12 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="Repeat your password"
                      />
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl py-3.5 mt-4 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                  </button>
                </form>

                <div className="mt-8 text-center pt-6 border-t border-slate-800">
                  <p className="text-sm text-slate-400">
                    Already have an account?{' '}
                    <button onClick={() => {
                      setMode('login'); 
                      setError('');
                      setEmail('');
                      setPassword('');
                      setConfirmPassword('');
                    }} className="text-blue-500 font-semibold hover:text-blue-400 transition-colors">
                      Sign In
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {mode === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-bold mb-2 tracking-tight text-slate-100">Verify Email ✉️</h2>
                  <p className="text-slate-400">We've sent a 6-digit code to <br/><span className="text-slate-200 font-medium">{email}</span></p>
                </div>

                <form onSubmit={handleOtpSubmit} className="space-y-8">
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-10 h-12 sm:w-12 sm:h-14 bg-slate-950 border border-slate-800 rounded-xl text-center text-xl font-bold text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    ))}
                  </div>

                  {error && <p className="text-red-400 text-sm font-medium">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl py-3.5 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>Verify & Create Account <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                  <p className="text-sm text-slate-400">
                    Didn't receive the code?{' '}
                    <button onClick={handleSignup} className="text-blue-500 font-medium hover:text-blue-400 transition-colors">
                      Resend
                    </button>
                  </p>
                  <button onClick={() => setMode('signup')} className="text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors">
                    Back to Sign Up
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
