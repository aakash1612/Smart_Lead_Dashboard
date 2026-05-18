import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '@/api/leads';
import { LeadFilters, CreateLeadInput, UpdateLeadInput } from '@/types';
import toast from 'react-hot-toast';

export const LEADS_KEY = 'leads';

export function useLeads(filters: LeadFilters) {
  return useQuery({
    queryKey: [LEADS_KEY, filters],
    queryFn: () => leadsApi.getLeads(filters),
    placeholderData: (prev) => prev,
    staleTime: 30_000,
  });
}

export function useLead(id: string) {
  return useQuery({
    queryKey: [LEADS_KEY, id],
    queryFn: () => leadsApi.getLeadById(id),
    enabled: !!id,
  });
}

export function useCreateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLeadInput) => leadsApi.createLead(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      toast.success('Lead created!');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.errors?.[0] || err?.response?.data?.message || 'Failed to create lead';
      toast.error(msg);
    },
  });
}

export function useUpdateLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadInput }) =>
      leadsApi.updateLead(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      toast.success('Lead updated!');
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.errors?.[0] || err?.response?.data?.message || 'Failed to update lead';
      toast.error(msg);
    },
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadsApi.deleteLead(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [LEADS_KEY] });
      toast.success('Lead deleted.');
    },
    onError: () => toast.error('Failed to delete lead'),
  });
}
