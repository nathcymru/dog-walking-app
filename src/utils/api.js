// API client with credentials support for session cookies
const API_BASE = '/api';

// Helper to make authenticated requests
const fetchWithAuth = async (url, options = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // CRITICAL for session cookies
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok && (response.status === 401 || response.status === 403)) {
    // Authentication failed - could redirect to login here
    throw new Error('Authentication required');
  }
  
  return response;
};

const api = {
  client: {
    getDashboard: () => fetchWithAuth(\`\${API_BASE}/client/dashboard\`).then(r => r.json()),
    getPets: () => fetchWithAuth(\`\${API_BASE}/client/pets\`).then(r => r.json()),
    getBookings: () => fetchWithAuth(\`\${API_BASE}/client/bookings\`).then(r => r.json()),
    getInvoices: () => fetchWithAuth(\`\${API_BASE}/client/invoices\`).then(r => r.json()),
  },
  admin: {
    getClients: () => fetchWithAuth(\`\${API_BASE}/admin/clients\`).then(r => r.json()),
    getPets: () => fetchWithAuth(\`\${API_BASE}/admin/pets\`).then(r => r.json()),
    getBookings: () => fetchWithAuth(\`\${API_BASE}/admin/bookings\`).then(r => r.json()),
    getIncidents: () => fetchWithAuth(\`\${API_BASE}/admin/incidents\`).then(r => r.json()),
  }
};

export default api;
