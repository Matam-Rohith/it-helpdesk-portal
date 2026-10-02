import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Ticket, TicketStats, User, TicketComment } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

export interface TicketContextType {
  tickets: Ticket[];
  stats: TicketStats | null;
  engineers: User[];
  loading: boolean;
  refreshTickets: () => Promise<void>;
  addTicket: (data: { title: string; description: string; category: string; priority: string }) => Promise<Ticket | null>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<Ticket | null>;
  addComment: (ticketId: string, message: string, isInternal?: boolean) => Promise<TicketComment | null>;
  deleteTicket: (id: string) => Promise<boolean>;
  getTicketsByUser: (userId: string) => Ticket[];
  getTicketsByEngineer: (userId: string) => Ticket[];
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats | null>(null);
  const [engineers, setEngineers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshTickets = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const [ticketsData, statsData, engineersData] = await Promise.all([
        api.tickets.list({ limit: 100 }),
        api.stats.get(),
        api.users.list('engineer'),
      ]);
      setTickets(ticketsData.tickets);
      setStats(statsData);
      setEngineers(engineersData);
    } catch (err: any) {
      console.error('Error fetching tickets:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshTickets();
    } else {
      setTickets([]);
      setStats(null);
    }
  }, [isAuthenticated, user?.id, refreshTickets]);

  const addTicket = async (data: { title: string; description: string; category: string; priority: string }): Promise<Ticket | null> => {
    try {
      const newTicket = await api.tickets.create(data);
      setTickets((prev) => [newTicket, ...prev]);
      // Update local stats
      if (stats) {
        setStats({
          ...stats,
          total: stats.total + 1,
          open: stats.open + 1,
        });
      }
      toast(`Ticket ${newTicket.id} submitted successfully`, 'success');
      return newTicket;
    } catch (err: any) {
      toast(err.message || 'Failed to submit ticket', 'error');
      return null;
    }
  };

  const updateTicket = async (id: string, updates: Partial<Ticket>): Promise<Ticket | null> => {
    try {
      const updated = await api.tickets.update(id, updates);
      setTickets((prev) => prev.map((t) => (t.id === id ? updated : t)));
      refreshTickets();
      toast(`Ticket ${id} updated`, 'success');
      return updated;
    } catch (err: any) {
      toast(err.message || 'Failed to update ticket', 'error');
      return null;
    }
  };

  const addComment = async (ticketId: string, message: string, isInternal = false): Promise<TicketComment | null> => {
    try {
      const comment = await api.tickets.addComment(ticketId, message, isInternal);
      setTickets((prev) =>
        prev.map((t) =>
          t.id === ticketId
            ? { ...t, comments: [...t.comments, comment], updatedAt: new Date().toISOString() }
            : t
        )
      );
      toast(isInternal ? 'Internal note added' : 'Response posted', 'info');
      return comment;
    } catch (err: any) {
      toast(err.message || 'Failed to post comment', 'error');
      return null;
    }
  };

  const deleteTicket = async (id: string): Promise<boolean> => {
    try {
      await api.tickets.delete(id);
      setTickets((prev) => prev.filter((t) => t.id !== id));
      toast(`Ticket ${id} deleted`, 'info');
      refreshTickets();
      return true;
    } catch (err: any) {
      toast(err.message || 'Failed to delete ticket', 'error');
      return false;
    }
  };

  const getTicketsByUser = (userId: string) =>
    tickets.filter((t) => t.createdBy === userId);

  const getTicketsByEngineer = (userId: string) =>
    tickets.filter((t) => t.assignedTo === userId);

  return (
    <TicketContext.Provider
      value={{
        tickets,
        stats,
        engineers,
        loading,
        refreshTickets,
        addTicket,
        updateTicket,
        addComment,
        deleteTicket,
        getTicketsByUser,
        getTicketsByEngineer,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = (): TicketContextType => {
  const ctx = useContext(TicketContext);
  if (!ctx) throw new Error('useTickets must be used within TicketProvider');
  return ctx;
};
