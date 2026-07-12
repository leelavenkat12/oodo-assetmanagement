import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';
import toast from 'react-hot-toast';

const LOTTIE_ILLUSTRATION = "https://lottie.host/7e0b82b3-5777-4a00-9831-2ff3ce96f43e/8JtVZZlV7k.json";

export default function Login() {
  const navigate = useNavigate();
  const { users, loginUser, registerUser } = useAppContext();
  
  // Modes: 'login', 'signup', 'otp'
  const [mode, setMode] = useState('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const routeUser = (user) => {
    loginUser(user);
    if (user.status === 'Pending') {
      navigate('/pending-approval');
    } else if (user.role === 'Admin') {
      navigate('/admin/reports');
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

    // Checking against contextual password, or default for dummy data
    const validPassword = user.password ? user.password : 'password123';
    
    if (password !== validPassword) {
      setError('Invalid password.');
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
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
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    // Simulate successful OTP
    if (otpString === '123456') {
      registerUser({ email, password });
      toast.success('Account created successfully!');
      
      // Auto-login the new user
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
      setError('Invalid OTP. For demo use 123456.');
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1); // only 1 char
    if (!/^\d*$/.test(value)) return; // only numbers
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsGoogleLoading(false);
    
    toast.success('Successfully logged in with Google');
    
    const googleUser = {
      id: 'u999',
      name: 'Google User',
      email: 'demo@gmail.com',
      role: 'Employee',
      department: 'Marketing',
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    routeUser(googleUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 font-sans text-slate-100 overflow-hidden relative">
      <AnimatedBackground />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-5xl bg-slate-900/50 backdrop-blur-xl border border-slate-800/60 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative z-10 min-h-[600px]"
      >
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
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
                  <p className="text-slate-400">Sign in to your AssetFlow account to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
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
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="admin@abc.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                      <label className="text-sm font-medium text-slate-300">Password</label>
                      <a href="#" className="text-xs font-medium text-blue-500 hover:text-blue-400 transition-colors">Forgot password?</a>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-12 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
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

                  {error && <p className="text-red-400 text-sm font-medium ml-1">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-2xl py-3.5 mt-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-400">
                    Don't have an account?{' '}
                    <button onClick={() => {setMode('signup'); setError('');}} className="text-blue-500 font-medium hover:text-blue-400 transition-colors">
                      Create one
                    </button>
                  </p>
                </div>

                <div className="mt-6 relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                  <div className="relative px-4 bg-slate-900 text-sm text-slate-500">Or continue with</div>
                </div>

                <button onClick={handleGoogleAuth} disabled={isGoogleLoading} className="w-full mt-6 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium rounded-2xl py-3.5 transition-all flex items-center justify-center gap-3 disabled:opacity-70">
                  {isGoogleLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Sign in with Google
                    </>
                  )}
                </button>
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
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
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
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-12 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
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
                        className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-12 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        placeholder="Repeat your password"
                      />
                    </div>
                  </div>

                  {error && <p className="text-red-400 text-sm font-medium ml-1">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-2xl py-3.5 mt-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-slate-400">
                    Already have an account?{' '}
                    <button onClick={() => {setMode('login'); setError('');}} className="text-blue-500 font-medium hover:text-blue-400 transition-colors">
                      Sign in
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

                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  <div className="flex justify-between gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength="1"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-14 bg-slate-950/50 border border-slate-800 rounded-xl text-center text-xl font-bold text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    ))}
                  </div>

                  {error && <p className="text-red-400 text-sm font-medium ml-1">{error}</p>}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-2xl py-3.5 mt-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                      <>Verify & Create Account <ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center space-y-3">
                  <p className="text-sm text-slate-400">
                    Didn't receive the code?{' '}
                    <button className="text-blue-500 font-medium hover:text-blue-400 transition-colors">
                      Resend
                    </button>
                  </p>
                  <button onClick={() => setMode('signup')} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
                    Back to Sign Up
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-full md:w-1/2 bg-slate-950/80 p-8 md:p-12 hidden md:flex flex-col justify-between border-l border-slate-800/60 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
          
          <div className="relative z-10">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">AssetFlow ERP</h1>
            <p className="text-slate-400 mt-2 text-sm leading-relaxed">The unified platform to manage company assets, track inventory, and empower your workforce seamlessly.</p>
          </div>

          <div className="relative z-10 flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-sm drop-shadow-2xl opacity-90">
              <lottie-player
                src={LOTTIE_ILLUSTRATION}
                background="transparent"
                speed="1"
                loop
                autoplay
                style={{ width: '100%', height: '100%' }}
              ></lottie-player>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
