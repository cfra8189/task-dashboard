export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string; // ISO date string
  createdAt: string; // ISO date string
  tags?: string[];
  archived?: boolean;
  order?: number; // optional manual ordering index
}

export interface TaskFormData {
  title: string;
  description?: string;
  dueDate?: string;
  priority: Task['priority'];
  tags?: string[];
}

export interface TaskFilters {
  status?: TaskStatus | 'all';
  priority?: Task['priority'] | 'all';
  searchQuery?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title' | 'order';
  sortDir?: 'asc' | 'desc';
}

export interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onEdit?: (task: Task) => void;
  onReorder?: (orderedIds: string[]) => void;
}

export interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onEdit?: (task: Task) => void;
}

export interface TaskFilterProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

export interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  initialData?: Partial<TaskFormData>;
  onCancel?: () => void;
}

export interface DashboardProps {
  initialTasks?: Task[];
}