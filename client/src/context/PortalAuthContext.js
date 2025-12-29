import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const PortalAuthContext = createContext(null);

export function PortalAuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user') || localStorage.getItem('portalUser');

      if (token) {
        try {
          // Verify token with API
          const response = await api.get('/auth/me');
          const userData = response.data.user;
          setUser(userData);
          setIsLoggedIn(true);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (err) {
          // Token invalid - clear localStorage
          console.log('Token verification failed, clearing auth data');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('portalUser');
          setUser(null);
          setIsLoggedIn(false);
        }
      } else if (storedUser) {
        // Fallback to stored user for demo mode (no token)
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsLoggedIn(true);
        } catch (e) {
          localStorage.removeItem('portalUser');
          localStorage.removeItem('user');
        }
      }

      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = (email, password, apiUser = null, token = null) => {
    // If called with API user data
    if (apiUser && token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(apiUser));
      setUser(apiUser);
      setIsLoggedIn(true);
      return { success: true };
    }

    // Demo mode - hardcoded test user
    if (email === 'client@test.com' && password === 'test123') {
      const userData = {
        id: 1,
        firstName: 'Sarah',
        lastName: 'Mitchell',
        email: 'client@test.com',
        phone: '(555) 123-4567',
        membershipTier: 'member',
        memberSince: '2024-10-15',
      };
      localStorage.setItem('portalUser', JSON.stringify(userData));
      setUser(userData);
      setIsLoggedIn(true);
      return { success: true };
    }

    // Check registered users in localStorage (demo mode)
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const foundUser = registeredUsers.find(u => u.email === email && u.password === password);

    if (foundUser) {
      const userData = {
        id: foundUser.id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
        phone: foundUser.phone,
        membershipTier: foundUser.membershipTier || null,
        memberSince: foundUser.memberSince || null,
      };
      localStorage.setItem('portalUser', JSON.stringify(userData));
      setUser(userData);
      setIsLoggedIn(true);
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password' };
  };

  const register = (userData) => {
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    // Check if email already exists
    if (registeredUsers.some(u => u.email === userData.email)) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser = {
      id: Date.now(),
      ...userData,
      membershipTier: null,
      memberSince: null,
      createdAt: new Date().toISOString(),
    };

    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

    // Auto login after registration
    const sessionUser = {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone,
      membershipTier: null,
      memberSince: null,
    };
    localStorage.setItem('portalUser', JSON.stringify(sessionUser));
    setUser(sessionUser);
    setIsLoggedIn(true);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('portalUser');
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    localStorage.setItem('portalUser', JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Also update in registered users if exists (demo mode)
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = registeredUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      registeredUsers[userIndex] = { ...registeredUsers[userIndex], ...updates };
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }
  };

  const value = {
    isLoggedIn,
    user,
    loading,
    login,
    logout,
    register,
    updateUser,
  };

  return (
    <PortalAuthContext.Provider value={value}>
      {children}
    </PortalAuthContext.Provider>
  );
}

export function usePortalAuth() {
  const context = useContext(PortalAuthContext);
  if (!context) {
    throw new Error('usePortalAuth must be used within a PortalAuthProvider');
  }
  return context;
}

export default PortalAuthContext;
