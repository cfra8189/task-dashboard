import type { Task, TaskFilters, TaskFormData } from '../types';

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
    // Step 1: pick the raw values we will compare
    let valueA: any = a[sortBy as keyof Task];
    let valueB: any = b[sortBy as keyof Task];

    // Step 2: special case for manual ordering: handle missing order clearly
    if (sortBy === 'order') {
      const aHas = valueA != null;
      const bHas = valueB != null;
      // both missing -> equal
      if (!aHas && !bHas) return 0;
      // if A is missing, put A after B when ascending
      if (!aHas) return sortDir === 'asc' ? 1 : -1;
      // if B is missing, put B after A when ascending
      if (!bHas) return sortDir === 'asc' ? -1 : 1;
      // both have values -> compare as numbers
      const na = Number(valueA);
      const nb = Number(valueB);
      return sortDir === 'asc' ? na - nb : nb - na;
    }

    // Step 3: if we sort by dates, convert them to numbers (timestamps)
    if (sortBy === 'createdAt' || sortBy === 'dueDate') {
      valueA = valueA ? Date.parse(String(valueA)) : 0;
      valueB = valueB ? Date.parse(String(valueB)) : 0;
    }

    // Step 4: compare as strings when either is a string
    if (typeof valueA === 'string' || typeof valueB === 'string') {
      const sa = String(valueA || '').toLowerCase();
      const sb = String(valueB || '').toLowerCase();
      const cmp = sa.localeCompare(sb);
      return sortDir === 'asc' ? cmp : -cmp;
    }

    // Step 5: compare as numbers for any numeric-like values
    if (typeof valueA === 'number' || typeof valueB === 'number') {
      const na = Number(valueA || 0);
      const nb = Number(valueB || 0);
      return sortDir === 'asc' ? na - nb : nb - na;
    }

    // If we can't tell, consider them equal
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
// (Export/import JSON helpers removed — not required for the assignment.)

export default {
  filterTasks,
  sortTasks,
  validateTaskForm,
  formatDate,
};
