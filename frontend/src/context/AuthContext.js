import { createContext, useContext } from 'react';

export const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: () => { },
  register: () => { },
  logout: () => { },
  updateUser: () => { },
});

export const useAuth = () => useContext(AuthContext);
