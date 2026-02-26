import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:5001/api/auth';

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get(`${API_URL}/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(res.data.user);
                    setRole(res.data.role);
                } catch (err) {
                    localStorage.removeItem('token');
                    setUser(null);
                    setRole(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const signup = async (data) => {
        const res = await axios.post(`${API_URL}/signup`, data);
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        setRole(res.data.role);
        return res.data;
    };

    const login = async (identifier, password, location = {}) => {
        const res = await axios.post(`${API_URL}/login`, { identifier, password, location });
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        setRole(res.data.role);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setRole(null);
    };

    const updateProfile = async (formData) => {
        const token = localStorage.getItem('token');
        const res = await axios.post(`${API_URL}/update-profile`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        setUser(res.data.user);
        return res.data;
    };

    const updatePassword = async (currentPassword, newPassword) => {
        const token = localStorage.getItem('token');
        const res = await axios.post(`${API_URL}/update-password`, { currentPassword, newPassword }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return res.data;
    };

    const value = {
        user,
        role,
        loading,
        signup,
        login,
        logout,
        updateProfile,
        updatePassword
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
