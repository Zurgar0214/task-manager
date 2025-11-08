import { Task, TaskStatus, TaskPriority } from '../types/task.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Pencil, Trash2, Calendar, Flag } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: TaskStatus) => void;
}

const priorityColors = {
  LOW: 'bg-green-100 text-green-800 border-green-300',
  MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  HIGH: 'bg-red-100 text-red-800 border-red-300',
};

const priorityIcons = {
  LOW: '🔵',
  MEDIUM: '🟡',
  HIGH: '🔴',
};

export function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  const isCompleted = task.status === TaskStatus.COMPLETED;

  return (
    <Card className={`${isCompleted ? 'opacity-60 bg-gray-50' : ''} transition-all hover:shadow-md`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={() => onToggleStatus(
                  task.id,
                  isCompleted ? TaskStatus.PENDING : TaskStatus.COMPLETED
                )}
                className="w-5 h-5 rounded border-gray-300 cursor-pointer"
              />
              <CardTitle className={`${isCompleted ? 'line-through' : ''}`}>
                {task.title}
              </CardTitle>
            </div>
            <CardDescription className={`${isCompleted ? 'line-through' : ''}`}>
              {task.description}
            </CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
              className="h-8 w-8"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(task.id)}
              className="h-8 w-8 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 items-center">
          <Badge className={priorityColors[task.priority]} variant="outline">
            <Flag className="h-3 w-3 mr-1" />
            {task.priority}
          </Badge>
          
          <Badge variant={isCompleted ? 'default' : 'secondary'}>
            {task.status}
          </Badge>

          {task.dueDate && (
            <Badge variant="outline" className="text-gray-600">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(task.dueDate), 'dd MMM yyyy', { locale: es })}
            </Badge>
          )}

          {task.labels && task.labels.length > 0 && (
            <div className="flex gap-1">
              {task.labels.map((label) => (
                <Badge
                  key={label.id}
                  style={{ backgroundColor: label.color, color: '#fff' }}
                  className="text-xs"
                >
                  {label.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
