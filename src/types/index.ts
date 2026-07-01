export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue' | 'blocked';
export type DocumentStatus = 'draft' | 'review' | 'approved' | 'signed';
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

export interface Client {
  id: string;
  name: string;
  contact: string;
  email: string;
  address: string;
  remark: string;
}

export interface Meeting {
  id: string;
  projectId: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: string[];
  notes: string;
}

export interface CommunicationLog {
  id: string;
  projectId: string;
  date: string;
  type: 'email' | 'phone' | 'meeting' | 'site-visit';
  subject: string;
  summary: string;
  contactPerson: string;
}

export interface Document {
  id: string;
  projectId: string;
  type: 'report' | 'contract' | 'work-order';
  title: string;
  status: DocumentStatus;
  lastUpdated: string;
  version: string;
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
}

export interface LabourRequirement {
  crewSize: number;
  estimatedHours: number;
  estimatedLabourCost?: number;
  actualLabourCost?: number;
}

export interface FinanceRequirement {
  allocatedBudget: number;
  contingency: number;
}

export interface Invoice {
  id: string;
  projectId: string;
  number: string;
  date: string;
  dueDate: string;
  amount: number;
  status: InvoiceStatus;
  description: string;
}

export interface Task {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: TaskStatus;
  startDate: string;
  endDate: string;
  employeeId: string;
  estimatedCost: number;
  actualCost: number;
  materials: Material[];
  labourRequirement: LabourRequirement;
  financeRequirement: FinanceRequirement;
  dependencies: string[];
  errors: string[];
}

export interface Project {
  id: string;
  name: string;
  type: string;
  location: string;
  description: string;
  status: ProjectStatus;
  clientId: string;
  startDate: string;
  endDate: string;
  estimatedBudget: number;
  actualSpend: number;
  progress: number;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
}

export interface Activity {
  id: string;
  projectId: string;
  date: string;
  type: string;
  description: string;
}