import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Authentication services
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
  return await api.get('/auth/me');
};

// Sequence services
export const getSequences = async () => {
  const response = await api.get('/sequences');
  return response.data.data;
};

export const getSequence = async (id) => {
  const response = await api.get(`/sequences/${id}`);
  return response.data.data;
};

export const saveSequence = async (sequenceData) => {
  if (sequenceData._id) {
    const response = await api.put(`/sequences/${sequenceData._id}`, sequenceData);
    return response.data.data;
  } else {
    const response = await api.post('/sequences', sequenceData);
    return response.data.data;
  }
};

export const deleteSequence = async (id) => {
  const response = await api.delete(`/sequences/${id}`);
  return response.data;
};

// Email services
export const scheduleEmail = async (emailData) => {
  const response = await api.post('/emails/schedule', emailData);
  return response.data;
};

export const getScheduledEmails = async () => {
  const response = await api.get('/emails');
  return response.data.data;
};

export const cancelScheduledEmail = async (jobId) => {
  const response = await api.delete(`/emails/${jobId}`);
  return response.data;
};

export default api;