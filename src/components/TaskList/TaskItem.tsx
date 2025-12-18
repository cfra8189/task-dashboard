import React from 'react';
import type { Task } from '../../types';
import { formatDate } from '../../utils/taskUtils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  task: Task;
  onStatusChange: (id: string, newStatus: Task['status']) => void;
  onDelete: (id: string) => void;
  onEdit?: (task: Task) => void;
}

// A single task row/card. Simple and easy to read.
export default function TaskItem({ task, onStatusChange, onDelete, onEdit }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  // Wrap listeners so dragging doesn't start when interacting with inputs/buttons inside the card
  const wrapListener = (fn?: (e: any) => void) => (e: any) => {
    const target = e.target as HTMLElement | null;
    if (target && target.closest && target.closest('button,input,select,textarea,a,label')) return;
    if (typeof fn === 'function') fn(e);
  };

  const listenersObj = listeners ?? {};
  const safeListeners: Record<string, any> = {};
  Object.keys(listenersObj).forEach((k) => {
    // listenersObj has function values; wrap them safely
    // @ts-ignore - dnd-kit listener types are complex and we only forward them
    const fn = (listenersObj as any)[k];
    safeListeners[k] = wrapListener(fn);
  });


  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="task-card" {...attributes} {...safeListeners}>
      <div className="task-header">
        <div className="task-title-and-meta">
          <h3 className="task-title">{task.title}</h3>
          <div className="task-meta">{task.priority} • {task.status}</div>
        </div>

        <div className="task-actions">
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

      {task.description && <div className="task-body task-desc">{task.description}</div>}
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
