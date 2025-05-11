import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});



// Students API
export const getStudents = (params) => api.get('/students', { params });
export const getStudentById = (id) => api.get(`/students/${id}`);
export const createStudent = (data) => api.post('/students', data);
export const updateStudent = (id, data) => api.put(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);
export const markAsVaccinated = (id, data) => api.post(`/students/${id}/vaccinate`, data);
export const bulkImportStudents = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/students/bulk-import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// Drives API
export const getDrives = (params) => api.get('/drives', { params });
export const getDriveById = (id) => api.get(`/drives/${id}`);
export const createDrive = (data) => api.post('/drives', data);
export const updateDrive = (id, data) => api.put(`/drives/${id}`, data);
export const deleteDrive = (id) => api.delete(`/drives/${id}`);

// Dashboard API
export const getDashboardStats = () => api.get('/dashboard/stats');

// Reports API
export const generateVaccinationReport = (params) => api.get('/reports/vaccinations', { params });

export default api;