// ============================================================================
// Enums
// ============================================================================

export enum UserRole {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export enum LifecycleStage {
  LEAD = "LEAD",
  QUALIFIED = "QUALIFIED",
  CUSTOMER = "CUSTOMER",
  CHURNED = "CHURNED",
}

export enum DealStage {
  PROSPECTING = "PROSPECTING",
  QUALIFICATION = "QUALIFICATION",
  PROPOSAL = "PROPOSAL",
  NEGOTIATION = "NEGOTIATION",
  CLOSED_WON = "CLOSED_WON",
  CLOSED_LOST = "CLOSED_LOST",
}

export enum ActivityType {
  CALL = "CALL",
  EMAIL = "EMAIL",
  MEETING = "MEETING",
  NOTE = "NOTE",
  TASK = "TASK",
}

// ============================================================================
// Core Entity Interfaces
// ============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  position: string;
  lifecycleStage: LifecycleStage;
  tags: string[];
  notes: string;
  workspaceId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  website: string;
  size: string;
  address: string;
  tags: string[];
  workspaceId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number;
  contactId: string;
  companyId: string;
  ownerId: string;
  expectedCloseDate: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  subject: string;
  description: string;
  contactId?: string;
  companyId?: string;
  dealId?: string;
  userId: string;
  dueDate?: string;
  completed: boolean;
  workspaceId: string;
  createdAt: string;
}

export interface DashboardStats {
  totalContacts: number;
  totalCompanies: number;
  totalDeals: number;
  openDealsValue: number;
  wonDealsValue: number;
  recentActivities: Activity[];
}

// ============================================================================
// DTOs - Create Operations
// ============================================================================

export type CreateUserDTO = Pick<
  User,
  "email" | "firstName" | "lastName" | "role" | "workspaceId"
>;

export type CreateWorkspaceDTO = Pick<Workspace, "name" | "slug">;

export type CreateContactDTO = Pick<
  Contact,
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "position"
  | "lifecycleStage"
  | "tags"
  | "notes"
  | "workspaceId"
  | "createdBy"
> & {
  company?: string;
};

export type CreateCompanyDTO = Pick<
  Company,
  | "name"
  | "industry"
  | "website"
  | "size"
  | "address"
  | "tags"
  | "workspaceId"
  | "createdBy"
>;

export type CreateDealDTO = Pick<
  Deal,
  | "title"
  | "value"
  | "currency"
  | "stage"
  | "probability"
  | "contactId"
  | "companyId"
  | "ownerId"
  | "expectedCloseDate"
  | "workspaceId"
>;

export type CreateActivityDTO = Pick<
  Activity,
  "type" | "subject" | "description" | "userId" | "completed" | "workspaceId"
> & {
  contactId?: string;
  companyId?: string;
  dealId?: string;
  dueDate?: string;
};

// ============================================================================
// DTOs - Update Operations
// ============================================================================

export type UpdateUserDTO = Partial<
  Pick<User, "email" | "firstName" | "lastName" | "role">
>;

export type UpdateWorkspaceDTO = Partial<Pick<Workspace, "name" | "slug">>;

export type UpdateContactDTO = Partial<
  Pick<
    Contact,
    | "firstName"
    | "lastName"
    | "email"
    | "phone"
    | "company"
    | "position"
    | "lifecycleStage"
    | "tags"
    | "notes"
  >
>;

export type UpdateCompanyDTO = Partial<
  Pick<
    Company,
    "name" | "industry" | "website" | "size" | "address" | "tags"
  >
>;

export type UpdateDealDTO = Partial<
  Pick<
    Deal,
    | "title"
    | "value"
    | "currency"
    | "stage"
    | "probability"
    | "contactId"
    | "companyId"
    | "ownerId"
    | "expectedCloseDate"
  >
>;

export type UpdateActivityDTO = Partial<
  Pick<
    Activity,
    | "type"
    | "subject"
    | "description"
    | "contactId"
    | "companyId"
    | "dealId"
    | "dueDate"
    | "completed"
  >
>;
