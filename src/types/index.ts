export type UserRole = 'admin' | 'employee' | 'engineer';

export interface User {
  id: string;
  username: string;
  password?: string;
  role: UserRole;
  name: string;
  email: string;
  department: string;
  phone?: string;
  avatar?: string;
}

export type TicketStatus = 'Open' | 'Assigned' | 'In Progress' | 'Resolved';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketCategory = 'Hardware' | 'Software' | 'Network' | 'Email' | 'Printer' | 'Access & Security';

export interface TicketComment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  message: string;
  isInternal: boolean;
  createdAt: string;
}

export interface TicketActivity {
  id: string;
  ticketId: string;
  actorName: string;
  action: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdBy: string;
  createdByName: string;
  createdByEmail?: string;
  createdByDepartment?: string;
  assignedTo?: string;
  assignedToName?: string;
  resolutionNotes?: string;
  resolvedAt?: string;
  comments: TicketComment[];
  activities: TicketActivity[];
  createdAt: string;
  updatedAt: string;
}

export interface TicketFilters {
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
}

export interface PaginatedTickets {
  tickets: Ticket[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TicketStats {
  total: number;
  open: number;
  assigned: number;
  inProgress: number;
  resolved: number;
  byPriority: Record<string, number>;
  byCategory: Record<string, number>;
  avgResolutionHours: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}
