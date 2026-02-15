// API utility for backend communication

const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'same-origin',
    ...options,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export const api = {
  auth: {
    login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    getSession: () => request('/auth/session'),
  },
  contact: {
    submit: (data) => request('/contact', { method: 'POST', body: data }),
  },
  client: {
    getBookings: () => request('/client/bookings'),
    getPets: () => request('/client/pets'),
    getInvoices: () => request('/client/invoices'),
  },
  admin: {
    getDashboard: () => request('/admin/dashboard'),
    getClients: () => request('/admin/clients'),
    createClient: (data) => request('/admin/clients', { method: 'POST', body: data }),
    updateClient: (id, data) => request(`/admin/clients/${id}`, { method: 'PUT', body: data }),
    deleteClient: (id) => request(`/admin/clients/${id}`, { method: 'DELETE' }),
    getPets: () => request('/admin/pets'),
    createPet: (data) => request('/admin/pets', { method: 'POST', body: data }),
    updatePet: (id, data) => request(`/admin/pets/${id}`, { method: 'PUT', body: data }),
    deletePet: (id) => request(`/admin/pets/${id}`, { method: 'DELETE' }),
    getBookings: () => request('/admin/bookings'),
    createBooking: (data) => request('/admin/bookings', { method: 'POST', body: data }),
    updateBooking: (id, data) => request(`/admin/bookings/${id}`, { method: 'PUT', body: data }),
    deleteBooking: (id) => request(`/admin/bookings/${id}`, { method: 'DELETE' }),
    getInvoices: () => request('/admin/invoices'),
    createInvoice: (data) => request('/admin/invoices', { method: 'POST', body: data }),
    updateInvoice: (id, data) => request(`/admin/invoices/${id}`, { method: 'PUT', body: data }),
    deleteInvoice: (id) => request(`/admin/invoices/${id}`, { method: 'DELETE' }),
    markInvoicePaid: (id, paymentData) => request(`/admin/invoices/${id}/mark-paid`, { method: 'POST', body: paymentData }),
  },
};

export default api;
