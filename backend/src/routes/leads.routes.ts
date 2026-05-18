import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
} from '../controllers/leads.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createLeadValidator, updateLeadValidator } from '../validators/lead.validator';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getLeads);
router.get('/export/csv', exportLeadsCSV);
router.get('/:id', getLeadById);

router.post('/', createLeadValidator, validate, createLead);
router.put('/:id', updateLeadValidator, validate, updateLead);

// Only admins can delete leads
router.delete('/:id', authorize('admin'), deleteLead);

export default router;
