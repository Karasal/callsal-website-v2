
import { User, Booking, ProjectLog, Invoice } from '../types';

const KEYS = {
  USERS: 'sal_agency_users_v2',
  BOOKINGS: 'sal_agency_bookings_v2',
  LOGS: 'sal_agency_logs_v2',
  INVOICES: 'sal_agency_invoices_v2',
  CURRENT_USER: 'sal_agency_current_session_v2'
};

// Default users - passwords handled server-side only
// Client-side storage is for session management, not authentication
const DEFAULT_ADMIN: User = {
  id: 'admin-001',
  email: 'info@callsal.app',
  name: 'Salman (Admin)',
  role: 'admin',
  avatar: '/booking-hero.png',
  verified: true,
  isRegistered: true
};

const DEFAULT_CLIENT: User = {
  id: 'client-shimantoe',
  email: 'shimantoe.c@gmail.com',
  name: 'Shimantoe',
  role: 'client',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=shimantoe',
  verified: true,
  isRegistered: true
};

const get = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  const data = localStorage.getItem(key);
  if (!data) return fallback;
  try {
    const parsed = JSON.parse(data);
    return parsed === null ? fallback : parsed;
  } catch (e) {
    return fallback;
  }
};

const set = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

const generateKey = () => {
  const parts = [
    'SAL',
    Math.random().toString(36).substring(2, 6).toUpperCase(),
    Math.random().toString(36).substring(2, 6).toUpperCase()
  ];
  return parts.join('-');
};

export const storage = {
  getUsers: () => {
    const users = get<User[]>(KEYS.USERS, [DEFAULT_ADMIN, DEFAULT_CLIENT]);
    // Ensure admin always has correct info (no passwords in client code)
    const adminIndex = users.findIndex(u => u.id === 'admin-001');
    if (adminIndex >= 0) {
      users[adminIndex] = { ...users[adminIndex], email: DEFAULT_ADMIN.email, avatar: DEFAULT_ADMIN.avatar };
    } else {
      users.unshift(DEFAULT_ADMIN);
    }
    // Ensure client exists
    const clientIndex = users.findIndex(u => u.id === 'client-shimantoe');
    if (clientIndex >= 0) {
      users[clientIndex] = { ...users[clientIndex], email: DEFAULT_CLIENT.email, avatar: DEFAULT_CLIENT.avatar };
    } else if (!users.find(u => u.email === DEFAULT_CLIENT.email)) {
      users.push(DEFAULT_CLIENT);
    }
    return users;
  },
  
  createClientPlaceholder: (info: Partial<User>) => {
    const users = storage.getUsers();
    const key = generateKey();
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: info.name || 'New Client',
      role: 'client',
      businessName: info.businessName || '',
      phone: info.phone || '',
      website: info.website || '',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${info.name || 'client'}`,
      registrationKey: key,
      isRegistered: false,
      verified: true
    };
    set(KEYS.USERS, [...users, newUser]);
    return key;
  },

  finalizeRegistration: (key: string, email: string, _pass: string) => {
    // NOTE: Passwords are NOT stored client-side for security
    // Authentication is handled server-side via JWT tokens
    const users = storage.getUsers();
    const userIndex = users.findIndex(u => u.registrationKey === key);
    if (userIndex === -1) return null;

    users[userIndex] = {
      ...users[userIndex],
      email,
      isRegistered: true
      // Password NOT stored - auth handled via server JWT
    };

    set(KEYS.USERS, users);
    return users[userIndex];
  },

  getCurrentUser: () => {
    const user = get<User | null>(KEYS.CURRENT_USER, null);
    // Ensure admin always has updated avatar
    if (user && user.id === 'admin-001') {
      return { ...user, avatar: DEFAULT_ADMIN.avatar };
    }
    return user;
  },
  setCurrentUser: (user: User | null) => set(KEYS.CURRENT_USER, user),
  
  getBookings: () => get<Booking[]>(KEYS.BOOKINGS, []),
  addBooking: (booking: Booking) => {
    const bookings = storage.getBookings();
    set(KEYS.BOOKINGS, [...(bookings || []), booking]);
  },
  
  getLogs: (clientId?: string) => {
    const logs = get<ProjectLog[]>(KEYS.LOGS, []);
    return clientId ? (logs || []).filter(l => l.clientId === clientId) : (logs || []);
  },
  addLog: (log: ProjectLog) => {
    const logs = get<ProjectLog[]>(KEYS.LOGS, []);
    set(KEYS.LOGS, [...(logs || []), log]);
  },

  getInvoices: (clientId?: string) => {
    const invoices = get<Invoice[]>(KEYS.INVOICES, []);
    return clientId ? (invoices || []).filter(i => i.clientId === clientId) : (invoices || []);
  },
  addInvoice: (invoice: Invoice) => {
    const invoices = get<Invoice[]>(KEYS.INVOICES, []);
    set(KEYS.INVOICES, [...(invoices || []), invoice]);
  },
  updateInvoiceStatus: (id: string, status: 'paid') => {
    const invoices = get<Invoice[]>(KEYS.INVOICES, []);
    set(KEYS.INVOICES, (invoices || []).map(i => i.id === id ? { ...i, status } : i));
  }
};
