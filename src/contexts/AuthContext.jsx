import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USER, DEMO_USERS } from '../services/mockData';

const AuthContext = createContext();

export const getRoleLandingPath = (role) => {
  const landingPaths = {
    ADMIN: '/dashboard/national',
    CENTRAL_MINISTRY: '/dashboard/national',
    STATE_GOVT: '/dashboard/state',
    DISTRICT_AUTHORITY: '/dashboard/district',
    FIELD_OFFICER: '/dashboard/district',
    PROJECT_AGENCY: '/dashboard/agency'
  };

  return landingPaths[role] || '/';
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('bhoomisetu_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bhoomisetu_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bhoomisetu_user');
    }
  }, [currentUser]);

  const login = (email, password) => {
    const found = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || DEMO_USERS[0];
    setCurrentUser(found);
    return found;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bhoomisetu_user');
  };

  const switchRole = (roleKey) => {
    const matchedUser = DEMO_USERS.find(u => u.role === roleKey) || {
      id: `usr-custom-${Date.now()}`,
      name: `Officer (${roleKey})`,
      role: roleKey,
      email: `${roleKey.toLowerCase()}@landvision.gov.in`,
      organization: `${roleKey} Department`,
      state: roleKey === 'STATE_GOVT' || roleKey === 'DISTRICT_AUTHORITY' || roleKey === 'FIELD_OFFICER' ? 'Tamil Nadu' : 'All India',
      district: roleKey === 'DISTRICT_AUTHORITY' || roleKey === 'FIELD_OFFICER' ? 'Kanchipuram' : 'All'
    };
    setCurrentUser(matchedUser);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, switchRole, DEMO_USERS }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
