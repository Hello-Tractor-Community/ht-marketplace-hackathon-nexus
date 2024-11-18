// src/components/BusinessPortal/BusinessPortal.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  LayoutDashboard,
  ShoppingBag,
  MessageSquare,
  Settings,
  User,
  PlusCircle,
  BarChart3,
  Package,
  Mail
} from 'lucide-react';
import Button from '../../../common/button/Button';
import './BusinessPortal.scss';

const BusinessPortal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { businessDetails, user } = location.state || {};
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    totalProducts: 0,
    pendingInquiries: 0,
    monthlyRevenue: 0
  });

  // Mock data for demonstration
  useEffect(() => {
    setProducts([
      { id: 1, name: 'Traditional Scarf', price: 1200, status: 'active' },
      { id: 2, name: 'Handwoven Basket', price: 850, status: 'draft' }
    ]);
    setMessages([
      { id: 1, from: 'John Doe', subject: 'Product Inquiry', date: '2024-03-15' },
      { id: 2, from: 'Admin', subject: 'Verification Complete', date: '2024-03-14' }
    ]);
    setMetrics({
      totalSales: 45,
      totalProducts: 12,
      pendingInquiries: 3,
      monthlyRevenue: 25000
    });
  }, []);

  const Dashboard = () => (
    <div className="dashboard-grid">
      <div className="metric-card">
        <div className="metric-card__header">
          <h3>Total Sales</h3>
          <BarChart3 className="metric-card__icon" />
        </div>
        <div className="metric-card__content">
          <div className="metric-card__value">{metrics.totalSales}</div>
          <p className="metric-card__trend">+20.1% from last month</p>
        </div>
      </div>
      
      <div className="metric-card">
        <div className="metric-card__header">
          <h3>Products Listed</h3>
          <Package className="metric-card__icon" />
        </div>
        <div className="metric-card__content">
          <div className="metric-card__value">{metrics.totalProducts}</div>
          <p className="metric-card__trend">Active listings</p>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-card__header">
          <h3>Pending Inquiries</h3>
          <Mail className="metric-card__icon" />
        </div>
        <div className="metric-card__content">
          <div className="metric-card__value">{metrics.pendingInquiries}</div>
          <p className="metric-card__trend">Requires response</p>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-card__header">
          <h3>Monthly Revenue</h3>
          <BarChart3 className="metric-card__icon" />
        </div>
        <div className="metric-card__content">
          <div className="metric-card__value">ETB {metrics.monthlyRevenue}</div>
          <p className="metric-card__trend">+15% from last month</p>
        </div>
      </div>
    </div>
  );

  const Portfolio = () => (
    <div className="portfolio">
      <div className="card">
        <div className="card__header">
          <h2>Business Profile</h2>
          <p>Your business information and details</p>
        </div>
        <div className="card__content">
          <div className="profile-grid">
            <div className="profile-item">
              <h3>Business Name</h3>
              <p>{businessDetails.businessName}</p>
            </div>
            <div className="profile-item">
              <h3>Business Type</h3>
              <p>{businessDetails.businessType}</p>
            </div>
            <div className="profile-item">
              <h3>Location</h3>
              <p>{businessDetails.location.city}, {businessDetails.location.country}</p>
            </div>
            <div className="profile-item">
              <h3>Categories</h3>
              <p>{businessDetails.productCategories.join(', ')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const Products = () => (
    <div className="products">
      <div className="products__header">
        <h2>Products</h2>
        <Button variant="primary" onClick={() => {}}>
          <PlusCircle className="button-icon" />
          Add Product
        </Button>
      </div>
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-card__header">
              <h3>{product.name}</h3>
              <p>ETB {product.price}</p>
            </div>
            <div className="product-card__content">
              <span className={`status-badge status-badge--${product.status}`}>
                {product.status}
              </span>
              <Button variant="secondary" onClick={() => {}}>Edit</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );




const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [socket, setSocket] = useState(null);
  const [userPresence, setUserPresence] = useState({});
  const [typingUsers, setTypingUsers] = useState({});
  const presenceManager = useRef(null);
  const typingTimeoutRef = useRef({});

  useEffect(() => {
    const newSocket = io('your-backend-url');
    setSocket(newSocket);
    
    // Initialize presence manager
    presenceManager.current = new PresenceManager(newSocket, businessDetails._id);
    presenceManager.current.startTracking();
    
    newSocket.emit('joinBusiness', businessDetails._id);
    
    // Event listeners
    newSocket.on('newMessage', handleNewMessage);
    newSocket.on('newConversation', handleNewConversation);
    newSocket.on('presenceUpdate', handlePresenceUpdate);
    newSocket.on('userTyping', handleUserTyping);
    newSocket.on('userStoppedTyping', handleUserStoppedTyping);
    
    // Activity listeners
    const recordActivity = () => {
      presenceManager.current?.recordActivity();
    };
    
    window.addEventListener('mousemove', recordActivity);
    window.addEventListener('keydown', recordActivity);
    window.addEventListener('click', recordActivity);
    window.addEventListener('scroll', recordActivity);

    return () => {
      presenceManager.current?.stopTracking();
      newSocket.disconnect();
      window.removeEventListener('mousemove', recordActivity);
      window.removeEventListener('keydown', recordActivity);
      window.removeEventListener('click', recordActivity);
      window.removeEventListener('scroll', recordActivity);
    };
  }, []);

  const handlePresenceUpdate = ({ userId, status, timestamp }) => {
    setUserPresence(prev => ({
      ...prev,
      [userId]: { status, lastActive: timestamp }
    }));
  };

  const handleUserTyping = ({ userId, conversationId }) => {
    setTypingUsers(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), userId]
    }));
  };

  const handleUserStoppedTyping = ({ userId, conversationId }) => {
    setTypingUsers(prev => ({
      ...prev,
      [conversationId]: (prev[conversationId] || []).filter(id => id !== userId)
    }));
  };

  const emitTypingStatus = (isTyping, conversationId) => {
    if (!socket) return;

    if (isTyping) {
      socket.emit('typing', { conversationId });
      
      // Clear existing timeout
      if (typingTimeoutRef.current[conversationId]) {
        clearTimeout(typingTimeoutRef.current[conversationId]);
      }
      
      // Set new timeout
      typingTimeoutRef.current[conversationId] = setTimeout(() => {
        socket.emit('stopTyping', { conversationId });
      }, 2000);
    }
  };

  // Updated ChatWindow component
  return (
    <div className="messages h-full flex">
      <div className="w-1/3 border-r">
        <ConversationList
          conversations={conversations}
          onSelect={setSelectedConversation}
          selectedId={selectedConversation?._id}
          userPresence={userPresence}
          typingUsers={typingUsers}
        />
      </div>
      <div className="flex-1">
        <ChatWindow
          conversation={selectedConversation}
          onSendMessage={handleSendMessage}
          userPresence={userPresence}
          typingUsers={typingUsers[selectedConversation?._id] || []}
          onTyping={(isTyping) => emitTypingStatus(isTyping, selectedConversation?._id)}
        />
      </div>
    </div>
  );
};

  const Settings = () => (
    <div className="settings">
      <div className="card">
        <div className="card__header">
          <h2>Business Settings</h2>
          <p>Update your business information and preferences</p>
        </div>
        <div className="card__content">
          <div className="settings-form">
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="business-portal">
      <div className="portal-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar__header">
            <h1>Business Portal</h1>
            <p>{businessDetails?.businessName}</p>
          </div>
          <nav className="sidebar__nav">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'portfolio', label: 'Portfolio', icon: User },
              { id: 'products', label: 'Products', icon: ShoppingBag },
              { id: 'messages', label: 'Messages', icon: MessageSquare },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-item ${activeTab === item.id ? 'nav-item--active' : ''}`}
              >
                <item.icon className="nav-item__icon" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'portfolio' && <Portfolio />}
          {activeTab === 'products' && <Products />}
          {activeTab === 'messages' && <Messages />}
          {activeTab === 'settings' && <Settings />}
        </main>
      </div>
    </div>
  );
};

export default BusinessPortal;