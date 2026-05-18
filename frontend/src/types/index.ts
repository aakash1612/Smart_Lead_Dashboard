export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';
export type UserRole = 'admin' | 'sales';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  notes?: string;
  createdBy: { _id: string; name: string; email: string } | string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: string[];
}

export interface LeadFilters {
  status?: LeadStatus | '';
  source?: LeadSource | '';
  search?: string;
  sort?: 'latest' | 'oldest';
  page?: number;
}

export interface AuthTokens {
  token: string;
  user: User;
}

export interface CreateLeadInput {
  name: string;
  email: string;
  status?: LeadStatus;
  source: LeadSource;
  notes?: string;
}

export interface UpdateLeadInput extends Partial<CreateLeadInput> {}
