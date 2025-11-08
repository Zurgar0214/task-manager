import { TaskStatus, TaskPriority } from '../types/task.types';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Filter, X } from 'lucide-react';

interface TaskFiltersProps {
  statusFilter: TaskStatus | 'ALL';
  priorityFilter: TaskPriority | 'ALL';
  onStatusChange: (status: TaskStatus | 'ALL') => void;
  onPriorityChange: (priority: TaskPriority | 'ALL') => void;
  onClear: () => void;
}

export function TaskFilters({
  statusFilter,
  priorityFilter,
  onStatusChange,
  onPriorityChange,
  onClear,
}: TaskFiltersProps) {
  const hasFilters = statusFilter !== 'ALL' || priorityFilter !== 'ALL';

  return (
    <div className="flex flex-wrap gap-3 items-center bg-gray-50 p-4 rounded-lg border">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-600">Filtros:</span>
      </div>

      <div className="flex gap-3 flex-1 flex-wrap">
        <div className="min-w-[150px]">
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los estados</SelectItem>
              <SelectItem value={TaskStatus.PENDING}>Pendiente</SelectItem>
              <SelectItem value={TaskStatus.COMPLETED}>Completada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[150px]">
          <Select value={priorityFilter} onValueChange={onPriorityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas las prioridades</SelectItem>
              <SelectItem value={TaskPriority.LOW}>Baja</SelectItem>
              <SelectItem value={TaskPriority.MEDIUM}>Media</SelectItem>
              <SelectItem value={TaskPriority.HIGH}>Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasFilters && (
        <Button variant="outline" size="sm" onClick={onClear}>
          <X className="h-4 w-4 mr-1" />
          Limpiar
        </Button>
      )}
    </div>
  );
}
