import { Router, Response } from 'express';
import { db } from '../db';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { TicketCategory, TicketPriority, TicketStatus } from '../../src/types';

const router = Router();

// GET /api/tickets - list tickets with filtering and pagination
router.get('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const {
    status,
    priority,
    category,
    assignedTo,
    createdBy,
    search,
    sortBy,
    sortOrder,
    page,
    limit,
    scope,
  } = req.query;

  const user = req.user!;
  const filters: any = {
    status: status as string,
    priority: priority as string,
    category: category as string,
    assignedTo: assignedTo as string,
    createdBy: createdBy as string,
    search: search as string,
    sortBy: sortBy as any,
    sortOrder: sortOrder as any,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 25,
  };

  // Role scoping logic:
  // If employee views without explicit createdBy, scope to their own tickets by default if requested
  if (scope === 'mine' || user.role === 'employee') {
    filters.createdBy = user.id;
  } else if (scope === 'assigned' || (user.role === 'engineer' && !assignedTo)) {
    filters.assignedTo = user.id;
  }

  const result = db.getTickets(filters);
  return res.json(result);
});

// GET /api/tickets/:id - get single ticket
router.get('/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const ticket = db.getTicketById(id);

  if (!ticket) {
    return res.status(404).json({ error: `Ticket ${id} not found.` });
  }

  // Hide internal notes from standard employees if needed, or filter
  if (req.user?.role === 'employee' && ticket.createdBy !== req.user.id) {
    // Check permission - employees can only view their own tickets
    return res.status(403).json({ error: 'You do not have permission to view this ticket.' });
  }

  const comments = ticket.comments.filter((c) => {
    if (req.user?.role === 'employee' && c.isInternal) {
      return false; // internal notes are hidden from regular employees
    }
    return true;
  });

  return res.json({ ...ticket, comments });
});

// POST /api/tickets - create new ticket
router.post('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { title, description, category, priority } = req.body;
  const user = req.user!;

  if (!title || typeof title !== 'string' || title.trim().length < 5) {
    return res.status(400).json({ error: 'Ticket title must be at least 5 characters long.' });
  }

  if (!description || typeof description !== 'string' || description.trim().length < 10) {
    return res.status(400).json({ error: 'Please provide a detailed description (minimum 10 characters).' });
  }

  const validCategories: TicketCategory[] = ['Hardware', 'Software', 'Network', 'Email', 'Printer', 'Access & Security'];
  const validPriorities: TicketPriority[] = ['Low', 'Medium', 'High', 'Urgent'];

  const finalCategory = validCategories.includes(category) ? category : 'Software';
  const finalPriority = validPriorities.includes(priority) ? priority : 'Medium';

  const newTicket = db.createTicket({
    title,
    description,
    category: finalCategory,
    priority: finalPriority,
    creator: user,
  });

  return res.status(201).json(newTicket);
});

// PATCH /api/tickets/:id - update status, assignment, priority, or resolution
router.patch('/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const { status, priority, category, assignedTo, resolutionNotes } = req.body;
  const user = req.user!;

  const existing = db.getTicketById(id);
  if (!existing) {
    return res.status(404).json({ error: `Ticket ${id} not found.` });
  }

  // Authorization check
  if (user.role === 'employee') {
    return res.status(403).json({ error: 'Employees cannot reassign or update ticket statuses directly.' });
  }

  const updates: any = {};
  if (status) updates.status = status as TicketStatus;
  if (priority) updates.priority = priority as TicketPriority;
  if (category) updates.category = category as TicketCategory;
  if (assignedTo !== undefined) updates.assignedTo = assignedTo;
  if (resolutionNotes !== undefined) updates.resolutionNotes = resolutionNotes;

  const updatedTicket = db.updateTicket(id, updates, user);
  return res.json(updatedTicket);
});

// POST /api/tickets/:id/comments - add reply or internal note
router.post('/:id/comments', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const { message, isInternal } = req.body;
  const user = req.user!;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  const ticket = db.getTicketById(id);
  if (!ticket) {
    return res.status(404).json({ error: `Ticket ${id} not found.` });
  }

  // Employees cannot post internal notes
  const isInternalNote = user.role !== 'employee' && Boolean(isInternal);

  const comment = db.addComment(id, { message, isInternal: isInternalNote }, user);
  return res.status(201).json(comment);
});

// DELETE /api/tickets/:id - delete ticket (admin only)
router.delete('/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const id = req.params.id as string;
  const user = req.user!;

  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Only administrators can delete tickets.' });
  }

  const deleted = db.deleteTicket(id);
  if (!deleted) {
    return res.status(404).json({ error: `Ticket ${id} not found.` });
  }

  return res.json({ success: true, message: `Ticket ${id} was deleted.` });
});

export default router;
