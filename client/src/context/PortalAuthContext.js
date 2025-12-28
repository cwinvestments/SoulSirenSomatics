import React, { createContext, useContext, useState, useEffect } from 'react';

const PortalAuthContext = createContext(null);

export function PortalAuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check localStorage on load
    const storedUser = localStorage.getItem('portalUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsLoggedIn(true);
      } catch (e) {
        localStorage.removeItem('portalUser');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Hardcoded test user for development
    if (email === 'client@test.com' && password === 'test123') {
      const userData = {
        id: 1,
        firstName: 'Sarah',
        lastName: 'Mitchell',
        email: 'client@test.com',
        phone: '(555) 123-4567',
        membershipTier: 'member', // 'observer', 'member', 'inner-circle', or null
        memberSince: '2024-10-15',
      };
      localStorage.setItem('portalUser', JSON.stringify(userData));
      setUser(userData);
      setIsLoggedIn(true);
      return { success: true };
    }

    // Check registered users in localStorage
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
    localStorage.removeItem('portalUser');
    setUser(null);
    setIsLoggedIn(false);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('portalUser', JSON.stringify(updatedUser));
    setUser(updatedUser);

    // Also update in registered users if exists
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
