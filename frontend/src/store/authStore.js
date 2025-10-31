import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '@/lib/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Set user and token
      setAuth: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
        set({ user, token, isAuthenticated: true });
      },

      // Login
      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.login(credentials);
          const { user, token } = response.data.data;
          get().setAuth(user, token);
          return { success: true, user };
        } catch (error) {
          return { 
            success: false, 
            error: error.response?.data?.message || 'Erreur de connexion' 
          };
        } finally {
          set({ isLoading: false });
        }
      },

      // Register
      register: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.register(userData);
          const { user, token } = response.data.data;
          get().setAuth(user, token);
          return { success: true, user };
        } catch (error) {
          console.error('Erreur d\'inscription détaillée:', error);
          console.error('Response data:', error.response?.data);
          console.error('Response status:', error.response?.status);
          return { 
            success: false, 
            error: error.response?.data?.message || error.message || 'Erreur d\'inscription' 
          };
        } finally {
          set({ isLoading: false });
        }
      },

      // Logout
      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      // Update profile
      updateProfile: async (data) => {
        try {
          const response = await authAPI.updateProfile(data);
          const updatedUser = response.data.data;
          set({ user: updatedUser });
          if (typeof window !== 'undefined') {
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
          return { success: true, user: updatedUser };
        } catch (error) {
          return { 
            success: false, 
            error: error.response?.data?.message || 'Erreur de mise à jour' 
          };
        }
      },

      // Check if user is admin
      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin' || user?.role === 'super_admin';
      },

      // Initialize auth from localStorage
      initAuth: () => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('token');
          const userStr = localStorage.getItem('user');
          if (token && userStr) {
            try {
              const user = JSON.parse(userStr);
              set({ user, token, isAuthenticated: true });
            } catch (error) {
              console.error('Error parsing user data:', error);
              get().logout();
            }
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);