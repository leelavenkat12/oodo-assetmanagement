import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import Login from './pages/Login';
import PendingApproval from './pages/PendingApproval';

// Admin Pages
import DashboardLayout from './pages/DashboardLayout';
import OrganizationSetup from './pages/Dashboard/OrganizationSetup';
import Departments from './pages/Dashboard/Departments';
import Categories from './pages/Dashboard/Categories';
import EmployeeDirectory from './pages/Dashboard/EmployeeDirectory';
import Assets from './pages/Dashboard/Assets';
import Reports from './pages/Dashboard/Reports';
import ActivityLogs from './pages/Dashboard/ActivityLogs';
import Settings from './pages/Dashboard/Settings';

// Department Head Pages
import DepartmentHeadLayout from './pages/DepartmentHead/DepartmentHeadLayout';
import DepartmentDashboard from './pages/DepartmentHead/DepartmentDashboard';
import DepartmentAssets from './pages/DepartmentHead/DepartmentAssets';
import DepartmentRequests from './pages/DepartmentHead/DepartmentRequests';

// Asset Manager Pages
import AssetManagerLayout from './pages/AssetManager/AssetManagerLayout';
import AssetManagerDashboard from './pages/AssetManager/AssetManagerDashboard';
import AssetDirectory from './pages/AssetManager/AssetDirectory';
import AssetAllocations from './pages/AssetManager/AssetAllocations';

// Employee Pages
import EmployeeLayout from './pages/Employee/EmployeeLayout';
import EmployeeHome from './pages/Employee/EmployeeHome';
import MyAssets from './pages/Employee/MyAssets';
import BookResource from './pages/Employee/BookResource';
import MyBookings from './pages/Employee/MyBookings';
import MaintenanceRequests from './pages/Employee/MaintenanceRequests';
import TransferRequests from './pages/Employee/TransferRequests';
import EmployeeProfile from './pages/Employee/EmployeeProfile';

function App() {
  return (
    <AppProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ style: { background: '#1e293b', color: '#f8fafc', border: '1px solid #334155' } }} />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          
          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<Navigate to="reports" replace />} />
            <Route path="organization-setup" element={<OrganizationSetup />} />
            <Route path="departments" element={<Departments />} />
            <Route path="categories" element={<Categories />} />
            <Route path="employee-directory" element={<EmployeeDirectory />} />
            <Route path="assets" element={<Assets />} />
            <Route path="reports" element={<Reports />} />
            <Route path="activity-logs" element={<ActivityLogs />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="/department-head" element={<DepartmentHeadLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DepartmentDashboard />} />
            <Route path="assets" element={<DepartmentAssets />} />
            <Route path="requests" element={<DepartmentRequests />} />
            <Route path="*" element={
              <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
                <h3 className="text-xl font-bold text-slate-200">Page Under Construction</h3>
                <p className="text-slate-400 mt-2">This feature is currently being developed.</p>
              </div>
            } />
          </Route>

          <Route path="/asset-manager" element={<AssetManagerLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AssetManagerDashboard />} />
            <Route path="assets" element={<AssetDirectory />} />
            <Route path="allocations" element={<AssetAllocations />} />
            <Route path="*" element={
              <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800">
                <h3 className="text-xl font-bold text-slate-200">Page Under Construction</h3>
                <p className="text-slate-400 mt-2">This feature is currently being developed.</p>
              </div>
            } />
          </Route>

          <Route path="/employee" element={<EmployeeLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EmployeeHome />} />
            <Route path="my-assets" element={<MyAssets />} />
            <Route path="book-resource" element={<BookResource />} />
            <Route path="my-bookings" element={<MyBookings />} />
            <Route path="maintenance" element={<MaintenanceRequests />} />
            <Route path="transfer" element={<TransferRequests />} />
            <Route path="profile" element={<EmployeeProfile />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
