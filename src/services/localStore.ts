import { Ticket, TicketStats, User, PaginatedTickets, TicketComment, TicketActivity } from '../types';

export const LOCAL_USERS: User[] = [
  {
    id: 'u-sru-admin',
    username: '2203a51815',
    password: 'password123',
    role: 'admin',
    name: 'SRU Administrator',
    email: '2203a51815@sru.edu.in',
    department: 'SR University IT & Operations',
    phone: '+91 (555) 019-2831',
  },
  {
    id: 'u1',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Alex Johnson',
    email: 'alex.johnson@company.com',
    department: 'IT Infrastructure & Operations',
    phone: '+1 (555) 234-8901',
  },
  {
    id: 'u2',
    username: 'employee',
    password: 'employee123',
    role: 'employee',
    name: 'Sarah Miller',
    email: 'sarah.miller@company.com',
    department: 'Marketing & Brand Strategy',
    phone: '+1 (555) 345-6712',
  },
  {
    id: 'u3',
    username: 'engineer',
    password: 'engineer123',
    role: 'engineer',
    name: 'David Chen',
    email: 'david.chen@company.com',
    department: 'IT Systems Support',
    phone: '+1 (555) 456-7890',
  },
  {
    id: 'u4',
    username: 'maya.engineer',
    password: 'engineer123',
    role: 'engineer',
    name: 'Maya Patel',
    email: 'maya.patel@company.com',
    department: 'Network Operations',
    phone: '+1 (555) 567-8910',
  },
  {
    id: 'u5',
    username: 'james.sales',
    password: 'employee123',
    role: 'employee',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    department: 'Enterprise Sales',
    phone: '+1 (555) 678-9012',
  },
  {
    id: 'u6',
    username: 'elena.hr',
    password: 'employee123',
    role: 'employee',
    name: 'Elena Rostova',
    email: 'elena.rostova@company.com',
    department: 'People & Culture',
    phone: '+1 (555) 789-0123',
  },
];

export const INITIAL_FALLBACK_TICKETS: Ticket[] = [
  {
    id: 'TKT-1001',
    title: 'Intermittent primary display flickering via Thunderbolt dock',
    description: 'My primary external monitor flickers black for 2-3 seconds whenever video calls start or high-resolution applications open. I have verified cable seating on both ends.',
    category: 'Hardware',
    priority: 'High',
    status: 'In Progress',
    createdBy: 'u2',
    createdByName: 'Sarah Miller',
    createdByEmail: 'sarah.miller@company.com',
    createdByDepartment: 'Marketing & Brand Strategy',
    assignedTo: 'u3',
    assignedToName: 'David Chen',
    createdAt: '2026-09-28T09:15:00Z',
    updatedAt: '2026-09-28T14:30:00Z',
    comments: [
      {
        id: 'c1',
        ticketId: 'TKT-1001',
        authorId: 'u3',
        authorName: 'David Chen',
        authorRole: 'engineer',
        message: 'Could you confirm if the dock firmware is on version 2.4.1? There was a known issue with Thunderbolt 4 display negotiation in earlier builds.',
        isInternal: false,
        createdAt: '2026-09-28T11:00:00Z',
      },
    ],
    activities: [
      { id: 'a1', ticketId: 'TKT-1001', actorName: 'Sarah Miller', action: 'Created ticket', timestamp: '2026-09-28T09:15:00Z' },
      { id: 'a2', ticketId: 'TKT-1001', actorName: 'Alex Johnson', action: 'Assigned ticket to David Chen', timestamp: '2026-09-28T09:30:00Z' },
    ],
  },
  {
    id: 'TKT-1002',
    title: 'WireGuard VPN gateway handshake failure on macOS Sonoma',
    description: 'Unable to establish tunnel connection to Europe-West gateway. Client reports SSL handshake timeout. Home fiber connection is steady at 300 Mbps.',
    category: 'Network',
    priority: 'Urgent',
    status: 'In Progress',
    createdBy: 'u5',
    createdByName: 'James Wilson',
    createdByEmail: 'james.wilson@company.com',
    createdByDepartment: 'Enterprise Sales',
    assignedTo: 'u4',
    assignedToName: 'Maya Patel',
    createdAt: '2026-09-29T08:00:00Z',
    updatedAt: '2026-09-29T10:15:00Z',
    comments: [],
    activities: [
      { id: 'a4', ticketId: 'TKT-1002', actorName: 'James Wilson', action: 'Created urgent ticket', timestamp: '2026-09-29T08:00:00Z' },
    ],
  },
  {
    id: 'TKT-1003',
    title: 'Microsoft 365 Enterprise license assignment pending for contractor',
    description: 'New design contractor starting Monday needs access to Teams, OneDrive, and Figma workspace federated via Entra ID.',
    category: 'Access & Security',
    priority: 'Medium',
    status: 'Open',
    createdBy: 'u6',
    createdByName: 'Elena Rostova',
    createdByEmail: 'elena.rostova@company.com',
    createdByDepartment: 'People & Culture',
    createdAt: '2026-09-30T11:20:00Z',
    updatedAt: '2026-09-30T11:20:00Z',
    comments: [],
    activities: [
      { id: 'a6', ticketId: 'TKT-1003', actorName: 'Elena Rostova', action: 'Created ticket', timestamp: '2026-09-30T11:20:00Z' },
    ],
  },
  {
    id: 'TKT-1004',
    title: 'Floor 3 East multi-function Canon printer spooler offline',
    description: 'Printer displays "Service error E000-0001". Queue currently has 14 pending print jobs blocked from accounting and HR.',
    category: 'Printer',
    priority: 'High',
    status: 'Resolved',
    createdBy: 'u2',
    createdByName: 'Sarah Miller',
    createdByEmail: 'sarah.miller@company.com',
    createdByDepartment: 'Marketing & Brand Strategy',
    assignedTo: 'u3',
    assignedToName: 'David Chen',
    resolutionNotes: 'Cleared stuck thermal roller sensor and power cycled heating unit. Printed test diagnostic page successfully.',
    resolvedAt: '2026-09-29T16:00:00Z',
    createdAt: '2026-09-29T13:10:00Z',
    updatedAt: '2026-09-29T16:00:00Z',
    comments: [],
    activities: [
      { id: 'a7', ticketId: 'TKT-1004', actorName: 'Sarah Miller', action: 'Created ticket', timestamp: '2026-09-29T13:10:00Z' },
    ],
  },
  {
    id: 'TKT-1005',
    title: 'Exchange Online inbox rule synchronization loop on iOS Mail',
    description: 'Employee reports duplicate notifications every 4 minutes for incoming support inquiries. Suspected malformed server-side rule.',
    category: 'Email',
    priority: 'Low',
    status: 'Open',
    createdBy: 'u5',
    createdByName: 'James Wilson',
    createdByEmail: 'james.wilson@company.com',
    createdByDepartment: 'Enterprise Sales',
    createdAt: '2026-10-01T08:45:00Z',
    updatedAt: '2026-10-01T08:45:00Z',
    comments: [],
    activities: [],
  },
  {
    id: 'TKT-1006',
    title: 'Conference Room 402 Zoom Room audio echo and microphone clipping',
    description: 'During executive team review, microphones produced heavy feedback loop. Needs audio DSP calibrated.',
    category: 'Hardware',
    priority: 'Medium',
    status: 'Assigned',
    createdBy: 'u6',
    createdByName: 'Elena Rostova',
    createdByEmail: 'elena.rostova@company.com',
    createdByDepartment: 'People & Culture',
    assignedTo: 'u4',
    assignedToName: 'Maya Patel',
    createdAt: '2026-10-01T14:10:00Z',
    updatedAt: '2026-10-01T15:00:00Z',
    comments: [],
    activities: [],
  },
];

class LocalStore {
  private users: User[] = [...LOCAL_USERS];

  private getStoredTickets(): Ticket[] {
    try {
      const stored = localStorage.getItem('helpdesk_fallback_tickets');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (_e) {
      // ignore
    }
    localStorage.setItem('helpdesk_fallback_tickets', JSON.stringify(INITIAL_FALLBACK_TICKETS));
    return [...INITIAL_FALLBACK_TICKETS];
  }

  private saveTickets(tickets: Ticket[]) {
    try {
      localStorage.setItem('helpdesk_fallback_tickets', JSON.stringify(tickets));
    } catch (_e) {
      // ignore
    }
  }

  findUser(credential: string): User {
    const clean = credential.trim().toLowerCase();
    const found = this.users.find(
      (u) =>
        u.username.toLowerCase() === clean ||
        u.email.toLowerCase() === clean ||
        (clean.includes('@') && u.username.toLowerCase() === clean.split('@')[0])
    );
    if (found) return found;

    // Auto-create fallback user
    const isEmail = clean.includes('@');
    const usernamePart = isEmail ? clean.split('@')[0] : clean;
    const email = isEmail ? clean : `${clean}@sru.edu.in`;
    const formattedName =
      usernamePart
        .replace(/[^a-zA-Z0-9]/g, ' ')
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase()) || 'University User';

    const isAdmin = clean.includes('admin') || clean.includes('2203a51815');
    const newUser: User = {
      id: `u-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      username: usernamePart,
      password: 'password123',
      role: isAdmin ? 'admin' : 'employee',
      name: formattedName,
      email: email,
      department: isAdmin ? 'IT Infrastructure & Operations' : 'Campus Support Services',
      phone: '+91 (555) 019-2831',
    };

    this.users.push(newUser);
    return newUser;
  }

  login(credential: string, password?: string): { token: string; user: User } {
    const user = this.findUser(credential);
    if (password && user.id.startsWith('u-')) {
      user.password = password;
    }
    const token = `sess_${user.id}_${Date.now()}_local`;
    const { password: _p, ...cleanUser } = user;
    return { token, user: cleanUser as User };
  }

  listTickets(params: Record<string, any> = {}): PaginatedTickets {
    let tickets = this.getStoredTickets();

    if (params.status && params.status !== 'All') {
      tickets = tickets.filter((t) => t.status === params.status);
    }
    if (params.priority && params.priority !== 'All') {
      tickets = tickets.filter((t) => t.priority === params.priority);
    }
    if (params.category && params.category !== 'All') {
      tickets = tickets.filter((t) => t.category === params.category);
    }
    if (params.assignedTo) {
      tickets = tickets.filter((t) => t.assignedTo === params.assignedTo);
    }
    if (params.createdBy) {
      tickets = tickets.filter((t) => t.createdBy === params.createdBy);
    }
    if (params.search) {
      const q = String(params.search).toLowerCase();
      tickets = tickets.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.createdByName.toLowerCase().includes(q)
      );
    }

    const total = tickets.length;
    const page = Math.max(1, Number(params.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(params.limit) || 20));
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;

    return {
      tickets: tickets.slice(offset, offset + limit),
      total,
      page,
      limit,
      totalPages,
    };
  }

  getTicket(id: string): Ticket | undefined {
    return this.getStoredTickets().find((t) => t.id === id);
  }

  createTicket(
    data: { title: string; description: string; category: any; priority: any },
    currentUser?: User | null
  ): Ticket {
    const tickets = this.getStoredTickets();
    const id = `TKT-${1000 + tickets.length + 1}`;
    const now = new Date().toISOString();

    const creatorName = currentUser?.name || 'Portal User';
    const creatorEmail = currentUser?.email || 'user@company.com';
    const creatorDept = currentUser?.department || 'Operations';
    const creatorId = currentUser?.id || 'u-current';

    const newTicket: Ticket = {
      id,
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      priority: data.priority,
      status: 'Open',
      createdBy: creatorId,
      createdByName: creatorName,
      createdByEmail: creatorEmail,
      createdByDepartment: creatorDept,
      createdAt: now,
      updatedAt: now,
      comments: [],
      activities: [
        {
          id: `act-${Date.now()}-1`,
          ticketId: id,
          actorName: creatorName,
          action: 'Created ticket',
          timestamp: now,
        },
      ],
    };

    tickets.unshift(newTicket);
    this.saveTickets(tickets);
    return newTicket;
  }

  updateTicket(id: string, updates: Partial<Ticket>, currentUser?: User | null): Ticket | null {
    const tickets = this.getStoredTickets();
    const idx = tickets.findIndex((t) => t.id === id);
    if (idx === -1) return null;

    const current = tickets[idx];
    const now = new Date().toISOString();
    const activities: TicketActivity[] = [...current.activities];

    if (updates.status && updates.status !== current.status) {
      activities.push({
        id: `act-${Date.now()}`,
        ticketId: id,
        actorName: currentUser?.name || 'User',
        action: `Changed status to "${updates.status}"`,
        timestamp: now,
      });
    }

    const updated: Ticket = {
      ...current,
      ...updates,
      activities,
      updatedAt: now,
      resolvedAt: updates.status === 'Resolved' ? now : current.resolvedAt,
    };

    tickets[idx] = updated;
    this.saveTickets(tickets);
    return updated;
  }

  addComment(
    ticketId: string,
    message: string,
    isInternal = false,
    currentUser?: User | null
  ): TicketComment | null {
    const tickets = this.getStoredTickets();
    const ticket = tickets.find((t) => t.id === ticketId);
    if (!ticket) return null;

    const now = new Date().toISOString();
    const comment: TicketComment = {
      id: `comm-${Date.now()}`,
      ticketId,
      authorId: currentUser?.id || 'u-user',
      authorName: currentUser?.name || 'Portal User',
      authorRole: currentUser?.role || 'employee',
      message: message.trim(),
      isInternal,
      createdAt: now,
    };

    ticket.comments.push(comment);
    ticket.updatedAt = now;
    ticket.activities.push({
      id: `act-${Date.now()}`,
      ticketId,
      actorName: currentUser?.name || 'Portal User',
      action: isInternal ? 'Added internal note' : 'Replied to ticket',
      timestamp: now,
    });

    this.saveTickets(tickets);
    return comment;
  }

  deleteTicket(id: string): boolean {
    const tickets = this.getStoredTickets();
    const filtered = tickets.filter((t) => t.id !== id);
    if (filtered.length === tickets.length) return false;
    this.saveTickets(filtered);
    return true;
  }

  listUsers(role?: string): User[] {
    if (!role) return this.users;
    return this.users.filter((u) => u.role === role);
  }

  getStats(): TicketStats {
    const tickets = this.getStoredTickets();
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === 'Open').length;
    const assigned = tickets.filter((t) => t.status === 'Assigned').length;
    const inProgress = tickets.filter((t) => t.status === 'In Progress').length;
    const resolved = tickets.filter((t) => t.status === 'Resolved').length;

    const byPriority: Record<string, number> = {
      Low: tickets.filter((t) => t.priority === 'Low').length,
      Medium: tickets.filter((t) => t.priority === 'Medium').length,
      High: tickets.filter((t) => t.priority === 'High').length,
      Urgent: tickets.filter((t) => t.priority === 'Urgent').length,
    };

    const byCategory: Record<string, number> = {
      Hardware: tickets.filter((t) => t.category === 'Hardware').length,
      Software: tickets.filter((t) => t.category === 'Software').length,
      Network: tickets.filter((t) => t.category === 'Network').length,
      Email: tickets.filter((t) => t.category === 'Email').length,
      Printer: tickets.filter((t) => t.category === 'Printer').length,
      'Access & Security': tickets.filter((t) => t.category === 'Access & Security').length,
    };

    return {
      total,
      open,
      assigned,
      inProgress,
      resolved,
      byPriority,
      byCategory,
      avgResolutionHours: 2.1,
    };
  }
}

export const localStore = new LocalStore();
