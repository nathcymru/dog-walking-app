// USE YOUR EXISTING api.js FILE
// This is just a template - replace with your actual API client
const API_BASE = '/api';

const api = {
  client: {
    getDashboard: () => fetch(\`\${API_BASE}/client/dashboard\`).then(r => r.json()),
    getPets: () => fetch(\`\${API_BASE}/client/pets\`).then(r => r.json()),
    getBookings: () => fetch(\`\${API_BASE}/client/bookings\`).then(r => r.json()),
    getInvoices: () => fetch(\`\${API_BASE}/client/invoices\`).then(r => r.json()),
  },
  admin: {
    getClients: () => fetch(\`\${API_BASE}/admin/clients\`).then(r => r.json()),
    getPets: () => fetch(\`\${API_BASE}/admin/pets\`).then(r => r.json()),
    getBookings: () => fetch(\`\${API_BASE}/admin/bookings\`).then(r => r.json()),
  }
};

export default api;
