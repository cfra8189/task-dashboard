import React, { useEffect, useMemo, useState } from 'react';
import TaskForm from '../TaskForm/TaskForm';
import TaskFilter from '../TaskFilter/TaskFilter';
import TaskList from '../TaskList/TaskList';
import type { Task, TaskFormData, TaskFilters } from '../../types';
import { filterTasks, sortTasks } from '../../utils/taskUtils';

const STORAGE_KEY = 'task-dashboard.tasks';

// Beginner-friendly Dashboard: holds all tasks and wires components.
export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Task[];
      return parsed;
    } catch (e) {
      console.warn('Failed to read tasks from storage', e);
      return [];
    }
  });

  const [filters, setFilters] = useState<TaskFilters>({ status: 'all', priority: 'all', searchQuery: '', sortBy: 'order', sortDir: 'asc' });
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Save tasks to localStorage whenever they change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Failed to save tasks', e);
    }
  }, [tasks]);

  // Helpers for basic operations
  function makeId() {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function addTask(data: TaskFormData) {
    const newTask: Task = {
      id: makeId(),
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      tags: data.tags,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setTasks((t) => [newTask, ...t]);
  }

  function updateTask(updated: Task) {
    setTasks((t) => t.map((x) => (x.id === updated.id ? updated : x)));
  }

  function startEdit(task: Task) {
    setEditingTask(task);
  }

  function cancelEdit() {
    setEditingTask(null);
  }

  function submitEdit(data: TaskFormData) {
    if (!editingTask) return;
    const merged: Task = {
      ...editingTask,
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      tags: data.tags,
    };
    updateTask(merged);
    setEditingTask(null);
  }

  function deleteTask(id: string) {
    setTasks((t) => t.filter((x) => x.id !== id));
  }

  function toggleStatus(id: string, newStatus: Task['status']) {
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, status: newStatus } : x)));
  }

  function handleReorder(orderedIds: string[]) {
    setTasks((prev) => {
      const map = new Map(prev.map((t) => [t.id, t]));
      const next = orderedIds.map((id) => map.get(id)).filter(Boolean) as Task[];
      // append any tasks that weren't in the ordered list (safety)
      const missing = prev.filter((t) => !orderedIds.includes(t.id));
      return [...next, ...missing];
    });
  }

  // (Export/import removed — not required for the assignment.)

  // Compute visible tasks using the helpers
  const visible = useMemo(() => {
    const f = filterTasks(tasks, filters);
    return sortTasks(f, filters.sortBy, filters.sortDir);
  }, [tasks, filters]);

  // Simple stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  return (
    <div className="app-container">
      <h2>Task Dashboard</h2>

      <div className="layout-grid">
        <main className="main-area">
          <div className="spaced">
            <TaskFilter filters={filters} onChange={setFilters} />
          </div>

          <div className="spaced">
            <div className="row">
              <div className="stats-text">
                <strong>{stats.total}</strong> total • <strong>{stats.pending}</strong> pending • <strong>{stats.completed}</strong> done
              </div>
              <div className="right-actions" />
            </div>
          </div>

          <TaskList tasks={visible} onStatusChange={toggleStatus} onDelete={deleteTask} onEdit={startEdit} onReorder={handleReorder} />
        </main>

        <aside className="aside-area">
          <h3>{editingTask ? 'Edit Task' : 'Add Task'}</h3>
          <TaskForm
            onSubmit={editingTask ? submitEdit : addTask}
            initialData={editingTask ? {
              title: editingTask.title,
              description: editingTask.description,
              dueDate: editingTask.dueDate,
              priority: editingTask.priority,
              tags: editingTask.tags,
            } : undefined}
            onCancel={editingTask ? cancelEdit : undefined}
          />
        </aside>
      </div>
    </div>
  );
}
