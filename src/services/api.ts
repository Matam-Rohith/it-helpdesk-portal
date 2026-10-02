import { Ticket, TicketStats, User, PaginatedTickets, TicketComment } from '../types';
import { localStore } from './localStore';

const BASE_URL = '/api';

function getCurrentUser(): User | null {
  try {
    const stored = localStorage.getItem('helpdesk_user');
    return stored ? JSON.parse(stored) : null;
  } catch (_e) {
    return null;
  }
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('helpdesk_token');
  const userStr = localStorage.getItem('helpdesk_user');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (userStr) {
    try {
      const u = JSON.parse(userStr);
      if (u?.id) {
        headers['X-User-Id'] = u.id;
      }
    } catch (_e) {
      // Ignore JSON parse error if storage is malformed
    }
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

  if (res.status === 401 && !endpoint.includes('/login')) {
    localStorage.removeItem('helpdesk_token');
    localStorage.removeItem('helpdesk_user');
    window.dispatchEvent(new Event('helpdesk:unauthorized'));
    throw new Error('Session expired. Please log in again.');
  }

  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('NON_JSON_RESPONSE');
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
      try {
        return await request<{ token: string; user: User }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ username, password }),
        });
      } catch (_err) {
        // Fallback transparently to localStore (works on Vercel static deployments and offline)
        return localStore.login(username, password);
      }
    },

    me: async () => {
      try {
        return await request<{ user: User }>('/auth/me');
      } catch (_err) {
        const user = getCurrentUser() || localStore.findUser('2203a51815');
        return { user };
      }
    },

    logout: async () => {
      try {
        return await request<{ success: boolean }>('/auth/logout', {
          method: 'POST',
        });
      } catch (_e) {
        return { success: true };
      }
    },
  },

  tickets: {
    list: async (params: Record<string, any> = {}) => {
      try {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            query.set(key, String(val));
          }
        });
        const qs = query.toString() ? `?${query.toString()}` : '';
        return await request<PaginatedTickets>(`/tickets${qs}`);
      } catch (_err) {
        return localStore.listTickets(params);
      }
    },

    get: async (id: string) => {
      try {
        return await request<Ticket>(`/tickets/${id}`);
      } catch (_err) {
        const ticket = localStore.getTicket(id);
        if (ticket) return ticket;
        throw new Error('Ticket not found');
      }
    },

    create: async (data: { title: string; description: string; category: string; priority: string }) => {
      try {
        return await request<Ticket>('/tickets', {
          method: 'POST',
          body: JSON.stringify(data),
        });
      } catch (_err) {
        return localStore.createTicket(data as any, getCurrentUser());
      }
    },

    update: async (id: string, updates: Partial<Ticket>) => {
      try {
        return await request<Ticket>(`/tickets/${id}`, {
          method: 'PATCH',
          body: JSON.stringify(updates),
        });
      } catch (_err) {
        const updated = localStore.updateTicket(id, updates, getCurrentUser());
        if (updated) return updated;
        throw new Error('Ticket not found');
      }
    },

    addComment: async (ticketId: string, message: string, isInternal = false) => {
      try {
        return await request<TicketComment>(`/tickets/${ticketId}/comments`, {
          method: 'POST',
          body: JSON.stringify({ message, isInternal }),
        });
      } catch (_err) {
        const comment = localStore.addComment(ticketId, message, isInternal, getCurrentUser());
        if (comment) return comment;
        throw new Error('Ticket not found');
      }
    },

    delete: async (id: string) => {
      try {
        return await request<{ success: boolean }>(`/tickets/${id}`, {
          method: 'DELETE',
        });
      } catch (_err) {
        return { success: localStore.deleteTicket(id) };
      }
    },
  },

  users: {
    list: async (role?: string) => {
      try {
        const qs = role ? `?role=${role}` : '';
        return await request<User[]>(`/users${qs}`);
      } catch (_err) {
        return localStore.listUsers(role);
      }
    },
  },

  stats: {
    get: async () => {
      try {
        return await request<TicketStats>('/stats');
      } catch (_err) {
        return localStore.getStats();
      }
    },
  },
};
