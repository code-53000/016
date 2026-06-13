import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

export const processesApi = {
  listGuqins: () => api.get('/api/processes/guqins/'),
  getGuqin: (id) => api.get(`/api/processes/guqins/${id}/`),
  createGuqin: (data) => api.post('/api/processes/guqins/', data),
  advanceStage: (id) => api.post(`/api/processes/guqins/${id}/advance-stage/`),
  listStages: (guqinId) => api.get('/api/processes/stages/', { params: { guqin: guqinId } }),
  createStage: (data) => api.post('/api/processes/stages/', data),
};

export const materialsApi = {
  listWoodBlanks: () => api.get('/api/materials/wood-blanks/'),
  getWoodBlank: (id) => api.get(`/api/materials/wood-blanks/${id}/`),
  createWoodBlank: (data) => api.post('/api/materials/wood-blanks/', data),
  updateWoodBlank: (id, data) => api.patch(`/api/materials/wood-blanks/${id}/`, data),
  listLacquerRecords: (guqinId) => api.get('/api/materials/lacquer-records/', { params: { guqin: guqinId } }),
  createLacquerRecord: (data) => api.post('/api/materials/lacquer-records/', data),
};

export const trialsApi = {
  listTrials: (guqinId) => api.get('/api/trials/tone-trials/', { params: { guqin: guqinId } }),
  createTrial: (data) => api.post('/api/trials/tone-trials/', data),
  updateTrial: (id, data) => api.patch(`/api/trials/tone-trials/${id}/`, data),
};

export const ordersApi = {
  listCustomers: () => api.get('/api/orders/customers/'),
  createCustomer: (data) => api.post('/api/orders/customers/', data),
  listOrders: (params) => api.get('/api/orders/orders/', { params }),
  createOrder: (data) => api.post('/api/orders/orders/', data),
  updateOrder: (id, data) => api.patch(`/api/orders/orders/${id}/`, data),
};

export default api;
