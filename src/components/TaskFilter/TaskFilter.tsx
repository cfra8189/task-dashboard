import React from 'react';
import type { TaskFilters } from '../../types';

interface Props {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

// Beginner-friendly filter controls for tasks.
export default function TaskFilter({ filters, onChange }: Props) {
  const { status = 'all', priority = 'all', searchQuery = '', sortBy = 'order', sortDir = 'asc' } = filters || {};

  function change<K extends keyof TaskFilters>(key: K, value: TaskFilters[K]) {
    const next = { ...filters, [key]: value } as TaskFilters;
    onChange(next);
  }

  function clearFilters() {
    onChange({ status: 'all', priority: 'all', searchQuery: '', sortBy: 'order', sortDir: 'asc' });
  }

  return (
    <div className="filter-wrap">
      <div className="filter-row">
        <select value={status} onChange={(e) => change('status', e.target.value as any)}>
          <option value="all">All status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select value={priority} onChange={(e) => change('priority', e.target.value as any)}>
          <option value="all">All priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select value={sortBy} onChange={(e) => change('sortBy', e.target.value as any)}>
          <option value="order">Manual order</option>
          <option value="createdAt">Created</option>
          <option value="dueDate">Due date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>

        <select value={sortDir} onChange={(e) => change('sortDir', e.target.value as any)}>
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      <div className="spaced">
        <input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => change('searchQuery', e.target.value)}
          className="input-full"
        />
      </div>

      <div className="badges">
        {/* Active filter badges (small and simple) */}
        {status !== 'all' && <span className="badge">{String(status)}</span>}
        {priority !== 'all' && <span className="badge badge-priority">{String(priority)}</span>}
        {searchQuery && String(searchQuery).trim() !== '' && (
          <span className="badge badge-search">"{String(searchQuery).trim()}"</span>
        )}

        <button onClick={clearFilters} className="btn-clear">Clear</button>
      </div>
    </div>
  );
}
