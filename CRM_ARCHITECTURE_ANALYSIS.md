# CRM Architecture Analysis

A comprehensive analysis of leading CRM platforms — both open-source and proprietary — to inform the architecture and feature set of our CRM demo application.

---

## Table of Contents

1. [Open-Source CRM Platforms](#open-source-crm-platforms)
2. [Proprietary CRM Platforms](#proprietary-crm-platforms)
3. [Common Architectural Patterns](#common-architectural-patterns)
4. [Unified Feature Matrix](#unified-feature-matrix)
5. [Recommended Architecture](#recommended-architecture)

---

## Open-Source CRM Platforms

### 1. Twenty CRM

**Stack:** TypeScript, React, NestJS, PostgreSQL, GraphQL
**Repository:** github.com/twentyhq/twenty
**License:** AGPL-3.0

#### Architecture Highlights
- **Monorepo structure** using Nx workspaces with clearly separated `front` and `server` packages
- **GraphQL API** as the primary interface between frontend and backend
- **PostgreSQL** with a metadata-driven schema — supports custom objects and fields at runtime
- **Event-driven architecture** using internal event bus for side effects (activity logging, webhooks)
- **Module system** on the backend (NestJS modules) for clean separation: contacts, companies, pipelines, tasks, etc.

#### Key Features
- Customizable data model (users can create custom objects/fields)
- Kanban-style pipeline views
- Email integration and activity timeline
- Full-text search across records
- Workspace/multi-tenancy support
- REST and GraphQL API access
- Import/export (CSV)

#### UX/UI Patterns
- Clean, modern UI inspired by Notion
- Inline editing on record views
- Command palette (Cmd+K) for quick navigation
- Table view with sortable/filterable columns
- Record detail pages with tabbed sections (timeline, tasks, notes, emails)

---

### 2. Huly (formerly Hardcore)

**Stack:** TypeScript, Svelte, Node.js, MongoDB (custom platform layer)
**Repository:** github.com/hcengineering/platform
**License:** EPL-2.0

#### Architecture Highlights
- **Platform/plugin architecture** — core kernel with pluggable modules
- **Custom reactive framework** built on Svelte with a transactional object model
- **Collaborative-first** — real-time collaboration baked into the core (similar to Figma)
- **Chunk-based storage** with a custom object model instead of a traditional ORM
- **Hybrid data layer** — MongoDB for documents, with an in-memory transactional model on the client

#### Key Features
- Project management with issues, sprints, and boards
- HR module (recruiting, onboarding)
- Contact/lead management
- Document management with rich-text editor
- Real-time collaboration on all entities
- Notification system
- Customizable workflows

#### UX/UI Patterns
- Dense, productivity-focused UI (similar to Linear)
- Sidebar navigation with collapsible sections
- Real-time presence indicators
- Drag-and-drop across views
- Markdown-native document editing

---

### 3. ERPNext (with CRM module)

**Stack:** Python (Frappe Framework), MariaDB/PostgreSQL, Redis, JavaScript
**Repository:** github.com/frappe/erpnext
**License:** GPL-3.0

#### Architecture Highlights
- **Frappe Framework** — a full-stack meta-framework with built-in ORM, REST API, and admin UI
- **DocType-driven architecture** — every entity is a "DocType" with schema defined in JSON, auto-generating forms, APIs, and database tables
- **Server-side rendering** with Jinja2 templates, plus a client-side JS framework
- **Role-based permissions** deeply integrated into the ORM layer
- **Workflow engine** for approval processes and state machines
- **Background job queue** via Redis/RQ for async tasks

#### Key Features
- Lead, opportunity, and customer management
- Sales pipeline with stages
- Quotation and sales order generation
- Email campaigns and templates
- Territory and sales team management
- Reporting and analytics dashboards
- Integration with full ERP (accounting, inventory, HR)

#### UX/UI Patterns
- Form-centric UI with auto-generated fields from DocType schema
- List views with filters, grouping, and saved views
- Dashboard with KPI cards and charts
- Print format designer
- Workspace pages (customizable landing pages per module)

---

### 4. Monica CRM (Personal CRM)

**Stack:** PHP (Laravel), Vue.js, MySQL/PostgreSQL
**Repository:** github.com/monicahq/monica
**License:** AGPL-3.0

#### Architecture Highlights
- **Laravel MVC** — classic server-rendered architecture with Vue.js components for interactivity
- **Multi-tenant via Vault concept** — each user has a "vault" containing their contacts
- **RESTful API** with comprehensive endpoints for all entities
- **Queue-based** background jobs for reminders, email sending
- **Simple, focused data model** — contacts, activities, notes, reminders, groups

#### Key Features
- Contact management with relationship mapping
- Activity logging (calls, meetings, notes)
- Reminders and follow-up scheduling
- Journal/diary entries
- Gift tracking and important date reminders
- Groups and tags
- Import/export (vCard, CSV)
- API for third-party integrations

#### UX/UI Patterns
- Simple, personal-journal-style UI
- Contact profile pages with timeline
- Relationship graph visualization
- Tag-based organization
- Mobile-responsive design

---

### 5. SuiteCRM

**Stack:** PHP, MySQL, Smarty templates (legacy), Angular (SuiteCRM 8)
**Repository:** github.com/salesagility/SuiteCRM-Core
**License:** AGPL-3.0

#### Architecture Highlights
- **SuiteCRM 8** rebuilt with a Symfony backend and Angular frontend (decoupled)
- **GraphQL API** layer between Angular frontend and Symfony backend
- **Legacy module compatibility** — can run SuiteCRM 7 modules via a compatibility layer
- **Module builder** for creating custom modules without code
- **Workflow engine** and scheduler for automated actions

#### Key Features
- Full sales pipeline (leads, contacts, accounts, opportunities)
- Campaign management (email, web-to-lead)
- Case/support management
- Reporting with saved reports and dashboards
- Role-based access control
- Workflow automation (conditions → actions)
- PDF generation for quotes and invoices

#### UX/UI Patterns
- Traditional CRM layout with top navigation and module tabs
- List/detail view pattern
- Dashlets (configurable dashboard widgets)
- Quick-create forms
- Subpanels on detail views showing related records

---

## Proprietary CRM Platforms

### 6. HubSpot CRM

**Known Stack:** Java (backend), React (frontend), HBase/MySQL, Kafka, Elasticsearch

#### Architecture Highlights (Inferred)
- **Microservices architecture** — separate services for contacts, deals, marketing, etc.
- **Event streaming** via Kafka for real-time data flow between modules
- **Custom object support** with flexible schema
- **App marketplace / extension platform** with OAuth-based integrations
- **Multi-hub model** — Marketing Hub, Sales Hub, Service Hub, CMS Hub, Operations Hub

#### Key Features
- Contact & company management with lifecycle stages
- Deal pipeline with customizable stages
- Email tracking and sequences (automated follow-ups)
- Meeting scheduler
- Live chat and chatbot builder
- Marketing automation (workflows, email campaigns)
- Reporting dashboards with custom reports
- App marketplace with 1,500+ integrations
- Free tier with generous limits

#### UX/UI Patterns
- Clean, approachable UI targeting non-technical users
- Drag-and-drop pipeline boards
- Activity timeline on record views
- Sidebar panels for quick viewing without leaving context
- Global search with filters
- Contextual help and guided setup flows

---

### 7. Salesforce

**Known Stack:** Java/Apex (backend), Lightning Web Components (frontend), Oracle DB

#### Architecture Highlights (Inferred)
- **Multi-tenant architecture** — all customers share infrastructure, isolated by org ID
- **Metadata-driven platform** — everything (objects, fields, layouts, workflows) defined as metadata
- **Apex** — proprietary server-side language (Java-like) for custom business logic
- **Lightning Platform** — PaaS for building apps on top of Salesforce data
- **Heroku Connect** for bridging to external databases
- **Event Bus (Platform Events)** for pub/sub messaging across components

#### Key Features
- Complete CRM suite (Sales Cloud, Service Cloud, Marketing Cloud, Commerce Cloud)
- Highly customizable data model (custom objects, fields, relationships)
- Process automation (Flows, Process Builder, Apex triggers)
- Einstein AI — predictive lead scoring, opportunity insights
- AppExchange marketplace (5,000+ apps)
- Advanced reporting and dashboards
- Territory management and forecasting
- Omni-channel routing for support

#### UX/UI Patterns
- Lightning Experience — component-based UI framework
- Record pages with configurable layouts (multiple columns, tabs, components)
- List views with inline editing
- Utility bar (persistent footer toolbar)
- App Launcher for switching between apps
- Kanban views for pipelines
- Split view (list + detail side by side)

---

## Common Architectural Patterns

Across all analyzed CRM platforms, the following patterns emerge:

### 1. Data Model
| Pattern | Description |
|---------|-------------|
| **Core entities** | Contacts, Companies/Accounts, Deals/Opportunities, Activities, Notes |
| **Relationship mapping** | Many-to-many between contacts and companies; hierarchical accounts |
| **Custom fields/objects** | Nearly all modern CRMs support extending the data model at runtime |
| **Tags/Labels** | Flexible categorization across all entity types |
| **Lifecycle stages** | Contacts and deals progress through configurable stages |

### 2. Backend Architecture
| Pattern | Description |
|---------|-------------|
| **API-first** | REST or GraphQL APIs as the primary interface |
| **Event-driven** | Side effects (notifications, logging, webhooks) triggered by events |
| **Background jobs** | Async processing for email, reports, imports |
| **Role-based access** | Granular permissions at object, field, and record level |
| **Multi-tenancy** | Workspace/organization-level data isolation |

### 3. Frontend Architecture
| Pattern | Description |
|---------|-------------|
| **SPA with component framework** | React, Vue, Svelte, or Angular for rich interactivity |
| **Table + Kanban views** | Dual view modes for list data |
| **Record detail pages** | Dedicated pages with tabs/sections for each entity |
| **Inline editing** | Edit fields directly in table or detail view |
| **Command palette** | Quick navigation (Cmd+K pattern) |
| **Dashboard with widgets** | Configurable KPI cards, charts, and activity feeds |

### 4. Integration Patterns
| Pattern | Description |
|---------|-------------|
| **Email integration** | Send/receive email, track opens, sync with inbox |
| **Calendar sync** | Two-way sync with Google Calendar, Outlook |
| **Webhooks** | Push notifications to external systems on events |
| **REST/GraphQL API** | Full programmatic access for third-party apps |
| **Import/Export** | CSV, vCard, and bulk data operations |

---

## Unified Feature Matrix

| Feature | Twenty | Huly | ERPNext | Monica | SuiteCRM | HubSpot | Salesforce |
|---------|--------|------|---------|--------|----------|---------|------------|
| Contact Management | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Company/Account Mgmt | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Deal/Opportunity Pipeline | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Activity Timeline | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Email Integration | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Task Management | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Custom Fields/Objects | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Workflow Automation | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Reporting/Dashboards | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ |
| API Access | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Multi-tenancy | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Real-time Collaboration | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Import/Export | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Campaign Management | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| AI/ML Features | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |

---

## Recommended Architecture

Based on the analysis above, here is the recommended architecture for our CRM demo:

### Tech Stack

| Layer | Recommendation | Rationale |
|-------|---------------|-----------|
| **Frontend** | React + TypeScript | Most widely adopted; massive ecosystem; used by Twenty and HubSpot |
| **State Management** | Zustand or Jotai | Lightweight, modern alternatives to Redux |
| **UI Framework** | Tailwind CSS + Radix UI | Utility-first styling with accessible primitives |
| **API Layer** | GraphQL (Apollo) | Flexible querying; used by Twenty and SuiteCRM 8 |
| **Backend** | Node.js (NestJS) | TypeScript end-to-end; modular architecture; used by Twenty |
| **Database** | PostgreSQL | Best support for JSONB (custom fields), full-text search, and relational data |
| **Cache/Queue** | Redis | Session storage, job queue, real-time pub/sub |
| **Search** | PostgreSQL FTS (start) → Elasticsearch (scale) | Start simple, upgrade when needed |
| **Auth** | JWT + OAuth 2.0 | Industry standard; supports SSO |

### Data Model (Core Entities)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Workspace  │────▶│    User      │────▶│   Activity   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                                        │
       ▼                                        ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Contact    │◀───▶│   Company    │     │    Note      │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│    Deal      │────▶│  Pipeline    │
│ (Opportunity)│     │   Stage      │
└─────────────┘     └─────────────┘
       │
       ▼
┌─────────────┐
│    Task      │
└─────────────┘
```

### Module Structure

```
crm-demo/
├── apps/
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── components/     # Shared UI components
│   │   │   ├── modules/        # Feature modules
│   │   │   │   ├── contacts/
│   │   │   │   ├── companies/
│   │   │   │   ├── deals/
│   │   │   │   ├── activities/
│   │   │   │   └── dashboard/
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── graphql/        # Queries & mutations
│   │   │   └── utils/
│   │   └── package.json
│   │
│   └── server/                 # NestJS backend
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── contacts/
│       │   │   ├── companies/
│       │   │   ├── deals/
│       │   │   ├── activities/
│       │   │   ├── search/
│       │   │   └── webhooks/
│       │   ├── common/         # Shared utilities, guards, interceptors
│       │   ├── database/       # Migrations, seeds, entities
│       │   └── graphql/        # Schema, resolvers
│       └── package.json
│
├── packages/
│   └── shared/                 # Shared types, constants, validation
│
├── nx.json                     # Monorepo config
└── package.json
```

### Key Architectural Decisions

1. **Monorepo with Nx** — Shared types between frontend and backend; coordinated builds
2. **GraphQL over REST** — Flexible querying for complex relational data; subscriptions for real-time
3. **PostgreSQL JSONB for custom fields** — Store user-defined fields as JSONB while keeping core fields as typed columns
4. **Event-driven side effects** — Use NestJS event emitter for activity logging, notifications, webhooks
5. **Multi-tenant by workspace** — Row-level security via workspace_id on all tables
6. **Feature-module pattern** — Each domain (contacts, deals, etc.) is a self-contained NestJS module and React module

### MVP Feature Priorities (Phase 1)

1. **Auth & Workspace** — Sign up, login, invite team members
2. **Contact & Company Management** — CRUD, search, filtering, tags
3. **Deal Pipeline** — Kanban board with drag-and-drop stage management
4. **Activity Timeline** — Log calls, emails, meetings on contact/deal records
5. **Dashboard** — KPI cards (total contacts, open deals, deal value) and recent activity feed
6. **Import/Export** — CSV import for contacts and companies

---

*Analysis completed February 2026. Based on publicly available information about each platform's architecture, source code, and documentation.*
