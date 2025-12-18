import React from 'react';
import type { Task } from '../../types';
import { formatDate } from '../../utils/taskUtils';

interface Props {
  task: Task;
  onStatusChange: (id: string, newStatus: Task['status']) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
}

// A single task row/card. Simple and easy to read.
export default function TaskItem({ task, onStatusChange, onDelete, onEdit }: Props) {
  function handleToggle() {
    const next = task.status === 'completed' ? 'pending' : 'completed';
    onStatusChange(task.id, next);
  }

  return (
    <div className="task-card">
      <div className="task-row">
        <div>
          <strong>{task.title}</strong>
          <div className="task-meta">{task.priority} • {task.status}</div>
        </div>
        <div>
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
            className="btn btn-space"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <button onClick={() => onEdit && onEdit(task)} className="btn btn-space">
            Edit
          </button>
          <button onClick={() => onDelete(task.id)} className="btn btn-danger">
            Delete
          </button>
        </div>
      </div>

      {task.description && <div className="task-desc">{task.description}</div>}
      <div className="task-foot">
        Created: {formatDate(task.createdAt)} {task.dueDate ? ` • Due: ${formatDate(task.dueDate)}` : ''}
      </div>
      {task.tags && task.tags.length > 0 && (
        <div className="tags">
          {task.tags
            .map((t) => (typeof t === 'string' ? t.trim() : ''))
            .filter(Boolean)
            .map((t) => (
              <span key={t} className="tag">
                {t}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}
