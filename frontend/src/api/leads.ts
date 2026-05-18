import apiClient from './client';
import { ApiResponse, Lead, LeadFilters, CreateLeadInput, UpdateLeadInput } from '@/types';

export const leadsApi = {
  getLeads: async (filters: LeadFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.page) params.append('page', String(filters.page));
    params.append('limit', '10');

    const res = await apiClient.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
    return res.data;
  },

  getLeadById: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Lead>>(`/leads/${id}`);
    return res.data;
  },

  createLead: async (data: CreateLeadInput) => {
    const res = await apiClient.post<ApiResponse<Lead>>('/leads', data);
    return res.data;
  },

  updateLead: async (id: string, data: UpdateLeadInput) => {
    const res = await apiClient.put<ApiResponse<Lead>>(`/leads/${id}`, data);
    return res.data;
  },

  deleteLead: async (id: string) => {
    const res = await apiClient.delete<ApiResponse>(`/leads/${id}`);
    return res.data;
  },

  exportCSV: (filters: Omit<LeadFilters, 'page'> = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.source) params.append('source', filters.source);
    if (filters.search) params.append('search', filters.search);

    const token = localStorage.getItem('token') || '';
    const url = `/api/leads/export/csv?${params.toString()}`;

    // Trigger file download
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.blob())
      .then((blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(a.href);
      });
  },
};
