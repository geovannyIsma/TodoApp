import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Task } from '../../types/task';
import type { Notification } from '../../types/notification';
import { TaskService } from '../../services/api';
import { NotificationService } from '../../services/notificationApi';

const TaskDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [taskNotifications, setTaskNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (id) {
          const data = await TaskService.getTaskById(parseInt(id));
          setTask(data);
          
          // Fetch notifications related to this task
          try {
            const allNotifications = await NotificationService.getAllNotifications();
            setTaskNotifications(allNotifications.filter(n => n.task_id === parseInt(id)));
          } catch (err) {
            console.error('Error fetching task notifications:', err);
          }
        }
      } catch (err) {
        console.error('Error fetching task:', err);
        setError('Error al cargar la tarea');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTask();
  }, [id]);
  
  const handleToggleComplete = async () => {
    if (!task) return;
    
    try {
      const updatedTask = await TaskService.toggleTaskCompletion(task.id, !task.completed);
      setTask(updatedTask);
    } catch (err) {
      console.error('Error toggling task completion:', err);
    }
  };
  
  const handleDelete = async () => {
    if (!task) return;
    
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      try {
        await TaskService.deleteTask(task.id);
        navigate('/tasks');
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    }
  };
  
  if (loading) {
    return <div className="text-center py-10 text-gray-800 dark:text-gray-200">Cargando tarea...</div>;
  }
  
  if (error || !task) {
    return <div className="text-center py-10 text-red-600 dark:text-red-400">{error || 'Tarea no encontrada'}</div>;
  }
  
  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="mb-6">
        <a href="/tasks" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
          &larr; Regresar a las Tareas
        </a>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className={`text-2xl font-bold text-gray-800 dark:text-white ${task.completed ? 'line-through' : ''}`}>
              {task.title}
            </h1>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${task.completed 
              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'}`}>
              {task.completed ? 'Completada' : 'Pendiente'}
            </span>
          </div>
          
          <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 my-4">
            {task.description ? (
              <div className="prose max-w-none dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300">{task.description}</p>
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">No se proporcionó descripción</p>
            )}
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            <div className="mb-1"><strong>Creada:</strong> {new Date(task.created_at).toLocaleString()}</div>
          </div>
          
          {/* Task Notifications Section */}
          {taskNotifications.length > 0 && (
            <div className="mt-6 mb-6 border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                Notifications
              </h3>
              <div className="space-y-2">
                {taskNotifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`p-3 rounded-md ${
                      !notification.read 
                        ? 'bg-blue-50 dark:bg-blue-900/20' 
                        : 'bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {notification.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {notification.message}
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(notification.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-3">
            <a 
              href={`/tasks/${task.id}/edit`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition"
            >
              Editar Tarea
            </a>
            <button 
              onClick={handleToggleComplete}
              className={`${task.completed 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-green-600 hover:bg-green-700'} text-white font-medium py-2 px-4 rounded transition`}
            >
              {task.completed ? 'Marcar como incompleta' : 'Marcar como completada'}
            </button>
            <button 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition"
            >
              Eliminar Tarea
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPage;
