import { useState, useEffect } from 'react';
import type { Task } from '../../types/task';
import { TaskService } from '../../services/api';
import TaskItem from '../../components/tasks/TaskItem';

const TaskListPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await TaskService.getAllTasks();
        setTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Error al cargar las tareas');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, []);
  
  const handleToggleComplete = async (id: number, completed: boolean) => {
    try {
      const updatedTask = await TaskService.toggleTaskCompletion(id, completed);
      setTasks(tasks.map(task => task.id === id ? updatedTask : task));
    } catch (err) {
      console.error('Error toggling task completion:', err);
    }
  };
  
  const handleDeleteTask = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      try {
        await TaskService.deleteTask(id);
        setTasks(tasks.filter(task => task.id !== id));
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };
  
  if (loading) {
    return <div className="text-center py-10 text-gray-800 dark:text-gray-200">Cargando tareas...</div>;
  }
  
  if (error) {
    return <div className="text-center py-10 text-red-600 dark:text-red-400">{error}</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Mis Tareas</h1>
        <p className="text-gray-600 dark:text-gray-300">Administrar tus tareas</p>
      </div>
      
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map(task => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onToggle={handleToggleComplete} 
              onDelete={handleDeleteTask} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">No hay tareas aún</h2>
          <p className="text-gray-600 dark:text-gray-300 mt-2">¡Crea tu primera tarea!</p>
          <a 
            href="/tasks/new" 
            className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
          >
            Crear Tarea
          </a>
        </div>
      )}
    </div>
  );
};

export default TaskListPage;
