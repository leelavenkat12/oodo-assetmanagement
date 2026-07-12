import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Edit2, Trash2, UserPlus, MoreVertical } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Departments() {
  const { departments, users, addDepartment, deleteDepartment, updateDepartment } = useAppContext();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', head: 'Select Head' });
  const normalizeDepartment = department => department.name.toLowerCase().replace(/\s*department\s*$/, '').trim();
  const visibleDepartments = departments.filter((department, index, all) =>
    all.findIndex(candidate => normalizeDepartment(candidate) === normalizeDepartment(department)) === index
  );

  const handleSave = () => {
    if (!formData.name || !formData.code || formData.head === 'Select Head') {
      toast.error('Please fill all fields');
      return;
    }
    if (editingDepartment) {
      updateDepartment(editingDepartment.id, formData);
      toast.success('Department updated successfully!');
    } else {
      addDepartment({
        name: formData.name,
        code: formData.code,
        head: formData.head,
        employeesCount: 0
      });
      toast.success('Department created successfully!');
    }
    setShowModal(false);
    setEditingDepartment(null);
    setFormData({ name: '', code: '', head: 'Select Head' });
  };

  const openCreateModal = () => {
    setEditingDepartment(null);
    setFormData({ name: '', code: '', head: 'Select Head' });
    setShowModal(true);
  };

  const openEditModal = (department) => {
    setEditingDepartment(department);
    setFormData({ name: department.name, code: department.code, head: department.head });
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Users className="w-7 h-7 text-blue-500" />
            Departments
          </h1>
          <p className="text-slate-400 mt-1">Manage company departments and their heads.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-5 py-2.5 text-sm font-medium flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Department
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleDepartments.map((dept, i) => (
          <motion.div
            key={dept.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 group hover:border-slate-700 transition-colors relative"
          >
            <div className="absolute top-4 right-4 relative group/menu">
              <button className="p-2 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
              <div className="absolute right-0 mt-2 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                <button onClick={() => {
                  if(window.confirm('Delete this department?')) {
                    deleteDepartment(dept.id);
                    toast.success('Department deleted!');
                  }
                }} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 transition-colors">Delete</button>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-200">{dept.name}</h3>
              <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-400 mt-2 border border-slate-700">
                {dept.code}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Department Head</span>
                <span className="text-slate-200 font-medium">{dept.head}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Employees</span>
                <span className="text-slate-200 font-medium">{users.filter(user => user.department === dept.code || normalizeDepartment({ name: user.department }) === normalizeDepartment(dept)).length}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-800/50">
              <button onClick={() => openEditModal(dept)} className="flex items-center justify-center gap-2 py-2 text-sm text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                <Edit2 className="w-4 h-4" /> Edit
              </button>
              <button onClick={() => navigate('/admin/employee-directory', { state: { department: dept.name } })} className="flex items-center justify-center gap-2 py-2 text-sm text-slate-400 hover:bg-slate-800 rounded-lg transition-colors">
                <UserPlus className="w-4 h-4" /> Employees
              </button>
            </div>
          </motion.div>
        ))}
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
              <h3 className="text-lg font-bold text-slate-100 mb-4">{editingDepartment ? 'Edit Department' : 'Create Department'}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Department Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Department Code</label>
                  <input 
                    type="text" 
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1">Department Head</label>
                  <select 
                    value={formData.head}
                    onChange={(e) => setFormData({...formData, head: e.target.value})}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
                  >
                    <option>Select Head</option>
                    {users.filter(u => u.status === 'Active').map(u => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => {
                      setShowModal(false);
                      setEditingDepartment(null);
                    }}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl py-2.5 text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-2.5 text-sm font-medium transition-colors"
                  >
                    Save
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
