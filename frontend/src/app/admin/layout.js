'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { 
  FiHome, FiUsers, FiShoppingBag, FiShoppingCart, FiGrid, FiBriefcase, 
  FiFileText, FiLifeBuoy, FiSettings, FiLogOut, FiMenu, FiX, FiBell, 
  FiSearch, FiChevronDown, FiMessageSquare
} from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchNotifications();
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const checkAuth = () => {
    try {
      setLoading(true);
      
      // Vérifier le token dans localStorage
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      
      if (!token || !userStr) {
        router.push('/auth/login?redirect=/admin');
        return;
      }

      // Parser l'utilisateur
      let parsedUser;
      try {
        parsedUser = JSON.parse(userStr);
      } catch (e) {
        console.error('Error parsing user:', e);
        router.push('/auth/login?redirect=/admin');
        return;
      }

      // Check if user is admin or super_admin
      if (parsedUser?.role !== 'admin' && parsedUser?.role !== 'super_admin') {
        toast.error('Accès non autorisé');
        router.push('/dashboard');
        return;
      }
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/auth/login?redirect=/admin');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      // This would be a real API call in a production app
      // const response = await api.notifications.getAll();
      // setNotifications(response.data.notifications);
      // setUnreadCount(response.data.unread_count);
      
      // Mock data for now
      setNotifications([
        {
          id: 1,
          title: 'Nouvelle commande',
          message: 'Une nouvelle commande a été passée',
          created_at: new Date().toISOString(),
          read: false
        },
        {
          id: 2,
          title: 'Nouveau message',
          message: 'Vous avez reçu un nouveau message',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          read: false
        },
        {
          id: 3,
          title: 'Nouveau ticket',
          message: 'Un nouveau ticket de support a été créé',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          read: true
        }
      ]);
      setUnreadCount(2);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: FiHome, 
      path: '/admin' 
    },
    { 
      name: 'Utilisateurs', 
      icon: FiUsers, 
      path: '/admin/users' 
    },
    { 
      name: 'Produits', 
      icon: FiShoppingBag, 
      path: '/admin/products' 
    },
    { 
      name: 'Commandes', 
      icon: FiShoppingCart, 
      path: '/admin/orders' 
    },
    { 
      name: 'Services', 
      icon: FiGrid, 
      path: '/admin/services' 
    },
    { 
      name: 'Portfolio', 
      icon: FiBriefcase, 
      path: '/admin/portfolio' 
    },
    { 
      name: 'Blog', 
      icon: FiFileText, 
      path: '/admin/blog' 
    },
    { 
      name: 'Tickets', 
      icon: FiLifeBuoy, 
      path: '/admin/tickets' 
    },
    { 
      name: 'Messages', 
      icon: FiMessageSquare, 
      path: '/admin/messages' 
    },
    { 
      name: 'Paramètres', 
      icon: FiSettings, 
      path: '/admin/settings' 
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for mobile */}
      <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        ></div>
        
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-lg">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link href="/admin" className="flex items-center">
              <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold text-gray-900">Admin</span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                    pathname === item.path
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
            >
              <FiLogOut className="w-5 h-5 mr-3" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white shadow-lg">
        <div className="flex items-center h-16 px-4 border-b border-gray-200">
          <Link href="/admin" className="flex items-center">
            <img src="/logo.svg" alt="Logo" className="h-8 w-auto" />
            <span className="ml-2 text-xl font-bold text-gray-900">Admin</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                  pathname === item.path
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
          >
            <FiLogOut className="w-5 h-5 mr-3" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block relative w-64">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              
              {/* Notifications */}
              <div className="relative">
                <button className="relative p-1 text-gray-500 hover:text-gray-700 focus:outline-none">
                  <FiBell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notifications dropdown */}
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block">
                  <div className="p-3 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-xs text-primary hover:text-primary-dark"
                        >
                          Tout marquer comme lu
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        Aucune notification
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => markNotificationAsRead(notification.id)}
                        >
                          <div className="flex items-start">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notification.created_at).toLocaleString()}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="p-2 border-t border-gray-200">
                    <button className="w-full text-center text-xs text-primary hover:text-primary-dark">
                      Voir toutes les notifications
                    </button>
                  </div>
                </div>
              </div>
              
              {/* User menu */}
              <div className="relative">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        {user?.first_name?.charAt(0) || 'A'}
                      </span>
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.first_name} {user?.last_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Administrateur
                    </div>
                  </div>
                  <FiChevronDown className="hidden md:block w-4 h-4 text-gray-500" />
                </button>
                
                {/* User dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 hidden group-hover:block">
                  <div className="py-1">
                    <Link
                      href="/admin/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profil
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Paramètres
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}