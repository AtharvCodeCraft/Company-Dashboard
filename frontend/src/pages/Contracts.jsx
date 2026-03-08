import { useState } from 'react';
import { FileText, MoreVertical, DownloadCloud, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Contracts() {
  const [contracts] = useState([
    { id: 'CON-2023-001', client: 'Acme Corp', project: 'Enterprise Dashboard', value: 45000, deadline: '2023-12-15', status: 'Active' },
    { id: 'CON-2023-002', client: 'Global Tech', project: 'Cloud Migration', value: 120000, deadline: '2023-11-20', status: 'Completed' },
    { id: 'CON-2023-003', client: 'Startup Inc', project: 'Mobile App MVP', value: 25000, deadline: '2024-01-30', status: 'Active' },
    { id: 'CON-2023-004', client: 'Mega Retail', project: 'E-commerce Redesign', value: 85000, deadline: '2023-10-15', status: 'Cancelled' },
  ]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 flex items-center w-fit"><AlertCircle className="w-3 h-3 mr-1" /> Active</span>;
      case 'Completed': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/10 text-green-500 flex items-center w-fit"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</span>;
      case 'Cancelled': return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 flex items-center w-fit">Cancelled</span>;
      default: return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-500 w-fit">{status}</span>;
    }
  };

  const totalValue = contracts.reduce((acc, curr) => acc + curr.value, 0);
  const activeValue = contracts.filter(c => c.status === 'Active').reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Business Contracts</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage external clients and project agreements.</p>
        </div>
        <button className="flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90">
          <FileText className="w-5 h-5 mr-2" />
          New Contract
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Total Contract Value</h3>
          <h2 className="text-3xl font-bold text-foreground">${totalValue.toLocaleString()}</h2>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Active Pipeline</h3>
          <h2 className="text-3xl font-bold text-blue-500">${activeValue.toLocaleString()}</h2>
        </div>
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="text-muted-foreground text-sm font-medium mb-2">Active Contracts</h3>
          <h2 className="text-3xl font-bold text-foreground">{contracts.filter(c => c.status === 'Active').length}</h2>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-foreground">
            <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Contract ID & Client</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Value</th>
                <th className="px-6 py-4 hidden sm:table-cell">Deadline</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {contracts.map(contract => (
                <tr key={contract.id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-foreground">{contract.client}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">{contract.id}</div>
                  </td>
                  <td className="px-6 py-4 font-medium">{contract.project}</td>
                  <td className="px-6 py-4 font-semibold">${contract.value.toLocaleString()}</td>
                  <td className="px-6 py-4 hidden sm:table-cell text-muted-foreground">{contract.deadline}</td>
                  <td className="px-6 py-4">{getStatusBadge(contract.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Download PDF">
                        <DownloadCloud className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-accent rounded transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
