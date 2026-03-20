import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// 1. MUST set these defaults so cookies are sent/received
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:5000'; 

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axios.get('/api/me');
        setUser(res.data.user);
      } catch (err) {
        // It's okay if this fails; it just means no one is logged in yet
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    const res = await axios.post('/api/login', { email, password });
    setUser(res.data.user);
  };

  const logout = async () => {
    await axios.post('/api/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);