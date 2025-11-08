import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus, TaskPriority } from '../types/task.types';

const API_BASE_URL = '/tasks';
const STORAGE_KEY = 'tasks_data';
const USE_MOCK_DATA = true; // Cambiar a false cuando el backend esté disponible

// Datos de ejemplo para demostración
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    userId: 'user-1',
    title: 'Implementar autenticación de usuarios',
    description: 'Crear sistema de login y registro con JWT',
    dueDate: new Date('2025-11-10'),
    priority: TaskPriority.HIGH,
    status: TaskStatus.PENDING,
    createdAt: new Date('2025-11-01'),
    updatedAt: new Date('2025-11-01'),
    labels: [
      { id: 'l1', userId: 'user-1', name: 'Backend', color: '#3b82f6', createdAt: new Date() },
      { id: 'l2', userId: 'user-1', name: 'Urgente', color: '#ef4444', createdAt: new Date() },
    ],
  },
  {
    id: '2',
    userId: 'user-1',
    title: 'Diseñar interfaz de dashboard',
    description: 'Crear mockups y prototipos para el panel de control',
    dueDate: new Date('2025-11-08'),
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.PENDING,
    createdAt: new Date('2025-11-02'),
    updatedAt: new Date('2025-11-02'),
    labels: [
      { id: 'l3', userId: 'user-1', name: 'Diseño', color: '#8b5cf6', createdAt: new Date() },
    ],
  },
  {
    id: '3',
    userId: 'user-1',
    title: 'Configurar CI/CD pipeline',
    description: 'Implementar GitHub Actions para despliegue automático',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.COMPLETED,
    createdAt: new Date('2025-10-28'),
    updatedAt: new Date('2025-11-01'),
    labels: [
      { id: 'l4', userId: 'user-1', name: 'DevOps', color: '#10b981', createdAt: new Date() },
    ],
  },
  {
    id: '4',
    userId: 'user-1',
    title: 'Escribir documentación API',
    description: 'Documentar todos los endpoints con Swagger',
    dueDate: new Date('2025-11-15'),
    priority: TaskPriority.LOW,
    status: TaskStatus.PENDING,
    createdAt: new Date('2025-11-03'),
    updatedAt: new Date('2025-11-03'),
    labels: [
      { id: 'l5', userId: 'user-1', name: 'Documentación', color: '#f59e0b', createdAt: new Date() },
    ],
  },
  {
    id: '5',
    userId: 'user-1',
    title: 'Optimizar consultas de base de datos',
    description: 'Mejorar rendimiento con índices y caché',
    priority: TaskPriority.HIGH,
    status: TaskStatus.COMPLETED,
    createdAt: new Date('2025-10-25'),
    updatedAt: new Date('2025-10-30'),
    labels: [
      { id: 'l6', userId: 'user-1', name: 'Backend', color: '#3b82f6', createdAt: new Date() },
      { id: 'l7', userId: 'user-1', name: 'Performance', color: '#ec4899', createdAt: new Date() },
    ],
  },
];

class MockStorage {
  private static getTasks(): Task[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_TASKS));
      return MOCK_TASKS;
    }
    return JSON.parse(stored);
  }

  private static saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  static async findAll(): Promise<Task[]> {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.getTasks();
  }

  static async findOne(id: string): Promise<Task> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const tasks = this.getTasks();
    const task = tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Tarea no encontrada');
    }
    return task;
  }

  static async create(dto: CreateTaskDto): Promise<Task> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const tasks = this.getTasks();
    const newTask: Task = {
      id: Date.now().toString(),
      ...dto,
      status: dto.status || TaskStatus.PENDING,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    tasks.push(newTask);
    this.saveTasks(tasks);
    return newTask;
  }

  static async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Tarea no encontrada');
    }
    
    const updatedTask: Task = {
      ...tasks[index],
      ...dto,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : tasks[index].dueDate,
      updatedAt: new Date(),
    };
    
    tasks[index] = updatedTask;
    this.saveTasks(tasks);
    return updatedTask;
  }

  static async remove(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const tasks = this.getTasks();
    const filtered = tasks.filter(t => t.id !== id);
    this.saveTasks(filtered);
  }
}

export class TaskApiService {
  static async findAll(): Promise<Task[]> {
    if (USE_MOCK_DATA) {
      return MockStorage.findAll();
    }
    
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Error al obtener las tareas');
    }
    return response.json();
  }

  static async findOne(id: string): Promise<Task> {
    if (USE_MOCK_DATA) {
      return MockStorage.findOne(id);
    }
    
    const response = await fetch(`${API_BASE_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener la tarea');
    }
    return response.json();
  }

  static async create(dto: CreateTaskDto): Promise<Task> {
    if (USE_MOCK_DATA) {
      return MockStorage.create(dto);
    }
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      throw new Error('Error al crear la tarea');
    }
    return response.json();
  }

  static async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    if (USE_MOCK_DATA) {
      return MockStorage.update(id, dto);
    }
    
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar la tarea');
    }
    return response.json();
  }

  static async remove(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      return MockStorage.remove(id);
    }
    
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar la tarea');
    }
  }
}
