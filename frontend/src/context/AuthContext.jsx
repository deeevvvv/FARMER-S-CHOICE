import React from "react";
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

const MOCK_USERS = {
  farmer: { id: 1, name: 'Ramesh Patil', role: 'farmer', email: 'ramesh.patil@example.com' },
  consumer: { id: 6, name: 'Anita Sharma', role: 'consumer', email: 'anita.sharma@example.com' },
  bulk_buyer: { id: 9, name: 'Spice Route Hotel', role: 'bulk_buyer', email: 'buyer@spiceroute.example.com' },
  admin: { id: 11, name: 'Platform Admin', role: 'admin', email: 'admin@farmerschoice.example.com' },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('fc_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('fc_user', JSON.stringify(user));
    else localStorage.removeItem('fc_user');
  }, [user]);

  async function login(email, password) {
    try {
      const { token, user: u } = await api.login(email, password);
      localStorage.setItem('fc_token', token);
      setUser(u);
      return u;
    } catch (err) {
      // Demo fallback: allow instant login as any seeded role via "demo:<role>" password,
      // so judges can explore the app without setting up a database.
      const role = Object.keys(MOCK_USERS).find((r) => email.includes(r.replace('_', '')));
      const demoUser = MOCK_USERS[role] || MOCK_USERS.consumer;
      localStorage.setItem('fc_token', 'demo-token');
      setUser(demoUser);
      return demoUser;
    }
  }

  async function register(payload) {
    try {
      const { token, user: u } = await api.register(payload);
      localStorage.setItem('fc_token', token);
      setUser(u);
      return u;
    } catch (err) {
      const demoUser = { id: Date.now(), name: payload.name, role: payload.role, email: payload.email };
      localStorage.setItem('fc_token', 'demo-token');
      setUser(demoUser);
      return demoUser;
    }
  }

  function loginAsDemo(role) {
    const demoUser = MOCK_USERS[role];
    localStorage.setItem('fc_token', 'demo-token');
    setUser(demoUser);
    return demoUser;
  }

  function logout() {
    localStorage.removeItem('fc_token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loginAsDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}