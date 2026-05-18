import { Response, NextFunction } from 'express';
import { FilterQuery } from 'mongoose';
import { Lead, ILeadDocument } from '../models/Lead';
import { AuthRequest, LeadFilters, LeadStatus, LeadSource } from '../types';
import { sendSuccess, sendError, buildPaginationMeta } from '../utils/response';

export const getLeads = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      status,
      source,
      search,
      sort = 'latest',
      page = 1,
      limit = 10,
    } = req.query as unknown as LeadFilters;

    const filter: FilterQuery<ILeadDocument> = {};

    if (status) filter.status = status as LeadStatus;
    if (source) filter.source = source as LeadSource;

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ name: regex }, { email: regex }];
    }

    // Sales users can only see their own leads
    if (req.user?.role === 'sales') {
      filter.createdBy = req.user.id;
    }

    const sortOrder = sort === 'oldest' ? 1 : -1;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .populate('createdBy', 'name email')
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Lead.countDocuments(filter),
    ]);

    const meta = buildPaginationMeta(total, pageNum, limitNum);
    sendSuccess(res, 'Leads fetched successfully.', leads, 200, meta);
  } catch (err) {
    next(err);
  }
};

export const getLeadById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');

    if (!lead) {
      sendError(res, 'Lead not found.', 404);
      return;
    }

    // Sales users can only see their own leads
    if (
      req.user?.role === 'sales' &&
      lead.createdBy.toString() !== req.user.id
    ) {
      sendError(res, 'Access denied.', 403);
      return;
    }

    sendSuccess(res, 'Lead fetched successfully.', lead);
  } catch (err) {
    next(err);
  }
};

export const createLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, status, source, notes } = req.body;

    const lead = await Lead.create({
      name,
      email,
      status,
      source,
      notes,
      createdBy: req.user!.id,
    });

    const populated = await lead.populate('createdBy', 'name email');
    sendSuccess(res, 'Lead created successfully.', populated, 201);
  } catch (err) {
    next(err);
  }
};

export const updateLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      sendError(res, 'Lead not found.', 404);
      return;
    }

    // Sales users can only update their own leads
    if (
      req.user?.role === 'sales' &&
      lead.createdBy.toString() !== req.user.id
    ) {
      sendError(res, 'Access denied.', 403);
      return;
    }

    const { name, email, status, source, notes } = req.body;
    const updated = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...(name && { name }), ...(email && { email }), ...(status && { status }), ...(source && { source }), ...(notes !== undefined && { notes }) },
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    sendSuccess(res, 'Lead updated successfully.', updated);
  } catch (err) {
    next(err);
  }
};

export const deleteLead = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      sendError(res, 'Lead not found.', 404);
      return;
    }

    // Sales users can only delete their own leads
    if (
      req.user?.role === 'sales' &&
      lead.createdBy.toString() !== req.user.id
    ) {
      sendError(res, 'Access denied.', 403);
      return;
    }

    await lead.deleteOne();
    sendSuccess(res, 'Lead deleted successfully.');
  } catch (err) {
    next(err);
  }
};

export const exportLeadsCSV = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, source, search } = req.query as {
      status?: LeadStatus;
      source?: LeadSource;
      search?: string;
    };

    const filter: FilterQuery<ILeadDocument> = {};
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ name: regex }, { email: regex }];
    }
    if (req.user?.role === 'sales') {
      filter.createdBy = req.user.id;
    }

    const leads = await Lead.find(filter)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .lean();

    const csvRows = [
      ['Name', 'Email', 'Status', 'Source', 'Notes', 'Created By', 'Created At'],
      ...leads.map((l) => [
        l.name,
        l.email,
        l.status,
        l.source,
        l.notes || '',
        (l.createdBy as any)?.name || '',
        new Date(l.createdAt).toISOString(),
      ]),
    ];

    const csvContent = csvRows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"');
    res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
};
