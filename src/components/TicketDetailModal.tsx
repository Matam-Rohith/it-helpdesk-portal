import React, { useState } from 'react';
import { Ticket, TicketStatus, TicketPriority } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTickets } from '../context/TicketContext';
import { StatusBadge, PriorityBadge, CategoryBadge } from './Badge';
import {
  X,
  User,
  Building,
  Calendar,
  MessageSquare,
  History,
  Send,
  Lock,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

interface TicketDetailModalProps {
  ticket: Ticket | null;
  onClose: () => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({ ticket, onClose }) => {
  const { user } = useAuth();
  const { engineers, updateTicket, addComment, deleteTicket } = useTickets();
  const [activeTab, setActiveTab] = useState<'discussion' | 'history'>('discussion');
  const [newComment, setNewComment] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [resolutionInput, setResolutionInput] = useState(ticket?.resolutionNotes || '');
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!ticket) return null;

  const isStaff = user?.role === 'admin' || user?.role === 'engineer';
  const isAdmin = user?.role === 'admin';

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (newStatus === 'Resolved' && !ticket.resolutionNotes) {
      setShowResolveModal(true);
      return;
    }
    await updateTicket(ticket.id, { status: newStatus });
  };

  const handleConfirmResolve = async () => {
    if (!resolutionInput.trim()) return;
    await updateTicket(ticket.id, {
      status: 'Resolved',
      resolutionNotes: resolutionInput.trim(),
    });
    setShowResolveModal(false);
  };

  const handleAssign = async (engineerId: string) => {
    await updateTicket(ticket.id, {
      assignedTo: engineerId || '',
      status: engineerId ? (ticket.status === 'Open' ? 'Assigned' : ticket.status) : 'Open',
    });
  };

  const handlePriorityChange = async (priority: TicketPriority) => {
    await updateTicket(ticket.id, { priority });
  };

  const handleSendComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || submittingComment) return;

    setSubmittingComment(true);
    await addComment(ticket.id, newComment.trim(), isInternal);
    setNewComment('');
    setIsInternal(false);
    setSubmittingComment(false);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete ticket ${ticket.id}?`)) {
      return;
    }
    setIsDeleting(true);
    const success = await deleteTicket(ticket.id);
    setIsDeleting(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-6 overflow-y-auto">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded">
              {ticket.id}
            </span>
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
            <CategoryBadge category={ticket.category} />
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                title="Delete Ticket"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title & Description */}
          <div>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">{ticket.title}</h2>
            <div className="mt-3 p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </div>
          </div>

          {/* Quick Staff Controls (Admin / Engineer) */}
          {isStaff && (
            <div className="p-4 bg-blue-50/40 rounded-xl border border-blue-100 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-3 flex-wrap">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Assignee
                  </label>
                  <select
                    value={ticket.assignedTo || ''}
                    onChange={(e) => handleAssign(e.target.value)}
                    className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                  >
                    <option value="">Unassigned</option>
                    {engineers.map((eng) => (
                      <option key={eng.id} value={eng.id}>
                        {eng.name} ({eng.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                    className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                  >
                    <option value="Open">Open</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Priority
                  </label>
                  <select
                    value={ticket.priority}
                    onChange={(e) => handlePriorityChange(e.target.value as TicketPriority)}
                    className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {ticket.status !== 'Resolved' && (
                <button
                  onClick={() => setShowResolveModal(true)}
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors shadow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark Resolved
                </button>
              )}
            </div>
          )}

          {/* Resolution Banner if resolved */}
          {ticket.status === 'Resolved' && ticket.resolutionNotes && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Resolution Details
              </div>
              <p className="text-sm text-emerald-950 mt-1 leading-relaxed">{ticket.resolutionNotes}</p>
              {ticket.resolvedAt && (
                <p className="text-xs text-emerald-700/80 mt-2">
                  Resolved on {new Date(ticket.resolvedAt).toLocaleString()}
                </p>
              )}
            </div>
          )}

          {/* Ticket Metadata Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-slate-500">Requester</p>
                <p className="font-semibold text-slate-800">{ticket.createdByName}</p>
                {ticket.createdByDepartment && (
                  <p className="text-[11px] text-slate-500">{ticket.createdByDepartment}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-slate-500">Submitted</p>
                <p className="font-semibold text-slate-800">
                  {new Date(ticket.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-[11px] text-slate-500">
                  {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-slate-500">Assignee</p>
                <p className="font-semibold text-slate-800">
                  {ticket.assignedToName || 'Unassigned'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {ticket.assignedToName ? 'Assigned Engineer' : 'Awaiting dispatch'}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs: Discussion vs Audit History */}
          <div className="border-t border-slate-200 pt-4">
            <div className="flex items-center gap-6 border-b border-slate-200 mb-4">
              <button
                onClick={() => setActiveTab('discussion')}
                className={`flex items-center gap-2 pb-2.5 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
                  activeTab === 'discussion'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Discussion ({ticket.comments?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 pb-2.5 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
                  activeTab === 'history'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <History className="w-4 h-4" />
                Audit Trail ({ticket.activities?.length || 0})
              </button>
            </div>

            {/* Discussion Tab Content */}
            {activeTab === 'discussion' && (
              <div className="space-y-4">
                {ticket.comments && ticket.comments.length > 0 ? (
                  <div className="space-y-3">
                    {ticket.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className={`p-4 rounded-xl text-sm border ${
                          comment.isInternal
                            ? 'bg-amber-50/70 border-amber-200/90 text-amber-950'
                            : comment.authorId === user?.id
                            ? 'bg-blue-50/60 border-blue-200 text-slate-800'
                            : 'bg-white border-slate-200 text-slate-800 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-xs text-slate-900">
                              {comment.authorName}
                            </span>
                            <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-200/70 text-slate-700 capitalize">
                              {comment.authorRole}
                            </span>
                            {comment.isInternal && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-200/80 px-1.5 py-0.5 rounded">
                                <Lock className="w-3 h-3" /> Internal Note
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-slate-400">
                            {new Date(comment.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap">{comment.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">
                    No comments yet. Leave a reply or update below.
                  </p>
                )}

                {/* Comment Input */}
                <form onSubmit={handleSendComment} className="pt-2">
                  <div className="border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white shadow-sm">
                    <textarea
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={
                        isInternal
                          ? 'Add an internal note (only visible to engineers and admins)...'
                          : 'Write a response or update to the requester...'
                      }
                      className="w-full p-3 text-sm focus:outline-none resize-none placeholder-slate-400"
                    />

                    <div className="px-3 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      {isStaff ? (
                        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={isInternal}
                            onChange={(e) => setIsInternal(e.target.checked)}
                            className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                          />
                          <Lock className="w-3 h-3 text-amber-600" />
                          <span>Internal Note</span>
                        </label>
                      ) : (
                        <div />
                      )}

                      <button
                        type="submit"
                        disabled={submittingComment || !newComment.trim()}
                        className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {/* Audit History Tab Content */}
            {activeTab === 'history' && (
              <div className="space-y-3 py-2">
                {ticket.activities && ticket.activities.length > 0 ? (
                  <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                    {ticket.activities.map((act) => (
                      <div key={act.id} className="relative text-xs">
                        <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white" />
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{act.actorName}</span>
                          <span className="text-slate-600">{act.action}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {new Date(act.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4">No activity history recorded.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Last updated: {new Date(ticket.updatedAt).toLocaleString()}
          </span>
          <button onClick={onClose} className="btn-secondary text-xs py-1.5 px-4">
            Close
          </button>
        </div>
      </div>

      {/* Resolution Note Prompt Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 space-y-4 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Resolve Ticket {ticket.id}
            </h3>
            <p className="text-xs text-slate-600">
              Please document the solution steps and root cause before closing this ticket.
            </p>
            <textarea
              rows={3}
              value={resolutionInput}
              onChange={(e) => setResolutionInput(e.target.value)}
              placeholder="e.g. Cleared stuck spooler sensor, reseated cable, pushed updated network profile..."
              className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResolveModal(false)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!resolutionInput.trim()}
                onClick={handleConfirmResolve}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-1.5 px-4 rounded-lg disabled:opacity-50"
              >
                Confirm Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
