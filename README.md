# IT Help Desk Portal

A full-stack enterprise IT service desk and support ticketing application built with React, TypeScript, Express, and Tailwind CSS. Supports complete role-based workflows for System Administrators, Support Engineers, and Staff Employees.

## Core Features

- **Full-Stack Architecture**: Express REST API backend with in-memory persistence and seed data, paired with a React 18 SPA frontend.
- **Role-Based Access Control**:
  - **Employee**: File requests, select issue presets, monitor status, converse with technicians.
  - **Support Engineer**: Claim unassigned tickets, manage assigned queue, post public replies & private internal notes, log root cause solutions.
  - **Administrator**: Global queue triage, reassign tickets to engineers, view analytics by category and priority, audit timeline logs, manage tickets.
- **Discussion & Audit Trail**:
  - Threaded conversation between requester and technicians.
  - Internal IT Staff notes (hidden from employees).
  - Comprehensive audit trail logging every status change, reassignment, and comment with timestamps.
- **Advanced Queue Filtering & Sorting**:
  - Multi-attribute filtering (Status, Priority, Category, Assignee, Organization vs My Queue).
  - Multi-column sort (ID, Subject, Category, Priority, Status, Creation Date).
  - CSV export for reporting and analysis.
- **Enterprise UI/UX**:
  - Responsive layout with collapsible sidebar and top status bar.
  - Notification toast system for instant feedback.
  - Mobile card view for phones and small screens.

## Quick Test Credentials

| Role | Username | Password | Default User |
|------|----------|----------|--------------|
| **System Admin** | `admin` | `admin123` | Alex Johnson (IT Infrastructure) |
| **Support Engineer** | `engineer` | `engineer123` | David Chen (Systems Support) |
| **Support Engineer** | `maya.engineer` | `engineer123` | Maya Patel (Network Operations) |
| **Employee** | `employee` | `employee123` | Sarah Miller (Marketing & Brand) |
| **Employee** | `james.sales` | `employee123` | James Wilson (Enterprise Sales) |

*Tip: The login page includes quick-fill buttons for instant testing.*

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, React Router v6, Lucide Icons
- **Backend**: Express, CORS, Node.js (via `tsx`)
- **Build & Dev Tool**: Vite 5
- **Deployment Ready**: Render (`npm start`) & Vercel (`api/index.ts` + `vercel.json`)

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run the development server (Express backend + Vite HMR)
npm run dev

# 3. Open in browser at http://localhost:3000
```

## Production & Deployment

### Build
```bash
npm run build
```

### Running on Render / Railway / Docker
1. Build Command: `npm run build`
2. Start Command: `npm start`
3. Environment: Node 18+ (Node 20 or 22 recommended)

### Deploying to Vercel
1. Import repository into Vercel.
2. The project contains `vercel.json` and `api/index.ts` which automatically routes `/api/*` to the serverless function and all other routes to the Vite single-page app.
3. Build Command: `npm run build`
4. Output Directory: `dist`
