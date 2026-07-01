# ConstConsult — Construction Project Dashboard

A web dashboard application for a construction consultancy company to manage construction projects, client communication, documentation, budgets, and task scheduling.

## Business Overview

The work of the company is to give construction consultancy and project management for the client.

### Per Project
- **Project basis info**: type, location, description
- **Client communication**: client info (name, contact, address, remark), meeting schedule
- **Written documentation**: detailed project report, project contract, work order
- **Cost and budget management**: estimate, billing, invoices
- **Construction management**: task management (schedule), material requirement per task, employee assigned, error handling

### Workflow

A client reaches out for a project.

First there is meeting for the project design with company affiliated architect, after detailed project report, there is cost estimation and final quotation of the project.

After the project contract is signed, the work is started for the project, the entire project is broken into multiple task (also discussed in detailed project report), which can be executed parallely or in specific order. Each task has a timeline, material requirement, labour requirement and finance requirement. Also an employee is delegated the responsibility of each task.

The material and labour cost is aggregated for each task to compare it with the final total project estimated labour and material cost.

All communication with the client is processed with the client in regards to project and its task progress.

There is strict task schedule and the admin is able to view the upcoming schedule and its task detail.

The dashboard should feel less cluttered and easy to use.

---

## Technical Setup

### Prerequisites
- Node.js 18+ and npm

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Open http://localhost:5173 in your browser.

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Tech Stack
- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- Local state via React Context with mock/sample data (no backend required)

## Application Features

| Section | Description |
|---------|-------------|
| **Dashboard** | KPI cards, upcoming schedule, meetings, recent activity |
| **Projects** | Searchable/filterable project cards with status badges |
| **Project Detail** | Tabbed views: Overview, Client, Documents, Budget, Tasks |
| **Schedule** | Timeline of upcoming tasks and meetings across all projects |
| **Clients** | Client directory with project associations |
| **Settings** | Profile, company info, notifications, team members |

## Sample Data

The app ships with 5 sample projects at different workflow stages:
1. **Riverside Office Complex** (Active) — Commercial, Portland OR
2. **Greenfield Eco Homes** (Planning) — Residential, Seattle WA
3. **Metro Bridge Rehabilitation** (Active) — Infrastructure, Denver CO
4. **Heritage Town Hall Restoration** (On Hold) — Restoration, Boston MA
5. **Oakwood Community Center Renovation** (Completed) — Commercial, Portland OR

Each project includes tasks, clients, meetings, documents, invoices, and communication logs.