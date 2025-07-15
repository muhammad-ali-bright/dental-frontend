import { Appointment } from '../types';

export const statusColorClasses: Record<Appointment['status'], string> = {
  Scheduled:   'bg-blue-100 text-blue-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  Completed:   'bg-green-100 text-green-800',
  Cancelled:   'bg-red-100 text-red-800',
};