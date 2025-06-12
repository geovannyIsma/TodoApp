import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Task, CreateTaskDto } from '../../types/task';
import { TaskService } from '../../services/api';

interface TaskFormProps {
  task?: Task;
  isEditing?: boolean;
}

const TaskForm = ({ task, isEditing = false }: TaskFormProps) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [completed, setCompleted] = useState(task?.completed || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const taskData: CreateTaskDto = {
      title,
      description,
      completed
    };
    
    try {
      if (isEditing && task) {
        await TaskService.updateTask(task.id, taskData);
        navigate(`/tasks/${task.id}`);
      } else {
        await TaskService.createTask(taskData);
        navigate('/');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Ha ocurrido un error al guardar la tarea.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <a href={isEditing ? `/tasks/${task?.id}` : '/'} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          &larr; {isEditing ? 'Regresar a la tarea' : 'Regresar a las tareas'}
        </a>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          {isEditing ? 'Editar Tarea' : 'Crear Nueva Tarea'}
        </h1>
        
        {error && (
          <div className="mb-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-3 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Título</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Descripción</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="mb-6">
            <label className="flex items-center">
              <input 
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="w-5 h-5 text-blue-600 dark:text-blue-500 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700 dark:text-gray-300">Marcar como completada</span>
            </label>
          </div>
          
          <div className="flex justify-between">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Guardando...' : isEditing ? 'Actualizar tarea' : 'Crear tarea'}
            </button>
            <a 
              href={isEditing ? `/tasks/${task?.id}` : '/'}
              className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700 
                       text-gray-800 dark:text-gray-200 font-medium py-2 px-6 rounded-lg transition"
            >
              Cancelar
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
