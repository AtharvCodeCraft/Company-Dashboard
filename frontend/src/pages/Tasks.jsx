import { useState, useEffect } from 'react';
import { Plus, Clock, Search, Loader2 } from 'lucide-react';
import api from '../utils/api';
import Modal from '../components/Modal';

function TaskForm({ onClose, onTaskCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Todo',
    priority: 'Medium',
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/tasks', formData);
      onTaskCreated(data);
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
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
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Description</label>
        <textarea 
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none h-24"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Priority</label>
          <select 
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Urgent</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Status</label>
          <select 
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
          >
            <option>Todo</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>
      </div>
      <button 
        disabled={loading}
        type="submit" 
        className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center"
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Create Task
      </button>
    </form>
  );
}

const mockTasks = [
  { id: '1', title: 'Design Landing Page', description: 'Create high fidelity wireframes for new SaaS homepage.', status: 'Todo', priority: 'High', assignee: 'Sarah C.' },
  { id: '2', title: 'API Integration', description: 'Connect frontend to REST endpoints', status: 'In Progress', priority: 'Urgent', assignee: 'Jane M.' },
  { id: '3', title: 'Setup GitHub Actions', description: 'Implement CI/CD pipeline', status: 'Completed', priority: 'Medium', assignee: 'Mike R.' },
  { id: '4', title: 'User Onboarding Flow', description: 'Design email sequence and modal tutorials', status: 'Todo', priority: 'Low', assignee: 'Alex B.' },
];

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks(mockTasks);
    } 
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskCreated = (newTask) => {
    setTasks([newTask, ...tasks]);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'Urgent': return 'bg-red-500/10 text-red-500';
      case 'High': return 'bg-orange-500/10 text-orange-500';
      case 'Medium': return 'bg-blue-500/10 text-blue-500';
      case 'Low': return 'bg-gray-500/10 text-gray-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    const taskId = e.dataTransfer.getData('taskId');
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        // Will need real API update call here
        return { ...task, status: targetStatus };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const renderColumn = (status, title) => {
    const columnTasks = tasks.filter(t => t.status === status);
    
    return (
      <div 
        className="flex-1 min-w-[300px] bg-muted/30 rounded-xl p-4 border border-border flex flex-col h-full"
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, status)}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground flex items-center">
            {title}
            <span className="ml-2 bg-background border border-border px-2 py-0.5 rounded-full text-xs font-bold w-6 h-6 flex items-center justify-center">
              {columnTasks.length}
            </span>
          </h3>
          <button className="text-muted-foreground hover:text-foreground p-1 transition-colors"><Plus className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
          {columnTasks.map(task => (
            <div 
              key={task.id} 
              draggable 
              onDragStart={(e) => handleDragStart(e, task.id)}
              className="bg-card border border-border p-4 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
                <button className="text-muted-foreground hover:text-foreground"><span className="sr-only">Options</span>...</button>
              </div>
              <h4 className="font-bold text-foreground text-sm mb-1 line-clamp-2">{task.title}</h4>
              <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{task.description}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>2 days left</span>
                </div>
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] text-primary font-bold border border-primary/30" title={task.assignee}>
                  {task.assignee.charAt(0)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Kanban Board</h1>
          <p className="text-muted-foreground text-sm mt-1">Track task progress and assign work.</p>
        </div>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Filter tasks..." 
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Task
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 items-stretch select-none">
        {renderColumn('Todo', 'To Do')}
        {renderColumn('In Progress', 'In Progress')}
        {renderColumn('Completed', 'Done')}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <TaskForm onClose={() => setIsModalOpen(false)} onTaskCreated={handleTaskCreated} />
      </Modal>
    </div>
  );
}
