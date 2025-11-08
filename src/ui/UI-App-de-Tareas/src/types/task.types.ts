export enum TaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface Label {
  id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface Reminder {
  id: string;
  taskId: string;
  scheduledAt: Date;
  channel: string;
  sent: boolean;
  sentAt?: Date;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  dueDate?: Date;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  labels?: Label[];
  reminders?: Reminder[];
}

export interface CreateTaskDto {
  title: string;
  description: string;
  dueDate?: string;
  priority: TaskPriority;
  status?: TaskStatus;
  userId: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
}
