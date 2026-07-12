import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, Shield, Bell, Mail, Database, Globe, Key, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [selectedSection, setSelectedSection] = useState(null);
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('assetflow_settings') || '{}'));
  useEffect(() => {
    document.documentElement.dataset.theme = settings['General-Theme'] || 'midnight';
    document.documentElement.dataset.background = settings['General-Background'] || 'aurora';
  }, [settings]);
  const sections = [
    {
      title: 'General',
      icon: Globe,
      description: 'Basic system configuration and localization.',
      fields: ['Theme', 'Language', 'Timezone']
    },
    {
      title: 'Security',
      icon: Shield,
      description: 'Authentication and access control.',
      fields: ['Password Policy', 'Two-Factor Auth (2FA)', 'Session Timeout', 'Login Attempts']
    },
    {
      title: 'Email',
      icon: Mail,
      description: 'SMTP server and notification templates.',
      fields: ['SMTP Configuration', 'Sender Email', 'Email Signatures']
    },
    {
      title: 'Notifications',
      icon: Bell,
      description: 'System alerts and user notifications.',
      fields: ['In-App Alerts', 'Email Summaries', 'Push Notifications']
    },
    {
      title: 'Backup & Restore',
      icon: Database,
      description: 'Database management and exports.',
      fields: ['Auto Backup Schedule', 'Manual Backup', 'Restore Data']
    },
    {
      title: 'Role Permissions',
      icon: Key,
      description: 'Manage access levels for different roles.',
      fields: ['Admin', 'Department Head', 'Asset Manager', 'Employee']
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
          <SettingsIcon className="w-7 h-7 text-blue-500" />
          System Settings
        </h1>
        <p className="text-slate-400 mt-1">Configure application preferences and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => setSelectedSection(section)}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-colors group cursor-pointer text-left"
          >
            <div className="p-6 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/10 group-hover:scale-110 transition-all">
                  <section.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-200">{section.title}</h3>
              </div>
              <p className="text-sm text-slate-400 mb-6">{section.description}</p>
              
              <div className="mt-auto">
                <ul className="space-y-2">
                  {section.fields.map((field, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-blue-500/50 transition-colors"></div>
                      {field}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-4 border-t border-slate-800/50 flex justify-end">
                  <span className="text-sm text-blue-400 font-medium group-hover:text-blue-300 transition-colors">Configure &rarr;</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedSection && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-slate-100">{selectedSection.title}</h2><button onClick={() => setSelectedSection(null)} className="text-slate-400 hover:text-white"><X /></button></div>
              <div className="space-y-4">
                {selectedSection.fields.map(field => {
                  const key = `${selectedSection.title}-${field}`;
                  if (field === 'Theme') return <label key={key} className="block text-sm text-slate-300">Theme<select value={settings[key] || 'midnight'} onChange={event => setSettings({ ...settings, [key]: event.target.value })} className="mt-1.5 w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100"><option value="midnight">Midnight</option><option value="light">Apple Light</option></select></label>;
                  if (field === 'Language') return <label key={key} className="block text-sm text-slate-300">Background<select value={settings['General-Background'] || 'aurora'} onChange={event => setSettings({ ...settings, 'General-Background': event.target.value })} className="mt-1.5 w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100"><option value="aurora">Aurora</option><option value="plain">Plain</option><option value="ocean">Ocean</option></select></label>;
                  return <label key={key} className="block text-sm text-slate-300">{field}<input value={settings[key] || ''} onChange={event => setSettings({ ...settings, [key]: event.target.value })} placeholder={`Set ${field.toLowerCase()}`} className="mt-1.5 w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 focus:outline-none focus:border-blue-500" /></label>;
                })}
              </div>
              <button onClick={() => { localStorage.setItem('assetflow_settings', JSON.stringify(settings)); toast.success(`${selectedSection.title} settings saved`); setSelectedSection(null); }} className="mt-6 w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 font-medium flex justify-center items-center gap-2"><Save className="w-5 h-5" />Save Changes</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
