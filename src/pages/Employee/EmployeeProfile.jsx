import React, { useRef, useState } from 'react';
import { User, Mail, Building, Key, Camera, Save } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

export default function EmployeeProfile() {
  const { currentUser, updateUser, resetUserPassword } = useAppContext();
  const [isSaving, setIsSaving] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const photoInputRef = useRef(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match!');
      return;
    }
    if (passwords.current !== (currentUser.password || 'password123')) {
      toast.error('Current password is incorrect.');
      return;
    }
    
    setIsSaving(true);
    resetUserPassword(currentUser.email, passwords.new);
    toast.success('Password updated successfully!');
    setPasswords({ current: '', new: '', confirm: '' });
    setIsSaving(false);
  };

  const handlePhotoChange = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const maxSize = 256;
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
        updateUser(currentUser.id, { photo: canvas.toDataURL('image/jpeg', 0.82) });
        toast.success('Profile photo updated.');
      };
      image.onerror = () => toast.error('That image could not be opened.');
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  if (!currentUser) return null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <User className="w-7 h-7 text-blue-500" />
          My Profile
        </h1>
        <p className="text-slate-400 mt-1">Manage your personal information and security settings.</p>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-800 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-slate-800 border-4 border-slate-900 shadow-xl flex items-center justify-center text-5xl font-bold text-slate-500 overflow-hidden group">
              {currentUser.photo ? <img src={currentUser.photo} alt="Profile" className="w-full h-full object-cover" /> : currentUser.name.charAt(0)}
              <button type="button" onClick={() => photoInputRef.current?.click()} className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6 text-white mb-1" />
                <span className="text-xs text-white font-medium">Change</span>
              </button>
              <input ref={photoInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
            </div>
          </div>
          
          <div className="text-center md:text-left z-10">
            <h2 className="text-2xl font-bold text-slate-100">{currentUser.name}</h2>
            <p className="text-blue-400 font-medium mb-4">{currentUser.role} • {currentUser.department}</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <span className="flex items-center gap-2 text-sm text-slate-400 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800">
                <Mail className="w-4 h-4" /> {currentUser.email}
              </span>
              <span className="flex items-center gap-2 text-sm text-slate-400 bg-slate-950/50 px-3 py-1.5 rounded-lg border border-slate-800">
                <Building className="w-4 h-4" /> ID: EMP-{currentUser.id.replace('u','')}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8">
          <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-500" />
            Security Settings
          </h3>
          
          <form onSubmit={handlePasswordChange} className="max-w-md space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Current Password</label>
              <input 
                type="password"
                required
                value={passwords.current}
                onChange={e => setPasswords({...passwords, current: e.target.value})}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
              <input 
                type="password"
                required
                value={passwords.new}
                onChange={e => setPasswords({...passwords, new: e.target.value})}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Confirm New Password</label>
              <input 
                type="password"
                required
                value={passwords.confirm}
                onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500" 
              />
            </div>
            <button 
              type="submit"
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl px-6 py-2.5 mt-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] flex items-center gap-2 disabled:opacity-70"
            >
              {isSaving ? <span className="animate-spin text-lg">↻</span> : <Save className="w-4 h-4" />}
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
