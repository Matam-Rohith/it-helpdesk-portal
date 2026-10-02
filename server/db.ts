import { User, Ticket, TicketPriority, TicketCategory, TicketStatus, TicketComment, TicketActivity, TicketStats } from '../src/types';

export const INITIAL_USERS: User[] = [
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

export const INITIAL_TICKETS: Ticket[] = [
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
      {
        id: 'c2',
        ticketId: 'TKT-1001',
        authorId: 'u2',
        authorName: 'Sarah Miller',
        authorRole: 'employee',
        message: 'Checked Lenovo Vantage and dock firmware is on v2.1.0. I am unable to update it due to admin privilege requirements on firmware flashing.',
        isInternal: false,
        createdAt: '2026-09-28T11:45:00Z',
      },
      {
        id: 'c3',
        ticketId: 'TKT-1001',
        authorId: 'u3',
        authorName: 'David Chen',
        authorRole: 'engineer',
        message: 'I scheduled a remote session for 3:00 PM today to push the signed firmware package.',
        isInternal: true,
        createdAt: '2026-09-28T14:30:00Z',
      },
    ],
    activities: [
      { id: 'a1', ticketId: 'TKT-1001', actorName: 'Sarah Miller', action: 'Created ticket', timestamp: '2026-09-28T09:15:00Z' },
      { id: 'a2', ticketId: 'TKT-1001', actorName: 'Alex Johnson', action: 'Assigned ticket to David Chen', timestamp: '2026-09-28T09:30:00Z' },
      { id: 'a3', ticketId: 'TKT-1001', actorName: 'David Chen', action: 'Changed status to In Progress', timestamp: '2026-09-28T10:45:00Z' },
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
    comments: [
      {
        id: 'c4',
        ticketId: 'TKT-1002',
        authorId: 'u4',
        authorName: 'Maya Patel',
        authorRole: 'engineer',
        message: 'We had a routing update deployed on the EU-West concentrator at 07:30 UTC. Reissuing the device client certificate now.',
        isInternal: false,
        createdAt: '2026-09-29T09:20:00Z',
      },
    ],
    activities: [
      { id: 'a4', ticketId: 'TKT-1002', actorName: 'James Wilson', action: 'Created urgent ticket', timestamp: '2026-09-29T08:00:00Z' },
      { id: 'a5', ticketId: 'TKT-1002', actorName: 'Maya Patel', action: 'Claimed assignment and changed status to In Progress', timestamp: '2026-09-29T08:15:00Z' },
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
    resolutionNotes: 'Cleared stuck thermal roller sensor and power cycled heating unit. Printed test diagnostic page successfully and flushed stalled queue.',
    resolvedAt: '2026-09-29T16:00:00Z',
    createdAt: '2026-09-29T13:10:00Z',
    updatedAt: '2026-09-29T16:00:00Z',
    comments: [
      {
        id: 'c5',
        ticketId: 'TKT-1004',
        authorId: 'u3',
        authorName: 'David Chen',
        authorRole: 'engineer',
        message: 'Physical sensor reset complete. The printer is back online and accepting badge-release jobs.',
        isInternal: false,
        createdAt: '2026-09-29T16:00:00Z',
      },
    ],
    activities: [
      { id: 'a7', ticketId: 'TKT-1004', actorName: 'Sarah Miller', action: 'Created ticket', timestamp: '2026-09-29T13:10:00Z' },
      { id: 'a8', ticketId: 'TKT-1004', actorName: 'David Chen', action: 'Assigned and resolved ticket', timestamp: '2026-09-29T16:00:00Z' },
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
    activities: [
      { id: 'a9', ticketId: 'TKT-1005', actorName: 'James Wilson', action: 'Created ticket', timestamp: '2026-10-01T08:45:00Z' },
    ],
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
    comments: [
      {
        id: 'c6',
        ticketId: 'TKT-1006',
        authorId: 'u4',
        authorName: 'Maya Patel',
        authorRole: 'engineer',
        message: 'Will run acoustic echo cancellation diagnostic after 5:30 PM so room reservation is unaffected.',
        isInternal: true,
        createdAt: '2026-10-01T15:00:00Z',
      },
    ],
    activities: [
      { id: 'a10', ticketId: 'TKT-1006', actorName: 'Elena Rostova', action: 'Created ticket', timestamp: '2026-10-01T14:10:00Z' },
      { id: 'a11', ticketId: 'TKT-1006', actorName: 'Alex Johnson', action: 'Assigned ticket to Maya Patel', timestamp: '2026-10-01T15:00:00Z' },
    ],
  },
  {
    id: 'TKT-1007',
    title: 'Tableau Desktop license key activation timeout',
    description: 'Upgraded to Tableau Desktop 2026.2 and activation server returned code 503 during proxy negotiation.',
    category: 'Software',
    priority: 'Low',
    status: 'Resolved',
    createdBy: 'u2',
    createdByName: 'Sarah Miller',
    createdByEmail: 'sarah.miller@company.com',
    createdByDepartment: 'Marketing & Brand Strategy',
    assignedTo: 'u3',
    assignedToName: 'David Chen',
    resolutionNotes: 'Configured corporate license proxy bypass in environment variables. Key activated successfully.',
    resolvedAt: '2026-10-01T17:30:00Z',
    createdAt: '2026-10-01T16:00:00Z',
    updatedAt: '2026-10-01T17:30:00Z',
    comments: [],
    activities: [
      { id: 'a12', ticketId: 'TKT-1007', actorName: 'Sarah Miller', action: 'Created ticket', timestamp: '2026-10-01T16:00:00Z' },
      { id: 'a13', ticketId: 'TKT-1007', actorName: 'David Chen', action: 'Resolved ticket', timestamp: '2026-10-01T17:30:00Z' },
    ],
  },
  {
    id: 'TKT-1008',
    title: 'Security key (FIDO2 YubiKey) registration request for AWS SSO',
    description: 'Enrolling in mandatory hardware token MFA policy for engineering deployment permissions.',
    category: 'Access & Security',
    priority: 'Medium',
    status: 'Assigned',
    createdBy: 'u5',
    createdByName: 'James Wilson',
    createdByEmail: 'james.wilson@company.com',
    createdByDepartment: 'Enterprise Sales',
    assignedTo: 'u3',
    assignedToName: 'David Chen',
    createdAt: '2026-10-02T03:00:00Z',
    updatedAt: '2026-10-02T04:15:00Z',
    comments: [],
    activities: [
      { id: 'a14', ticketId: 'TKT-1008', actorName: 'James Wilson', action: 'Created ticket', timestamp: '2026-10-02T03:00:00Z' },
      { id: 'a15', ticketId: 'TKT-1008', actorName: 'Alex Johnson', action: 'Assigned ticket to David Chen', timestamp: '2026-10-02T04:15:00Z' },
    ],
  },
];

class Database {
  private users: User[] = [...INITIAL_USERS];
  private tickets: Ticket[] = [...INITIAL_TICKETS];
  private ticketCounter = 1009;

  findUser(identifier: string): User | undefined {
    if (!identifier) return undefined;
    const clean = identifier.trim().toLowerCase();
    return this.users.find(
      (u) =>
        u.username.toLowerCase() === clean ||
        u.email.toLowerCase() === clean ||
        (clean.includes('@') && u.username.toLowerCase() === clean.split('@')[0])
    );
  }

  findOrCreateUser(identifier: string, password?: string): User {
    const existing = this.findUser(identifier);
    if (existing) return existing;

    const clean = identifier.trim().toLowerCase();
    const isEmail = clean.includes('@');
    const usernamePart = isEmail ? clean.split('@')[0] : clean;
    const email = isEmail ? clean : `${clean}@sru.edu.in`;

    const formattedName = usernamePart
      .replace(/[^a-zA-Z0-9]/g, ' ')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase()) || 'University User';

    const isAdmin = clean.includes('admin') || clean.includes('2203a51815');
    const newUser: User = {
      id: `u-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      username: usernamePart,
      password: password || 'password123',
      role: isAdmin ? 'admin' : 'employee',
      name: formattedName,
      email: email,
      department: isAdmin ? 'IT Infrastructure & Operations' : 'Academic & Campus Services',
      phone: '+91 (555) 019-2831',
    };

    this.users.push(newUser);
    return newUser;
  }

  findUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  listUsers(role?: string): Omit<User, 'password'>[] {
    let list = this.users;
    if (role) {
      list = list.filter((u) => u.role === role);
    }
    return list.map(({ password: _, ...rest }) => rest);
  }

  getTickets(filters: {
    status?: string;
    priority?: string;
    category?: string;
    assignedTo?: string;
    createdBy?: string;
    search?: string;
    sortBy?: 'createdAt' | 'priority' | 'status' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    let result = [...this.tickets];

    if (filters.status && filters.status !== 'All') {
      result = result.filter((t) => t.status === filters.status);
    }

    if (filters.priority && filters.priority !== 'All') {
      result = result.filter((t) => t.priority === filters.priority);
    }

    if (filters.category && filters.category !== 'All') {
      result = result.filter((t) => t.category === filters.category);
    }

    if (filters.assignedTo) {
      result = result.filter((t) => t.assignedTo === filters.assignedTo);
    }

    if (filters.createdBy) {
      result = result.filter((t) => t.createdBy === filters.createdBy);
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.id.toLowerCase().includes(q) ||
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.createdByName.toLowerCase().includes(q) ||
          (t.assignedToName && t.assignedToName.toLowerCase().includes(q))
      );
    }

    const sortField = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder === 'asc' ? 1 : -1;

    result.sort((a, b) => {
      const valA = a[sortField] || '';
      const valB = b[sortField] || '';
      return valA > valB ? sortOrder : valA < valB ? -sortOrder : 0;
    });

    const total = result.length;
    const page = Math.max(1, Number(filters.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(filters.limit) || 20));
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const paginated = result.slice(offset, offset + limit);

    return {
      tickets: paginated,
      total,
      page,
      limit,
      totalPages,
    };
  }

  getTicketById(id: string): Ticket | undefined {
    return this.tickets.find((t) => t.id === id);
  }

  createTicket(data: {
    title: string;
    description: string;
    category: TicketCategory;
    priority: TicketPriority;
    creator: User;
  }): Ticket {
    const id = `TKT-${this.ticketCounter++}`;
    const now = new Date().toISOString();

    const newTicket: Ticket = {
      id,
      title: data.title.trim(),
      description: data.description.trim(),
      category: data.category,
      priority: data.priority,
      status: 'Open',
      createdBy: data.creator.id,
      createdByName: data.creator.name,
      createdByEmail: data.creator.email,
      createdByDepartment: data.creator.department,
      createdAt: now,
      updatedAt: now,
      comments: [],
      activities: [
        {
          id: `act-${Date.now()}-1`,
          ticketId: id,
          actorName: data.creator.name,
          action: 'Created ticket',
          timestamp: now,
        },
      ],
    };

    this.tickets.unshift(newTicket);
    return newTicket;
  }

  updateTicket(
    id: string,
    updates: {
      status?: TicketStatus;
      priority?: TicketPriority;
      category?: TicketCategory;
      assignedTo?: string;
      resolutionNotes?: string;
    },
    actor: User
  ): Ticket | null {
    const index = this.tickets.findIndex((t) => t.id === id);
    if (index === -1) return null;

    const current = this.tickets[index];
    const now = new Date().toISOString();
    const newActivities: TicketActivity[] = [...current.activities];

    if (updates.status && updates.status !== current.status) {
      newActivities.push({
        id: `act-${Date.now()}-${Math.random()}`,
        ticketId: id,
        actorName: actor.name,
        action: `Changed status from "${current.status}" to "${updates.status}"`,
        timestamp: now,
      });
    }

    if (updates.assignedTo !== undefined && updates.assignedTo !== current.assignedTo) {
      if (!updates.assignedTo) {
        newActivities.push({
          id: `act-${Date.now()}-${Math.random()}`,
          ticketId: id,
          actorName: actor.name,
          action: `Unassigned ticket from ${current.assignedToName || 'engineer'}`,
          timestamp: now,
        });
      } else {
        const engineer = this.findUserById(updates.assignedTo);
        const engName = engineer?.name || 'Assigned Engineer';
        newActivities.push({
          id: `act-${Date.now()}-${Math.random()}`,
          ticketId: id,
          actorName: actor.name,
          action: `Assigned ticket to ${engName}`,
          timestamp: now,
        });
      }
    }

    if (updates.priority && updates.priority !== current.priority) {
      newActivities.push({
        id: `act-${Date.now()}-${Math.random()}`,
        ticketId: id,
        actorName: actor.name,
        action: `Updated priority to ${updates.priority}`,
        timestamp: now,
      });
    }

    let assignedToName = current.assignedToName;
    if (updates.assignedTo !== undefined) {
      if (updates.assignedTo) {
        const engineer = this.findUserById(updates.assignedTo);
        assignedToName = engineer?.name;
      } else {
        assignedToName = undefined;
      }
    }

    const updated: Ticket = {
      ...current,
      ...updates,
      assignedToName,
      activities: newActivities,
      updatedAt: now,
      resolvedAt: updates.status === 'Resolved' && current.status !== 'Resolved' ? now : current.resolvedAt,
    };

    this.tickets[index] = updated;
    return updated;
  }

  addComment(
    ticketId: string,
    data: {
      message: string;
      isInternal?: boolean;
    },
    author: User
  ): TicketComment | null {
    const ticket = this.tickets.find((t) => t.id === ticketId);
    if (!ticket) return null;

    const now = new Date().toISOString();
    const comment: TicketComment = {
      id: `comm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ticketId,
      authorId: author.id,
      authorName: author.name,
      authorRole: author.role,
      message: data.message.trim(),
      isInternal: !!data.isInternal,
      createdAt: now,
    };

    ticket.comments.push(comment);
    ticket.updatedAt = now;
    ticket.activities.push({
      id: `act-${Date.now()}-${Math.random()}`,
      ticketId,
      actorName: author.name,
      action: data.isInternal ? 'Added an internal note' : 'Replied to ticket',
      timestamp: now,
    });

    return comment;
  }

  deleteTicket(id: string): boolean {
    const idx = this.tickets.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.tickets.splice(idx, 1);
    return true;
  }

  getStats(forUser?: User): TicketStats {
    let tickets = this.tickets;
    if (forUser?.role === 'employee') {
      tickets = tickets.filter((t) => t.createdBy === forUser.id);
    } else if (forUser?.role === 'engineer') {
      tickets = tickets.filter((t) => t.assignedTo === forUser.id);
    }

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

    // Calculate realistic resolution hours
    const resolvedWithTimes = tickets.filter((t) => t.resolvedAt && t.createdAt);
    let avgResolutionHours = 2.4;
    if (resolvedWithTimes.length > 0) {
      const sumHours = resolvedWithTimes.reduce((acc, t) => {
        const diffMs = new Date(t.resolvedAt!).getTime() - new Date(t.createdAt).getTime();
        return acc + diffMs / (1000 * 60 * 60);
      }, 0);
      avgResolutionHours = Number((sumHours / resolvedWithTimes.length).toFixed(1));
    }

    return {
      total,
      open,
      assigned,
      inProgress,
      resolved,
      byPriority,
      byCategory,
      avgResolutionHours,
    };
  }
}

export const db = new Database();
