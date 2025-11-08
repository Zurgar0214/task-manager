import { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus, CreateTaskDto, UpdateTaskDto } from '../types/task.types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface TaskDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (dto: CreateTaskDto | UpdateTaskDto) => void;
  task?: Task | null;
}

export function TaskDialog({ open, onClose, onSave, task }: TaskDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.PENDING,
    userId: 'current-user', // En producción, obtener del contexto de autenticación
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        priority: task.priority,
        status: task.status,
        userId: task.userId,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: TaskPriority.MEDIUM,
        status: TaskStatus.PENDING,
        userId: 'current-user',
      });
    }
  }, [task, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (task) {
      // Actualizar tarea existente
      const updateDto: UpdateTaskDto = {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate || undefined,
        priority: formData.priority,
        status: formData.status,
      };
      onSave(updateDto);
    } else {
      // Crear nueva tarea
      const createDto: CreateTaskDto = {
        title: formData.title,
        description: formData.description,
        dueDate: formData.dueDate || undefined,
        priority: formData.priority,
        status: formData.status,
        userId: formData.userId,
      };
      onSave(createDto);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {task ? 'Editar Tarea' : 'Nueva Tarea'}
            </DialogTitle>
            <DialogDescription>
              {task ? 'Modifica los detalles de tu tarea' : 'Crea una nueva tarea para tu proyecto'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título de la tarea"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe tu tarea..."
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: TaskPriority) => setFormData({ ...formData, priority: value as TaskPriority })}
                >
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TaskPriority.LOW}>Baja</SelectItem>
                    <SelectItem value={TaskPriority.MEDIUM}>Media</SelectItem>
                    <SelectItem value={TaskPriority.HIGH}>Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: TaskStatus) => setFormData({ ...formData, status: value as TaskStatus })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TaskStatus.PENDING}>Pendiente</SelectItem>
                    <SelectItem value={TaskStatus.COMPLETED}>Completada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dueDate">Fecha de Vencimiento</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {task ? 'Guardar Cambios' : 'Crear Tarea'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
