import React, { useState } from 'react';
import { TicketCategory, TicketPriority } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import { X, Sparkles, AlertCircle } from 'lucide-react';

interface TicketFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const COMMON_TEMPLATES = [
  {
    label: 'VPN Tunnel Failure',
    title: 'Unable to connect to corporate VPN gateway',
    category: 'Network' as TicketCategory,
    priority: 'High' as TicketPriority,
    description: 'VPN client fails authentication on remote connection. Internet connection is stable, but tunnel handshake times out.',
  },
  {
    label: 'License Activation',
    title: 'Software activation license key expired or invalid',
    category: 'Software' as TicketCategory,
    priority: 'Medium' as TicketPriority,
    description: 'Application prompted that enterprise license expired today. Please renew or re-assign seat from admin console.',
  },
  {
    label: 'Monitor / Dock Issue',
    title: 'External display blanking out intermittently',
    category: 'Hardware' as TicketCategory,
    priority: 'Medium' as TicketPriority,
    description: 'Monitor connected via USB-C dock flickers black every few minutes. Cables have been reseated without resolution.',
  },
  {
    label: 'Printer Stalled',
    title: 'Shared floor printer offline / error code',
    category: 'Printer' as TicketCategory,
    priority: 'Medium' as TicketPriority,
    description: 'Floor printer queue is stalled with pending jobs. Machine displays paper jam or offline status.',
  },
];

const TicketForm: React.FC<TicketFormProps> = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const { addTicket } = useTickets();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Software' as TicketCategory,
    priority: 'Medium' as TicketPriority,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const applyTemplate = (tpl: (typeof COMMON_TEMPLATES)[0]) => {
    setForm({
      title: tpl.title,
      description: tpl.description,
      category: tpl.category,
      priority: tpl.priority,
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('Please provide a brief title describing the problem.');
      return;
    }
    if (form.description.trim().length < 10) {
      setError('Please provide a more detailed description (minimum 10 characters).');
      return;
    }

    setError('');
    setLoading(true);

    const ticket = await addTicket({
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      priority: form.priority,
    });

    setLoading(false);
    if (ticket) {
      onSuccess?.();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h2 className="text-base font-bold text-slate-900">Create Support Ticket</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Submitting as <span className="font-semibold text-slate-700">{user?.name}</span> ({user?.department})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Issue Presets */}
        <div className="px-6 pt-3.5 pb-2 border-b border-slate-100 bg-slate-50/30">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-blue-500" />
            Quick Presets
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_TEMPLATES.map((tpl) => (
              <button
                key={tpl.label}
                type="button"
                onClick={() => applyTemplate(tpl)}
                className="text-xs px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-blue-400 hover:text-blue-600 transition-colors"
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
              Subject / Summary <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Cannot access shared network drive Z:"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                Category
              </label>
              <select
                className="input-field"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as TicketCategory })}
              >
                {['Hardware', 'Software', 'Network', 'Email', 'Printer', 'Access & Security'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
                Priority
              </label>
              <select
                className="input-field"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value as TicketPriority })}
              >
                {['Low', 'Medium', 'High', 'Urgent'].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wide">
              Detailed Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              className="input-field resize-none leading-relaxed"
              rows={4}
              placeholder="Please describe symptoms, error messages, and troubleshooting steps already attempted..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="btn-secondary text-xs px-4 py-2">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-xs px-5 py-2 flex items-center justify-center gap-2"
            >
              {loading && (
                <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? 'Submitting...' : 'Submit Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;
