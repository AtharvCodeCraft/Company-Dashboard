import { useState, useEffect } from 'react';
import { LifeBuoy, MessageSquare, Clock, CheckCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';
import Modal from '../components/Modal';

function TicketForm({ onClose, onTicketCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    customer: '',
    email: '',
    status: 'Open',
    priority: 'Medium',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/tickets', formData);
      onTicketCreated(data);
      onClose();
    } catch (error) {
      console.error('Error creating ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Title</label>
        <input 
          required
          type="text" 
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Customer Name</label>
          <input 
            required
            type="text" 
            value={formData.customer}
            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Customer Email</label>
          <input 
            required
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" 
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Description</label>
        <textarea 
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none h-24"
        />
      </div>
      <button 
        disabled={loading}
        type="submit" 
        className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center"
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Create Ticket
      </button>
    </form>
  );
}

export default function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTickets = async () => {
    try {
      const { data } = await api.get('/tickets');
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } 
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleTicketCreated = (newTicket) => {
    setTickets([newTicket, ...tickets]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'In Progress': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'Closed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Open': return <LifeBuoy className="w-4 h-4 mr-1.5" />;
      case 'In Progress': return <Clock className="w-4 h-4 mr-1.5" />;
      case 'Closed': return <CheckCircle className="w-4 h-4 mr-1.5" />;
      default: return <MessageSquare className="w-4 h-4 mr-1.5" />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customer Service</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage and resolve customer support tickets.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
        >
          New Ticket
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Ticket">
        <TicketForm onClose={() => setIsModalOpen(false)} onTicketCreated={handleTicketCreated} />
      </Modal>

      <div className="flex space-x-2 border-b border-border pb-4 overflow-x-auto">
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm whitespace-nowrap">All Tickets</button>
        <button className="px-4 py-2 text-muted-foreground hover:bg-accent rounded-lg font-medium text-sm transition whitespace-nowrap">Open (1)</button>
        <button className="px-4 py-2 text-muted-foreground hover:bg-accent rounded-lg font-medium text-sm transition whitespace-nowrap">In Progress (1)</button>
        <button className="px-4 py-2 text-muted-foreground hover:bg-accent rounded-lg font-medium text-sm transition whitespace-nowrap">Closed (1)</button>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-card hover:bg-accent/30 border border-border rounded-xl p-4 sm:p-6 shadow-sm transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-xs font-mono font-bold text-muted-foreground">{ticket.id}</span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center border ${getStatusColor(ticket.status)}`}>
                  {getStatusIcon(ticket.status)}
                  {ticket.status}
                </span>
                <span className="text-xs text-muted-foreground flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> {ticket.time}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{ticket.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">Requested by <span className="font-medium text-foreground">{ticket.customer}</span> ({ticket.email})</p>
            </div>
            
            <div className="flex items-center space-x-3 sm:border-l sm:border-border sm:pl-6">
              <div className="hidden md:flex flex-col items-end mr-4">
                <span className="text-xs text-muted-foreground mb-1">Assigned to</span>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-card bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">SC</div>
                </div>
              </div>
              <button className="px-3 py-1.5 border border-border bg-background hover:bg-accent rounded-lg text-sm font-medium transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
