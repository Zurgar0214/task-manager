import { useState, useEffect } from 'react';
import { Task, TaskStatus, CreateTaskDto, UpdateTaskDto } from './types/task.types';
import { TaskApiService } from './services/task.service';
import { TaskList } from './components/TaskList';
import { TaskDialog } from './components/TaskDialog';
import { Button } from './components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './components/ui/alert-dialog';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { Plus, Loader2 } from 'lucide-react';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await TaskApiService.findAll();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Error al cargar las tareas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (dto: CreateTaskDto | UpdateTaskDto) => {
    try {
      // Type guard to ensure dto is CreateTaskDto
      if ('userId' in dto) {
        const newTask = await TaskApiService.create(dto as CreateTaskDto);
        setTasks([...tasks, newTask]);
        setDialogOpen(false);
        toast.success('Tarea creada');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Error al crear la tarea');
    }
  };

  const handleUpdateTask = async (dto: CreateTaskDto | UpdateTaskDto) => {
    if (!selectedTask) return;

    try {
      // Type guard to ensure dto is UpdateTaskDto
      if (!('userId' in dto)) {
        const updatedTask = await TaskApiService.update(selectedTask.id, dto as UpdateTaskDto);
        setTasks(tasks.map((t) => (t.id === selectedTask.id ? updatedTask : t)));
        setDialogOpen(false);
        setSelectedTask(null);
        toast.success('Tarea actualizada');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Error al actualizar la tarea');
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      await TaskApiService.remove(taskToDelete);
      setTasks(tasks.filter((t) => t.id !== taskToDelete));
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
      toast.success('Tarea eliminada');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Error al eliminar la tarea');
    }
  };

  const handleToggleStatus = async (id: string, status: TaskStatus) => {
    try {
      const updatedTask = await TaskApiService.update(id, { status });
      setTasks(tasks.map((t) => (t.id === id ? updatedTask : t)));
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Error al actualizar el estado');
    }
  };

  const openEditDialog = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedTask(null);
    setDialogOpen(true);
  };

  const openDeleteDialog = (id: string) => {
    setTaskToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl">Mis Tareas</h1>
          <Button onClick={openCreateDialog} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No hay tareas</p>
            <p className="text-sm mt-1">Comienza agregando una nueva tarea</p>
          </div>
        ) : (
          <TaskList
            tasks={tasks}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            onToggleStatus={handleToggleStatus}
          />
        )}

        {/* Task Dialog */}
        <TaskDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setSelectedTask(null);
          }}
          onSave={selectedTask ? handleUpdateTask : handleCreateTask}
          task={selectedTask}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar tarea?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setTaskToDelete(null)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteTask} className="bg-red-600 hover:bg-red-700">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Toast Notifications */}
        <Toaster position="top-right" />
      </div>
    </div>
  );
}
