import { Task, TaskFilters, TaskFormData } from '../types';

// Simple helper: check if a string is empty or only spaces
const isBlank = (s?: string) => !s || s.trim().length === 0;

// Filter tasks by status, priority, and search query.
export function filterTasks(tasks: Task[], filters: TaskFilters): Task[] {
  const { status = 'all', priority = 'all', searchQuery } = filters || {};
  const q = (searchQuery || '').toLowerCase().trim();

  return tasks.filter((t) => {
    if (status !== 'all' && t.status !== status) return false;
    if (priority !== 'all' && t.priority !== priority) return false;

    if (q === '') return true;

    const inTitle = t.title.toLowerCase().includes(q);
    const inDesc = (t.description || '').toLowerCase().includes(q);
    const inTags = (t.tags || []).some((tag) => tag.toLowerCase().includes(q));

    return inTitle || inDesc || inTags;
  });
}

// Sort tasks. Returns a new array.
export function sortTasks(
  tasks: Task[],
  sortBy: TaskFilters['sortBy'] = 'order',
  sortDir: TaskFilters['sortDir'] = 'asc'
): Task[] {
  const copy = [...tasks];

  copy.sort((a, b) => {
    let va: any = a[sortBy as keyof Task] as any;
    let vb: any = b[sortBy as keyof Task] as any;

    // fallback: undefined order should go after defined ones
    if (sortBy === 'order') {
      va = typeof va === 'number' ? va : Number.POSITIVE_INFINITY;
      vb = typeof vb === 'number' ? vb : Number.POSITIVE_INFINITY;
    }

    // Dates: compare timestamps
    if (sortBy === 'createdAt' || sortBy === 'dueDate') {
      va = va ? Date.parse(String(va)) : 0;
      vb = vb ? Date.parse(String(vb)) : 0;
    }

    // Strings: compare lowercase
    if (typeof va === 'string' && typeof vb === 'string') {
      const cmp = va.toLowerCase().localeCompare(vb.toLowerCase());
      return sortDir === 'asc' ? cmp : -cmp;
    }

    // Numbers
    if (typeof va === 'number' && typeof vb === 'number') {
      return sortDir === 'asc' ? va - vb : vb - va;
    }

    return 0;
  });

  return copy;
}

// Validate form data for TaskForm. Returns an object of errors (empty = valid).
export function validateTaskForm(data: TaskFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (isBlank(data.title)) {
    errors.title = 'Title is required.';
  } else if ((data.title || '').trim().length < 3) {
    errors.title = 'Title must be at least 3 characters.';
  }

  if (data.dueDate) {
    const parsed = Date.parse(data.dueDate);
    if (Number.isNaN(parsed)) {
      errors.dueDate = 'Due date is not a valid date.';
    }
  }

  return errors;
}

// Simple, friendly date formatter for the UI.
export function formatDate(iso?: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString();
  } catch (e) {
    return iso;
  }
}

// Export tasks to a JSON string (nice formatting).
export function exportTasksJSON(tasks: Task[]): string {
  return JSON.stringify(tasks, null, 2);
}

// Import tasks from JSON string. Throws an Error if parsing fails.
export function importTasksJSON(json: string): Task[] {
  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed)) throw new Error('Imported data must be an array of tasks.');
  // Very small shape check to help beginners.
  parsed.forEach((item, i) => {
    if (!item.id || !item.title) throw new Error(`Task at index ${i} is missing required fields.`);
  });
  return parsed as Task[];
}

export default {
  filterTasks,
  sortTasks,
  validateTaskForm,
  formatDate,
  exportTasksJSON,
  importTasksJSON,
};
