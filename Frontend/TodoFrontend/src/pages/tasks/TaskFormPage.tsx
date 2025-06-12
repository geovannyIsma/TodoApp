import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TaskForm from '../../components/tasks/TaskForm';
import { TaskService } from '../../services/api';
import type { Task } from '../../types/task';

interface TaskFormPageProps {
  isEditing?: boolean;
}

const TaskFormPage = ({ isEditing = false }: TaskFormPageProps) => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | undefined>(undefined);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (isEditing && id) {
      const fetchTask = async () => {
        try {
          const data = await TaskService.getTaskById(parseInt(id));
          setTask(data);
        } catch (err) {
          console.error('Error fetching task:', err);
          setError('Error al cargar la tarea');
        } finally {
          setLoading(false);
        }
      };
      
      fetchTask();
    }
  }, [id, isEditing]);
  
  if (isEditing && loading) {
    return <div className="text-center py-10">Cargando tarea...</div>;
  }
  
  if (isEditing && error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }
  
  return <TaskForm task={task} isEditing={isEditing} />;
};

export default TaskFormPage;
