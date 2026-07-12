import React, { useState } from 'react';
import { Building2, Save, Upload, Info, Settings as SettingsIcon, CreditCard } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

export default function OrganizationSetup() {
  const { organizationSettings, updateOrgSettings } = useAppContext();
  const [formData, setFormData] = useState(organizationSettings);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API save delay
    await new Promise(resolve => setTimeout(resolve, 800));
    updateOrgSettings(formData);
    toast.success('Organization settings saved successfully!');
    setIsSaving(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <Building2 className="w-7 h-7 text-blue-500" />
          Organization Setup
        </h1>
        <p className="text-slate-400 mt-1">Configure company details, asset IDs, and financial settings.</p>
      </div>

      {/* Company Information & Logo */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-900/30 flex items-center gap-3">
          <Info className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-slate-200">Company Information</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Company Name</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="ABC Technologies Pvt Ltd" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Company Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="admin@abc.com" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Phone Number</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 9876543210" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Website</label>
                <input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="www.abc.com" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">GST Number</label>
                <input type="text" name="gst" value={formData.gst} onChange={handleChange} placeholder="Optional" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500" />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 bg-slate-900/30 rounded-2xl p-6 hover:border-blue-500/50 transition-colors cursor-pointer group">
            <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-blue-500/10 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-400" />
            </div>
            <h3 className="font-medium text-slate-200 mb-1">Upload Company Logo</h3>
            <p className="text-xs text-slate-500 text-center max-w-[200px]">Used in reports, dashboards, and asset labels (PNG, JPG)</p>
          </div>
        </div>
      </div>

      {/* Office Address */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 bg-slate-900/30 flex items-center gap-3">
          <Building2 className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-slate-200">Office Address</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Address Line 1</label>
            <input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} placeholder="5th Floor, Tech Park" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Bangalore" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">State</label>
              <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="Karnataka" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Country</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="India" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Pincode</label>
              <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="560001" className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Asset Settings */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-800 bg-slate-900/30 flex items-center gap-3">
            <SettingsIcon className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-slate-200">Asset Settings</h2>
          </div>
          <div className="p-6 space-y-6 flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Asset ID Prefix</label>
                <input type="text" name="assetPrefix" value={formData.assetPrefix} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 uppercase font-mono" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Starting Number</label>
                <input type="number" name="startingNumber" value={formData.startingNumber} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 font-mono" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Number Padding</label>
              <select name="padding" value={formData.padding} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 appearance-none">
                <option value="3">3 Digits (e.g., AST-001)</option>
                <option value="4">4 Digits (e.g., AST-0001)</option>
                <option value="5">5 Digits (e.g., AST-00001)</option>
              </select>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-950/30 rounded-xl border border-slate-800">
              <div>
                <p className="font-medium text-slate-200 text-sm">Enable QR Codes</p>
                <p className="text-xs text-slate-500 mt-0.5">Automatically generate QR labels for verification</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="qrEnabled" checked={formData.qrEnabled} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-800 bg-slate-900/30 flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-semibold text-slate-200">Financial Settings</h2>
          </div>
          <div className="p-6 space-y-6 flex-1">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Financial Year</label>
              <select name="financialYear" value={formData.financialYear} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 appearance-none">
                <option value="2025-26">2025–26 (1 Apr 2025 - 31 Mar 2026)</option>
                <option value="2026-27">2026–27 (1 Apr 2026 - 31 Mar 2027)</option>
                <option value="2027-28">2027–28 (1 Apr 2027 - 31 Mar 2028)</option>
              </select>
              <p className="text-xs text-slate-500 mt-2">Used for depreciation reports and tax calculations.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Default Currency</label>
              <select name="currency" value={formData.currency} onChange={handleChange} className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 appearance-none">
                <option value="INR">₹ INR (Indian Rupee)</option>
                <option value="USD">$ USD (US Dollar)</option>
                <option value="EUR">€ EUR (Euro)</option>
                <option value="GBP">£ GBP (British Pound)</option>
              </select>
              <p className="text-xs text-slate-500 mt-2">All dashboard values and invoices will use this currency.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl px-8 py-3 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] flex items-center gap-2 disabled:opacity-70"
        >
          {isSaving ? <span className="animate-spin text-xl">↻</span> : <Save className="w-5 h-5" />}
          Save All Changes
        </button>
      </div>
    </div>
  );
}
