import { Task, TaskStatus, TaskPriority } from '../types/task.types';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { MoreVertical, Pencil, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string, status: TaskStatus) => void;
}

const priorityColors = {
  LOW: 'bg-blue-50 border-l-blue-500',
  MEDIUM: 'bg-yellow-50 border-l-yellow-500',
  HIGH: 'bg-red-50 border-l-red-500',
};

export function TaskList({ tasks, onEdit, onDelete, onToggleStatus }: TaskListProps) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => {
        const isCompleted = task.status === TaskStatus.COMPLETED;
        
        return (
          <div
            key={task.id}
            className={`${priorityColors[task.priority]} ${
              isCompleted ? 'opacity-60' : ''
            } bg-white border-l-4 rounded-lg p-4 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start gap-3">
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={() =>
                  onToggleStatus(
                    task.id,
                    isCompleted ? TaskStatus.PENDING : TaskStatus.COMPLETED
                  )
                }
                className="mt-1 w-4 h-4 rounded border-gray-300 cursor-pointer flex-shrink-0"
              />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className={`${isCompleted ? 'line-through text-gray-500' : ''}`}>
                    {task.title}
                  </h3>
                  
                  {/* Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 flex-shrink-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(task)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(task.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p
                  className={`text-sm text-gray-600 mb-2 ${
                    isCompleted ? 'line-through' : ''
                  }`}
                >
                  {task.description}
                </p>

                {/* Labels and Date */}
                <div className="flex flex-wrap gap-2 items-center">
                  {task.labels && task.labels.length > 0 && (
                    <>
                      {task.labels.map((label) => (
                        <Badge
                          key={label.id}
                          style={{ backgroundColor: label.color, color: '#fff' }}
                          className="text-xs"
                        >
                          {label.name}
                        </Badge>
                      ))}
                    </>
                  )}

                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(task.dueDate), 'dd MMM', { locale: es })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
