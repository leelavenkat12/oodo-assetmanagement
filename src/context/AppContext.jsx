import React, { createContext, useContext, useState, useEffect } from 'react';
import initialDummyData from '../data/dummyData.json';
import { emailService } from '../lib/emailService';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('assetflow_data');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      ...initialDummyData,
      currentUser: null,
      users: [
        { id: '1', name: 'Admin User', email: 'admin@abc.com', role: 'Admin', status: 'Active', department: 'Management' },
        { id: '2', name: 'Rahul', email: 'rahul@abc.com', role: 'Department Head', status: 'Active', department: 'IT' },
        { id: '3', name: 'Priya', email: 'priya@abc.com', role: 'Asset Manager', status: 'Active', department: 'Inventory' },
        { id: '4', name: 'Neha', email: 'neha@abc.com', role: 'Employee', status: 'Active', department: 'HR' }
      ],
      resources: [
        { id: 'r1', name: 'Meeting Room A', type: 'Room', status: 'Available' },
        { id: 'r2', name: 'Projector', type: 'Equipment', status: 'Available' },
        { id: 'r3', name: 'Conference Hall', type: 'Room', status: 'Booked' },
        { id: 'r4', name: 'Company Vehicle', type: 'Vehicle', status: 'Available' },
      ],
      bookings: [],
      maintenanceRequests: [],
      transferRequests: [],
      allocationRequests: [],
      notifications: [],
      organizationSettings: {
        companyName: '', email: '', phone: '', website: '', gst: '',
        addressLine1: '', city: '', state: '', country: '', pincode: '',
        assetPrefix: 'AST', startingNumber: '1000', padding: '4', qrEnabled: true,
        financialYear: '2026-27', currency: 'INR'
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('assetflow_data', JSON.stringify(data));
  }, [data]);

  const logActivity = (action) => {
    const newActivity = {
      id: `l${Date.now()}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      action
    };
    setData(prev => ({ ...prev, activities: [newActivity, ...(prev.activities || [])] }));
  };

  const addNotification = (title, message, recipientRole = 'Admin') => {
    const newNotif = {
      id: `n${Date.now()}`,
      title,
      message,
      recipientRole,
      date: new Date().toISOString(),
      read: false
    };
    setData(prev => ({ ...prev, notifications: [newNotif, ...(prev.notifications || [])] }));
  };

  const markNotificationRead = (id) => {
    setData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  };

  const deleteNotification = (id) => {
    setData(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id)
    }));
  };

  const loginUser = (user) => setData(prev => ({ ...prev, currentUser: user }));
  const logoutUser = () => setData(prev => ({ ...prev, currentUser: null }));
  const updateOrgSettings = (settings) => {
    setData(prev => ({ ...prev, organizationSettings: settings }));
    logActivity('Admin updated organization settings');
  };

  const registerUser = (userData) => {
    setData(prev => {
      const newUser = {
        id: `u${Date.now()}`,
        name: userData.email.split('@')[0],
        email: userData.email,
        password: userData.password, // Dev only
        role: 'Employee',
        department: 'Unassigned',
        status: 'Pending',
        joinDate: new Date().toISOString().split('T')[0]
      };
      return {
        ...prev,
        users: [...prev.users, newUser],
        activities: [
          { id: `l${Date.now()}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: new Date().toISOString().split('T')[0], action: `New user ${newUser.name} registered and pending approval.` },
          ...(prev.activities || [])
        ]
      };
    });
    addNotification('New Registration', `User ${userData.email} is waiting for approval.`, 'Admin');
  };

  const approveUser = async (userId, role) => {
    let userToApprove = null;
    setData((prev) => {
      userToApprove = prev.users.find(u => u.id === userId);
      return {
        ...prev,
        users: prev.users.map((u) => 
          u.id === userId ? { ...u, status: 'Active', role: role } : u
        ),
        activities: [
          { id: `l${Date.now()}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: new Date().toISOString().split('T')[0], action: `Admin approved user ${userToApprove?.name} as ${role}` },
          ...(prev.activities || [])
        ]
      };
    });
    
    // Call Node.js backend to send email
    if (userToApprove) {
      addNotification('Account Approved', `Your account has been approved as ${role}.`, role); // Generic notification for that role
      try {
        await emailService.sendUserApprovalNotification(userToApprove.email, role);
      } catch (err) {
        console.error('Failed to send approval email', err);
      }
    }
  };

  const updateUser = (userId, updates) => {
    setData(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === userId ? { ...u, ...updates } : u)
    }));
    logActivity(`Admin updated user details for ID: ${userId}`);
  };

  const deleteUser = (userId) => {
    setData(prev => ({
      ...prev,
      users: prev.users.filter(u => u.id !== userId)
    }));
    logActivity(`Admin deleted user ID: ${userId}`);
  };

  const addCategory = (category) => {
    setData(prev => ({ ...prev, categories: [...prev.categories, { ...category, id: `c${Date.now()}` }] }));
    logActivity(`Admin added category: ${category.name}`);
  };

  const deleteCategory = (id) => {
    setData(prev => ({ ...prev, categories: prev.categories.filter(c => c.id !== id) }));
    logActivity(`Admin deleted category`);
  };

  const addDepartment = (dept) => {
    setData(prev => ({ ...prev, departments: [...prev.departments, { ...dept, id: `d${Date.now()}` }] }));
    logActivity(`Admin added department: ${dept.name}`);
  };

  const deleteDepartment = (id) => {
    setData(prev => ({ ...prev, departments: prev.departments.filter(d => d.id !== id) }));
    logActivity(`Admin deleted department`);
  };

  const addAsset = (asset) => {
    setData(prev => ({ ...prev, assets: [{ ...asset, id: `AST-${Date.now().toString().slice(-4)}` }, ...prev.assets] }));
    logActivity(`Asset Manager added new asset: ${asset.name}`);
  };

  const updateAsset = (assetId, updates) => {
    setData(prev => ({
      ...prev,
      assets: prev.assets.map(a => a.id === assetId ? { ...a, ...updates } : a)
    }));
    logActivity(`Asset Manager updated asset: ${assetId}`);
  };

  const deleteAsset = (assetId) => {
    setData(prev => ({
      ...prev,
      assets: prev.assets.filter(a => a.id !== assetId)
    }));
    logActivity(`Asset Manager deleted asset: ${assetId}`);
  };

  const bookResource = (booking) => {
    setData(prev => ({ ...prev, bookings: [{ ...booking, id: `b${Date.now()}`, status: 'Pending' }, ...prev.bookings] }));
    addNotification('Resource Booking', `New booking request for ${booking.resourceName}`, 'Department Head');
  };

  const submitMaintenance = (req) => {
    setData(prev => ({ ...prev, maintenanceRequests: [{ ...req, id: `m${Date.now()}`, status: 'Pending' }, ...prev.maintenanceRequests] }));
    addNotification('Maintenance Request', `New maintenance request for ${req.assetName}`, 'Asset Manager');
  };

  const requestTransfer = (req) => {
    setData(prev => ({ ...prev, transferRequests: [{ ...req, id: `t${Date.now()}`, status: 'Pending' }, ...prev.transferRequests] }));
    addNotification('Transfer Request', `New transfer request for ${req.assetName}`, 'Department Head');
  };

  const submitAllocationRequest = (req) => {
    setData(prev => ({ ...prev, allocationRequests: [{ ...req, id: `alloc-${Date.now()}`, status: 'Pending Dept Head Approval' }, ...(prev.allocationRequests || [])] }));
    addNotification('Allocation Request', `New allocation request from ${req.employeeName}`, 'Department Head');
    logActivity(`Employee ${req.employeeName} submitted allocation request for ${req.category}`);
  };

  const approveAllocationDeptHead = (id) => {
    setData(prev => ({
      ...prev,
      allocationRequests: prev.allocationRequests.map(r => r.id === id ? { ...r, status: 'Pending Asset Manager' } : r)
    }));
    addNotification('Allocation Request Forwarded', `Dept Head approved request ${id}`, 'Asset Manager');
    logActivity(`Dept Head approved allocation request ${id}`);
  };

  const rejectAllocation = (id) => {
    setData(prev => ({
      ...prev,
      allocationRequests: prev.allocationRequests.map(r => r.id === id ? { ...r, status: 'Rejected' } : r)
    }));
    addNotification('Allocation Request Rejected', `Your request ${id} was rejected`, 'Employee');
    logActivity(`Allocation request ${id} rejected`);
  };

  const approveAllocationAssetManager = (id) => {
    setData(prev => ({
      ...prev,
      allocationRequests: prev.allocationRequests.map(r => r.id === id ? { ...r, status: 'Approved' } : r)
    }));
    addNotification('Allocation Request Approved', `Your request ${id} was approved!`, 'Employee');
    logActivity(`Asset Manager approved allocation request ${id}`);
  };

  const value = {
    ...data,
    loginUser, logoutUser, updateOrgSettings, registerUser,
    approveUser, updateUser, deleteUser,
    addCategory, deleteCategory, addDepartment, deleteDepartment,
    addAsset, updateAsset, deleteAsset,
    bookResource, submitMaintenance, requestTransfer,
    submitAllocationRequest, approveAllocationDeptHead, rejectAllocation, approveAllocationAssetManager,
    addNotification, markNotificationRead, deleteNotification
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
