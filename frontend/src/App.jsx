import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  LogOut, 
  Menu, 
  X, 
  Search, 
  Plus, 
  Edit,
  Trash2,
  ChevronRight,
  TrendingUp,
  UserPlus,
  CheckCircle2,
  Clock,
  Briefcase,
  User as UserIcon,
  Phone,
  Mail,
  ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from './api';

// --- Auth Components ---

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login/', { email, password });
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('refresh_token', res.data.refresh_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-xl mb-4">
            <Briefcase size={28} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Enter your credentials to access your leads</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              className="input-field" 
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required 
              className="input-field" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full btn-primary py-3">
            Sign In
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="text-primary-600 font-semibold hover:underline">Register here</Link>
        </p>
      </motion.div>
    </div>
  );
};

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return;
    }
    try {
      await api.post('/auth/register/', formData);
      navigate('/login');
    } catch (err) {
      const errorData = err.response?.data;
      alert("SERVER ERROR DETAILS:\n" + JSON.stringify(errorData, null, 2));
      
      if (errorData) {
        if (errorData.detail) {
          setError(errorData.detail);
        } else {
          const messages = Object.values(errorData).flat().join(' ');
          setError(messages || 'Registration failed. Check your details.');
        }
      } else {
        setError('Registration failed. Check your details.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
          <p className="text-slate-500 mt-2">Join our lead management platform</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
              <input 
                type="text" required className="input-field" 
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
              <input 
                type="text" required className="input-field" 
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input 
              type="text" required className="input-field" 
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input 
              type="email" required className="input-field" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" required className="input-field" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <input 
              type="password" required className="input-field" 
              value={formData.password2}
              onChange={(e) => setFormData({...formData, password2: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full btn-primary py-3 mt-4">
            Create Account
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

// --- Layout & Navigation ---

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: Users },
    { name: 'Profile', path: '/profile', icon: UserIcon },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-slate-200 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <span className="text-xl font-bold text-primary-600">LeadFlow</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path 
                ? 'bg-primary-50 text-primary-600 font-semibold' 
                : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} className={isSidebarOpen ? 'mr-3' : 'mx-auto'} />
              {isSidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Link to="/profile" className={`flex items-center hover:bg-slate-50 p-2 rounded-xl transition-colors ${isSidebarOpen ? 'space-x-3' : 'justify-center'}`}>
            <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
              {user.first_name?.[0] || 'U'}
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user.first_name} {user.last_name}</p>
                <p className="text-xs text-slate-500 truncate capitalize">{user.role}</p>
              </div>
            )}
          </Link>
          <button 
            onClick={handleLogout}
            className={`mt-4 w-full flex items-center p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 ${!isSidebarOpen && 'justify-center'}`}
          >
            <LogOut size={20} className={isSidebarOpen ? 'mr-3' : ''} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-bottom border-slate-200 flex items-center justify-between px-8">
          <h1 className="text-lg font-semibold text-slate-800">
            {navItems.find(i => i.path === location.pathname)?.name || 'Page'}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary-500 w-64" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

// --- Page Components ---

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/dashboard/').then(res => setStats(res.data));
  }, []);

  if (!stats) return <div className="animate-pulse flex space-x-4">Loading...</div>;

  const statCards = [
    { title: 'Total Leads', value: stats.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'New Leads', value: stats.new, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Contacted', value: stats.contacted, icon: UserPlus, color: 'text-purple-600', bg: 'bg-purple-50' },
    { title: 'Closed', value: stats.closed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.bg} ${stat.color} rounded-xl`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-medium text-slate-400 flex items-center">
                <TrendingUp size={12} className="mr-1" /> +12%
              </span>
            </div>
            <h3 className="text-slate-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-3xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="card col-span-2 p-6">
          <h3 className="font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Lead management activity tracked</p>
                    <p className="text-xs text-slate-500">{i} hours ago</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 flex flex-col justify-center items-center text-center">
          <div className="relative w-32 h-32 mb-6">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path className="text-slate-100" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-primary-500" strokeDasharray={`${stats.conversion_rate}, 100`} strokeWidth="3" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-slate-900">{stats.conversion_rate}%</span>
            </div>
          </div>
          <h4 className="font-bold text-slate-900">Conversion Rate</h4>
          <p className="text-sm text-slate-500 mt-2">Your overall success rate in closing leads</p>
        </div>
      </div>
    </div>
  );
};

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', company: '', source: '', status: 'new' });

  const fetchLeads = () => {
    api.get('/leads/').then(res => setLeads(res.data.results));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleOpenModal = (lead = null) => {
    if (lead) {
      setEditingLead(lead);
      setFormData({
        first_name: lead.first_name,
        last_name: lead.last_name,
        email: lead.email,
        company: lead.company,
        source: lead.source,
        status: lead.status
      });
    } else {
      setEditingLead(null);
      setFormData({ first_name: '', last_name: '', email: '', company: '', source: '', status: 'new' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLead) {
        await api.patch(`/leads/${editingLead.id}/`, formData);
      } else {
        await api.post('/leads/', formData);
      }
      setIsModalOpen(false);
      fetchLeads();
    } catch (err) {
      alert('Error saving lead');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/leads/${id}/`, { status: newStatus });
      fetchLeads();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const deleteLead = async (id) => {
    if (window.confirm('Delete this lead?')) {
      await api.delete(`/leads/${id}/`);
      fetchLeads();
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'contacted': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'closed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Leads Management</h2>
          <p className="text-sm text-slate-500">Organize and track your business opportunities</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center">
          <Plus size={18} className="mr-2" /> Add New Lead
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Quick Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-semibold text-xs mr-3">
                      {lead.first_name[0]}{lead.last_name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{lead.first_name} {lead.last_name}</p>
                      <p className="text-xs text-slate-500">{lead.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{lead.company}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusStyle(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-1">
                    {['new', 'contacted', 'closed'].map(s => (
                      <button 
                        key={s}
                        onClick={() => updateStatus(lead.id, s)}
                        className={`w-2 h-2 rounded-full transition-transform hover:scale-150 ${
                          lead.status === s ? 'ring-2 ring-offset-1 ring-slate-300' : ''
                        } ${
                          s === 'new' ? 'bg-blue-400' : s === 'contacted' ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        title={`Mark as ${s}`}
                      />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button onClick={() => handleOpenModal(lead)} className="p-2 text-slate-400 hover:text-primary-600 transition-colors" title="Edit Lead">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => deleteLead(lead.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors" title="Delete Lead">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 p-8"
            >
              <h3 className="text-xl font-bold text-slate-900 mb-6">{editingLead ? 'Edit Lead' : 'Add New Lead'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                    <input type="text" required className="input-field" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                    <input type="text" required className="input-field" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" required className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company</label>
                  <input type="text" className="input-field" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
                    <input type="text" className="input-field" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select className="input-field" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-8">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" className="btn-primary px-8">{editingLead ? 'Update Lead' : 'Save Lead'}</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', phone_number: '' });
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const fetchProfile = () => {
    api.get('/auth/me/').then(res => {
      setProfile(res.data);
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        phone_number: user.phone_number || ''
      });
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.patch('/auth/me/', formData);
      const updatedUser = { ...user, ...res.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setProfile(res.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return <div className="flex justify-center p-12">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 border-4 border-white shadow-lg">
            {user.first_name?.[0] || 'U'}
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="absolute bottom-4 right-0 p-2 bg-white rounded-full shadow-md border border-slate-100 text-slate-500 hover:text-primary-600 transition-colors"
          >
            <Edit size={16} />
          </button>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{user.first_name} {user.last_name}</h2>
        <p className="text-slate-500 capitalize">{user.role}</p>
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.form 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            onSubmit={handleUpdate} 
            className="card p-8 space-y-6"
          >
            <h3 className="font-bold text-slate-900 text-lg">Edit Profile</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                <input type="text" className="input-field" value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                <input type="text" className="input-field" value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input type="text" className="input-field" value={formData.phone_number} onChange={e => setFormData({...formData, phone_number: e.target.value})} />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary px-8">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="grid gap-6"
          >
            <div className="card p-6 flex items-center space-x-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Mail size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Email Address</p>
                <p className="text-slate-900 font-semibold">{user.email}</p>
              </div>
            </div>

            <div className="card p-6 flex items-center space-x-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <ShieldCheck size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Account Role</p>
                <p className="text-slate-900 font-semibold capitalize">{user.role}</p>
              </div>
            </div>

            <div className="card p-6 flex items-center space-x-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Phone size={20} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Phone Number</p>
                <p className="text-slate-900 font-semibold">{user.phone_number || 'Not provided'}</p>
              </div>
            </div>

            <div className="mt-4 p-6 bg-primary-50 rounded-2xl border border-primary-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-primary-900">Security</h4>
                <p className="text-sm text-primary-700">Manage your password and security settings</p>
              </div>
              <button className="btn-primary">Manage</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App ---

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/leads" element={<ProtectedRoute><LeadList /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
