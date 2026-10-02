import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Navbar } from './Navbar';
import TicketForm from './TicketForm';
import { TicketDetailModal } from './TicketDetailModal';
import { Ticket } from '../types';

export const AppLayout: React.FC = () => {
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onOpenNewTicket={() => setShowNewTicketModal(true)} />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet context={{ onSelectTicket: setSelectedTicket, onOpenCreate: () => setShowNewTicketModal(true) }} />
        </main>
      </div>

      {showNewTicketModal && (
        <TicketForm onClose={() => setShowNewTicketModal(false)} />
      )}

      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
};
