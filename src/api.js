const BASE = '/api';

const authHeader = () => {
  const token = localStorage.getItem('vg_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const req = async (method, path, body) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: body != null ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    localStorage.removeItem('vg_token');
    window.location.reload();
    return;
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
};

export const api = {
  // Auth
  login: (username, password) => req('POST', '/auth/login', { username, password }),

  // Vehicles
  getVehicles:   ()       => req('GET',    '/vehicles'),
  createVehicle: (data)   => req('POST',   '/vehicles', data),
  updateVehicle: (id, d)  => req('PUT',    `/vehicles/${id}`, d),
  deleteVehicle: (id)     => req('DELETE', `/vehicles/${id}`),

  // Customers
  getCustomers:   ()      => req('GET',    '/customers'),
  createCustomer: (data)  => req('POST',   '/customers', data),
  updateCustomer: (id, d) => req('PUT',    `/customers/${id}`, d),
  deleteCustomer: (id)    => req('DELETE', `/customers/${id}`),

  // Bookings
  getBookings:     ()       => req('GET',  '/bookings'),
  createBooking:   (data)   => req('POST', '/bookings', data),
  updateBooking:   (id, d)  => req('PUT',  `/bookings/${id}`, d),
  checkout:        (id, d)  => req('POST', `/bookings/${id}/checkout`, d),
  processReturn:   (id, d)  => req('POST', `/bookings/${id}/return`, d),

  // Payments
  getPayments:    ()      => req('GET',  '/payments'),
  createPayment:  (data)  => req('POST', '/payments', data),

  // Maintenance
  getMaintenance:    ()      => req('GET',    '/maintenance'),
  createMaintenance: (data)  => req('POST',   '/maintenance', data),
  updateMaintenance: (id, d) => req('PUT',    `/maintenance/${id}`, d),
  deleteMaintenance: (id)    => req('DELETE', `/maintenance/${id}`),

  // Inspections
  getInspections:    ()      => req('GET',  '/inspections'),
  createInspection:  (data)  => req('POST', '/inspections', data),
};
