import React, { useState } from 'react';
import type { Task, TaskListProps } from '../../types';
import TaskItem from './TaskItem';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import CursorFollower from '../Shared/CursorFollower';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

// Simple TaskList: renders the tasks passed from Dashboard (filtering is handled there).
export default function TaskList({ tasks, onStatusChange, onDelete, onEdit, onReorder }: TaskListProps) {
  const sensors = useSensors(useSensor(PointerSensor));
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // CursorFollower imported statically to avoid runtime require issues

  function handleDragStart(event: any) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    if (active.id === over.id) return;
    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const next = arrayMove(tasks, oldIndex, newIndex);
    if (onReorder) onReorder(next.map((t) => t.id));
  }

  function handleDragCancel() {
    setActiveId(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {tasks.length === 0 ? (
        <div className="no-tasks">No tasks found.</div>
      ) : (
        <div>
          {tasks.length > 1 && (
            <div className="drag-tip">Tip: Drag a task card to reorder tasks</div>
          )}
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task: Task) => (
              <TaskItem key={task.id} task={task} onStatusChange={onStatusChange} onDelete={onDelete} onEdit={onEdit} />
            ))}
          </SortableContext>

          <DragOverlay>
            {activeId ? (
              (() => {
                const activeTask = tasks.find((t) => t.id === activeId);
                if (!activeTask) return null;
                return (
                  <div className="drag-overlay">
                    <div className="task-title">{activeTask.title}</div>
                    <div className="task-meta">{activeTask.priority} • {activeTask.status}</div>
                    {activeTask.description && <div className="task-body">{activeTask.description}</div>}
                  </div>
                );
              })()
            ) : null}
          </DragOverlay>
          <CursorFollower activeDragging={Boolean(activeId)} />
        </div>
      )}
    </DndContext>
  );
}
