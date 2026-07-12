import React, { createContext, useContext, useState, useEffect } from 'react';
import initialDummyData from '../data/dummyData.json';

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
      resources: [
        { id: 'r1', name: 'Meeting Room A', type: 'Room', status: 'Available' },
        { id: 'r2', name: 'Projector', type: 'Equipment', status: 'Available' },
        { id: 'r3', name: 'Conference Hall', type: 'Room', status: 'Booked' },
        { id: 'r4', name: 'Company Vehicle', type: 'Vehicle', status: 'Available' },
      ],
      bookings: [],
      maintenanceRequests: [],
      transferRequests: [],
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

  const loginUser = (user) => setData(prev => ({ ...prev, currentUser: user }));
  const logoutUser = () => setData(prev => ({ ...prev, currentUser: null }));
  const updateOrgSettings = (settings) => setData(prev => ({ ...prev, organizationSettings: settings }));

  const registerUser = (userData) => {
    setData(prev => {
      const newUser = {
        id: `u${Date.now()}`,
        name: userData.email.split('@')[0], // Extract name from email
        email: userData.email,
        password: userData.password, // In a real app this is hashed
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
          ...prev.activities
        ]
      };
    });
  };

  const approveUser = (userId, role) => {
    setData((prev) => ({
      ...prev,
      users: prev.users.map((u) => 
        u.id === userId ? { ...u, status: 'Active', role: role } : u
      ),
      activities: [
        { id: `l${Date.now()}`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), date: new Date().toISOString().split('T')[0], action: `Admin approved user ${prev.users.find(u => u.id === userId)?.name} as ${role}` },
        ...prev.activities
      ]
    }));
  };

  const addCategory = (category) => setData(prev => ({ ...prev, categories: [...prev.categories, { ...category, id: `c${Date.now()}` }] }));
  const addDepartment = (dept) => setData(prev => ({ ...prev, departments: [...prev.departments, { ...dept, id: `d${Date.now()}` }] }));
  const addAsset = (asset) => setData(prev => ({ ...prev, assets: [...prev.assets, { ...asset, id: `a${Date.now()}` }] }));

  const bookResource = (booking) => setData(prev => ({ ...prev, bookings: [{ ...booking, id: `b${Date.now()}`, status: 'Pending' }, ...prev.bookings] }));
  const submitMaintenance = (req) => setData(prev => ({ ...prev, maintenanceRequests: [{ ...req, id: `m${Date.now()}`, status: 'Pending' }, ...prev.maintenanceRequests] }));
  const requestTransfer = (req) => setData(prev => ({ ...prev, transferRequests: [{ ...req, id: `t${Date.now()}`, status: 'Pending' }, ...prev.transferRequests] }));

  const value = {
    ...data,
    loginUser, logoutUser, updateOrgSettings, registerUser,
    approveUser, addCategory, addDepartment, addAsset,
    bookResource, submitMaintenance, requestTransfer
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
