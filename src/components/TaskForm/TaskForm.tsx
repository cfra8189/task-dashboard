import React, { useEffect, useState } from 'react';
import type { TaskFormData } from '../../types';
import { validateTaskForm } from '../../utils/taskUtils';

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  initialData?: Partial<TaskFormData>;
  onCancel?: () => void;
}

// Simple controlled form for adding/editing a task.
// Written in a beginner-friendly style with small functions.
export default function TaskForm({ onSubmit, initialData, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate ?? '');
  const [priority, setPriority] = useState<TaskFormData['priority']>(initialData?.priority ?? 'medium');
  const [tagsText, setTagsText] = useState((initialData?.tags || []).join(', '));

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setTitle(initialData?.title ?? '');
    setDescription(initialData?.description ?? '');
    setDueDate(initialData?.dueDate ?? '');
    setPriority(initialData?.priority ?? 'medium');
    setTagsText((initialData?.tags || []).join(', '));
    setErrors({});
  }, [initialData]);

  function parseTags(text: string): string[] {
    return text
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  function gatherData(): TaskFormData {
    return {
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate || undefined,
      priority,
      tags: parseTags(tagsText),
    };
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = gatherData();
    const errs = validateTaskForm(data);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onSubmit(data);
      // reset small form for beginners
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setTagsText('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <div>
        <label>Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a short title"
        />
        {errors.title && <div className="form-error">{errors.title}</div>}
      </div>

      <div>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details"
        />
      </div>

      <div>
        <label>Due Date</label>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        {errors.dueDate && <div className="form-error">{errors.dueDate}</div>}
      </div>

      <div>
        <label>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value as any)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label>Tags (comma separated)</label>
        <input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="ideas, school" />
      </div>

      <div className="form-row">
        <button type="submit" className="btn">Save Task</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-cancel">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
