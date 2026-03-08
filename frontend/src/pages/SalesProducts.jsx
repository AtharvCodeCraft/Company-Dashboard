import { useState, useEffect } from 'react';
import { Package, TrendingUp, DollarSign, ArrowUpRight, Loader2 } from 'lucide-react';
import api from '../utils/api';
import Modal from '../components/Modal';

function ProductForm({ onClose, onProductCreated }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: 'Software'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/products', formData);
      onProductCreated(data);
      onClose();
    } catch (error) {
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Product Name</label>
        <input 
          required
          type="text" 
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" 
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Price</label>
          <input 
            required
            type="number" 
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Stock</label>
          <input 
            required
            type="number" 
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none" 
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Category</label>
        <select 
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
        >
          <option>Software</option>
          <option>Service</option>
          <option>Hardware</option>
        </select>
      </div>
      <button 
        disabled={loading}
        type="submit" 
        className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition flex items-center justify-center"
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Add Product
      </button>
    </form>
  );
}

export default function SalesProducts() {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchData = async () => {
    try {
      const [productsRes, salesRes] = await Promise.all([
        api.get('/products'),
        api.get('/sales')
      ]);
      setProducts(productsRes.data);
      setSales(salesRes.data);
    } catch (error) {
      console.error('Error fetching sales/products:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProductCreated = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sales & Products</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage inventory and track revenue operations.</p>
        </div>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90">
          Record Sale
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <DollarSign className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold text-foreground">$3,098</h3>
          <p className="text-muted-foreground text-sm">Monthly Revenue</p>
        </div>
        
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm text-center">
          <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold text-foreground">+12.5%</h3>
          <p className="text-muted-foreground text-sm">Growth vs Last Month</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm text-center">
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
            <Package className="w-6 h-6" />
          </div>
          <h3 className="text-3xl font-bold text-foreground">{products.length}</h3>
          <p className="text-muted-foreground text-sm">Active Products</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h3 className="font-semibold text-foreground">Recent Sales</h3>
            <button className="text-primary text-sm font-medium hover:underline flex items-center">
              View All <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="overflow-x-auto flex-1 p-4">
            <div className="space-y-4">
              {sales.map(sale => (
                <div key={sale.id} className="flex justify-between items-center p-3 hover:bg-muted/50 rounded-lg border border-transparent hover:border-border transition-colors">
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{sale.product}</h4>
                    <p className="text-xs text-muted-foreground">{sale.customer} • {sale.date}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground">${sale.amount}</div>
                    <div className="text-xs text-muted-foreground">Qty: {sale.qty}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border flex justify-between items-center">
            <h3 className="font-semibold text-foreground">Product Catalog</h3>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-primary text-sm font-medium hover:underline"
            >
              Add Product
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm text-foreground">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-medium">
                <tr>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-accent/50">
                    <td className="px-4 py-3">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">{p.category}</div>
                    </td>
                    <td className="px-4 py-3 font-semibold">${p.price}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${p.stock > 100 ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-500'}`}>
                        {p.stock} units
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Product">
        <ProductForm onClose={() => setIsModalOpen(false)} onProductCreated={handleProductCreated} />
      </Modal>
    </div>
  );
}
