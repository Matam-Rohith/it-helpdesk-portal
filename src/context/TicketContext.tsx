import React, { createContext, useContext, useState, useEffect } from 'react';
import { Ticket, TicketContextType } from '../types';
import { SAMPLE_TICKETS } from '../data/sampleData';

const TicketContext = createContext<TicketContextType | undefined>(undefined);

const STORAGE_KEY = 'helpdesk_tickets';

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return SAMPLE_TICKETS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }, [tickets]);

  const addTicket = (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const id = 'TKT-' + String(Date.now()).slice(-6);
    const newTicket: Ticket = { ...ticket, id, createdAt: now, updatedAt: now };
    setTickets((prev) => [newTicket, ...prev]);
  };

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      )
    );
  };

  const getTicketsByUser = (userId: string) =>
    tickets.filter((t) => t.createdBy === userId);

  const getTicketsByEngineer = (userId: string) =>
    tickets.filter((t) => t.assignedTo === userId);

  return (
    <TicketContext.Provider value={{ tickets, addTicket, updateTicket, getTicketsByUser, getTicketsByEngineer }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = (): TicketContextType => {
  const ctx = useContext(TicketContext);
  if (!ctx) throw new Error('useTickets must be used within TicketProvider');
  return ctx;
};
