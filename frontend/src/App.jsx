import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Tasks from './pages/Tasks';
import Attendance from './pages/Attendance';
import SalesProducts from './pages/SalesProducts';
import Tickets from './pages/Tickets';
import Contracts from './pages/Contracts';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes inside Layout */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="projects" element={<div className="p-6"><h1 className="text-3xl font-bold text-foreground">Projects</h1><p className="text-muted-foreground mt-2">Manage your project pipeline.</p></div>} />
          <Route path="products" element={<SalesProducts />} />
          <Route path="sales" element={<SalesProducts />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="contracts" element={<Contracts />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
