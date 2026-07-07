# IT Help Desk Ticketing Portal

A responsive, production-quality IT Help Desk Ticketing Portal built with **React + TypeScript + Vite + Tailwind CSS**.

## Live Demo

Deploy directly to Vercel — no configuration required.

## Features

- Role-based dashboards for Admin, Employee, and Support Engineer
- LocalStorage-backed session persistence (stays logged in after refresh)
- 10 preloaded sample tickets across all statuses and categories
- Full ticket lifecycle: Create → Assign → In Progress → Resolved
- Search and filter tickets by status
- Responsive sidebar navigation (mobile-friendly)
- Status and priority badges
- Ticket detail modals
- Loading animations and empty state screens

## Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Employee | `employee` | `employee123` |
| Support Engineer | `engineer` | `engineer123` |

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router v6
- Lucide React Icons
- LocalStorage (no backend)

## Getting Started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Folder Structure

```
src/
  components/     # Sidebar, StatCard, Badge, TicketTable, TicketForm
  context/        # AuthContext, TicketContext
  data/           # Sample tickets and users
  pages/          # Login, AdminDashboard, EmployeeDashboard, EngineerDashboard
  types/          # TypeScript interfaces
```

## Ticket Flow

1. Employee creates a ticket (status: Open)
2. Admin views and assigns ticket to Engineer (status: Assigned)
3. Engineer marks ticket In Progress
4. Engineer marks ticket Resolved
5. Employee sees updated status in real time

## Deployment

Deploy to Vercel with zero configuration. Push to GitHub and import the repo in Vercel.
