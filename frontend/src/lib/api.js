import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Créer une instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // Changé à false pour éviter les problèmes CORS
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs de réponse
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword: (token, data) => api.post(`/auth/reset-password/${token}`, data),
};

// Users API
export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
};

// Orders API
export const ordersAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  update: (id, data) => api.put(`/orders/${id}`, data),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
};

// Services API
export const servicesAPI = {
  getAll: (params) => api.get('/services', { params }),
  getById: (id) => api.get(`/services/${id}`),
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),
  delete: (id) => api.delete(`/services/${id}`),
  requestQuote: (data) => api.post('/services/quote', data),
};

// Portfolio API
export const portfolioAPI = {
  getAll: (params) => api.get('/portfolio', { params }),
  getById: (id) => api.get(`/portfolio/${id}`),
  create: (data) => api.post('/portfolio', data),
  update: (id, data) => api.put(`/portfolio/${id}`, data),
  delete: (id) => api.delete(`/portfolio/${id}`),
  getCategories: () => api.get('/portfolio/categories'),
  addImage: (id, data) => api.post(`/portfolio/${id}/images`, data),
  deleteImage: (id, imageId) => api.delete(`/portfolio/${id}/images/${imageId}`),
};

// Blog API
export const blogAPI = {
  getPosts: (params) => api.get('/blog/posts', { params }),
  getPostById: (id) => api.get(`/blog/posts/${id}`),
  createPost: (data) => api.post('/blog/posts', data),
  updatePost: (id, data) => api.put(`/blog/posts/${id}`, data),
  deletePost: (id) => api.delete(`/blog/posts/${id}`),
  getCategories: () => api.get('/blog/categories'),
  createCategory: (data) => api.post('/blog/categories', data),
  getTags: () => api.get('/blog/tags'),
  createTag: (data) => api.post('/blog/tags', data),
};

// Tickets API
export const ticketsAPI = {
  getAll: (params) => api.get('/tickets', { params }),
  getById: (id) => api.get(`/tickets/${id}`),
  create: (data) => api.post('/tickets', data),
  update: (id, data) => api.put(`/tickets/${id}`, data),
  close: (id) => api.put(`/tickets/${id}/close`),
  addMessage: (id, data) => api.post(`/tickets/${id}/messages`, data),
  getStats: () => api.get('/tickets/stats'),
};

// Messages API
export const messagesAPI = {
  getAll: (params) => api.get('/messages', { params }),
  getById: (id) => api.get(`/messages/${id}`),
  send: (data) => api.post('/messages', data),
  markAsRead: (id) => api.put(`/messages/${id}/read`),
  markAllAsRead: () => api.put('/messages/read-all'),
  delete: (id) => api.delete(`/messages/${id}`),
  getUnreadCount: () => api.get('/messages/unread/count'),
  getConversations: () => api.get('/messages/conversations'),
};

// Contact API
export const contactAPI = {
  send: (data) => api.post('/contact', data),
  getAll: (params) => api.get('/contact', { params }),
  getById: (id) => api.get(`/contact/${id}`),
  updateStatus: (id, status) => api.put(`/contact/${id}/status`, { status }),
  reply: (id, data) => api.post(`/contact/${id}/reply`, data),
  delete: (id) => api.delete(`/contact/${id}`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadImages: (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });
    return api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteImage: (publicId) => api.delete('/upload/image', { data: { publicId } }),
};

// Stats API
export const statsAPI = {
  getDashboard: () => api.get('/stats/dashboard'),
  getSales: (params) => api.get('/stats/sales', { params }),
  getUsers: (params) => api.get('/stats/users', { params }),
  getProducts: () => api.get('/stats/products'),
  getContent: () => api.get('/stats/content'),
  getRevenue: (params) => api.get('/stats/revenue', { params }),
};

// Export par défaut avec tous les APIs
const apiClient = {
  // Instance axios de base
  ...api,
  // Tous les APIs
  auth: authAPI,
  users: usersAPI,
  products: productsAPI,
  orders: ordersAPI,
  services: servicesAPI,
  portfolio: portfolioAPI,
  blog: blogAPI,
  tickets: ticketsAPI,
  messages: messagesAPI,
  contact: contactAPI,
  upload: uploadAPI,
  stats: statsAPI,
};

export default apiClient;