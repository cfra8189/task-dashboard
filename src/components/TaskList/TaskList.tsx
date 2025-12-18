import React from 'react';
import type { Task, TaskListProps } from '../../types';
import TaskItem from './TaskItem';

// Simple TaskList: renders the tasks passed from Dashboard (filtering is handled there).
export default function TaskList({ tasks, onStatusChange, onDelete, onEdit }: TaskListProps) {
  return (
    <div>
      {tasks.length === 0 ? (
        <div className="no-tasks">No tasks found.</div>
      ) : (
        tasks.map((task: Task) => (
          <TaskItem key={task.id} task={task} onStatusChange={onStatusChange} onDelete={onDelete} onEdit={onEdit} />
        ))
      )}
    </div>
  );
}
