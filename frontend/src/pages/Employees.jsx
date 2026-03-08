import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Loader2 } from 'lucide-react';
import api from '../utils/api';
import Modal from '../components/Modal';

function EmployeeForm({ onClose, onEmployeeCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: '',
    department: 'Engineering',
    designation: '',
    salary: '',
    role: 'Employee'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/employees', formData);
      onEmployeeCreated(data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create employee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
          <input 
            required
            type="text" 
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Email</label>
          <input 
            required
            type="email" 
            placeholder="john@worksphere.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" 
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Employee ID</label>
          <input 
            required
            type="text" 
            placeholder="EMP-001"
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Salary</label>
          <input 
            required
            type="number" 
            placeholder="75000"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" 
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Department</label>
          <select 
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
          >
            <option>Engineering</option>
            <option>Sales</option>
            <option>Marketing</option>
            <option>HR</option>
            <option>Operations</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Designation</label>
          <input 
            required
            type="text" 
            placeholder="Software Engineer"
            value={formData.designation}
            onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" 
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">System Role</label>
        <select 
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
        >
          <option>Employee</option>
          <option>Manager</option>
          <option>Admin</option>
        </select>
      </div>
      <button 
        disabled={loading}
        type="submit" 
        className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center"
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Add Employee
      </button>
    </form>
  );
}

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get('/employees');
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEmployeeCreated = (newEmployee) => {
    setEmployees([newEmployee, ...employees]);
  };

  const filteredEmployees = employees.filter(emp => 
    emp.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    emp.department?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employee Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage team members, roles, and access.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Employee
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none text-foreground"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <table className="w-full text-left text-sm text-foreground">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4 hidden sm:table-cell">ID</th>
                    <th className="px-6 py-4">Department / Role</th>
                    <th className="px-6 py-4 hidden md:table-cell">System Role</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp._id} className="hover:bg-accent/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {emp.user?.name?.charAt(0) || '?'}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-foreground">{emp.user?.name || 'Unknown'}</div>
                            <div className="text-muted-foreground text-xs">{emp.user?.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell text-muted-foreground">
                        {emp.employeeId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-foreground">{emp.designation}</div>
                        <div className="text-muted-foreground text-xs">{emp.department}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                          {emp.user?.role || 'Guest'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2 text-muted-foreground">
                          <button className="p-1 hover:text-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                          <button className="p-1 hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredEmployees.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No employees found.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Employee">
        <EmployeeForm onClose={() => setIsModalOpen(false)} onEmployeeCreated={handleEmployeeCreated} />
      </Modal>
    </div>
  );
}
