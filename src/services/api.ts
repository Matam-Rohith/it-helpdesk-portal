import { Ticket, TicketStats, User, PaginatedTickets, TicketComment } from '../types';

const BASE_URL = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('helpdesk_token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    localStorage.removeItem('helpdesk_token');
    localStorage.removeItem('helpdesk_user');
    if (!window.location.pathname.includes('/login')) {
      window.location.href = '/login';
    }
    throw new Error('Session expired. Please log in again.');
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || `HTTP error ${res.status}`);
  }

  return data as T;
}

export const api = {
  auth: {
    login: async (username: string, password: string) => {
      return request<{ token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
    },
    me: async () => {
      return request<{ user: User }>('/auth/me');
    },
    logout: async () => {
      return request<{ success: boolean }>('/auth/logout', {
        method: 'POST',
      });
    },
  },

  tickets: {
    list: async (params: Record<string, any> = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.set(key, String(val));
        }
      });
      const qs = query.toString() ? `?${query.toString()}` : '';
      return request<PaginatedTickets>(`/tickets${qs}`);
    },

    get: async (id: string) => {
      return request<Ticket>(`/tickets/${id}`);
    },

    create: async (data: { title: string; description: string; category: string; priority: string }) => {
      return request<Ticket>('/tickets', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (id: string, updates: Partial<Ticket>) => {
      return request<Ticket>(`/tickets/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
    },

    addComment: async (ticketId: string, message: string, isInternal = false) => {
      return request<TicketComment>(`/tickets/${ticketId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ message, isInternal }),
      });
    },

    delete: async (id: string) => {
      return request<{ success: boolean }>(`/tickets/${id}`, {
        method: 'DELETE',
      });
    },
  },

  users: {
    list: async (role?: string) => {
      const qs = role ? `?role=${role}` : '';
      return request<User[]>(`/users${qs}`);
    },
  },

  stats: {
    get: async () => {
      return request<TicketStats>('/stats');
    },
  },
};
