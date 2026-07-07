export type UserRole = 'admin' | 'employee' | 'engineer';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  email: string;
  department: string;
  avatar?: string;
}

export type TicketStatus = 'Open' | 'Assigned' | 'In Progress' | 'Resolved';
export type TicketPriority = 'Low' | 'Medium' | 'High';
export type TicketCategory = 'Hardware' | 'Software' | 'Network' | 'Email' | 'Printer';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdBy: string;
  createdByName: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface TicketContextType {
  tickets: Ticket[];
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
  getTicketsByUser: (userId: string) => Ticket[];
  getTicketsByEngineer: (userId: string) => Ticket[];
}
