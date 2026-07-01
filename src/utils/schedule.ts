import type { Task } from '../types';
import { REFERENCE_DATE, parseDate } from './dates';

/** Whether a task should appear in upcoming/overdue schedule views. */
export function isScheduleRelevantTask(task: Task, reference: Date = REFERENCE_DATE): boolean {
  if (task.status === 'completed') return false;
  if (task.status === 'overdue' || task.status === 'blocked' || task.status === 'in-progress') {
    return true;
  }
  return parseDate(task.endDate) >= reference;
}