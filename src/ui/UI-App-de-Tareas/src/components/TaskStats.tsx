import { Task, TaskStatus } from '../types/task.types';
import { Card, CardContent } from './ui/card';
import { CheckCircle2, Circle, ListTodo, TrendingUp } from 'lucide-react';

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED).length;
  const pendingTasks = tasks.filter(t => t.status === TaskStatus.PENDING).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: 'Total de Tareas',
      value: totalTasks,
      icon: ListTodo,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Pendientes',
      value: pendingTasks,
      icon: Circle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      label: 'Completadas',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Tasa de Completitud',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-full`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
