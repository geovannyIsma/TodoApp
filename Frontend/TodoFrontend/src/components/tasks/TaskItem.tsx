import type { Task } from '../../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

const TaskItem = ({ task, onToggle, onDelete }: TaskItemProps) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border ${task.completed ? 'border-green-500' : 'border-yellow-500'}`}>
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h2 className={`text-xl font-semibold text-gray-900 dark:text-white ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
            {task.title}
          </h2>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${task.completed ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'}`}>
            {task.completed ? 'Completada' : 'Pendiente'}
          </span>
        </div>
        
        {task.description && (
          <p className={`mt-2 text-gray-700 dark:text-gray-300 ${task.completed ? 'text-gray-400 dark:text-gray-500' : ''}`}>
            {task.description}
          </p>
        )}
        
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Creada: {new Date(task.created_at).toLocaleDateString()}
        </div>
        
        <div className="mt-6 flex justify-between">
          <div>
            <a href={`/tasks/${task.id}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
              Ver
            </a>
            <a href={`/tasks/${task.id}/edit`} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
              Editar
            </a>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onToggle(task.id, !task.completed)}
              className={`px-3 py-1 rounded ${task.completed 
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-100 dark:hover:bg-yellow-700' 
                : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-100 dark:hover:bg-green-700'}`}
            >
              {task.completed ? 'Desmarcar' : 'Completar'}
            </button>
            <button 
              onClick={() => onDelete(task.id)}
              className="bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-800 dark:text-red-100 dark:hover:bg-red-700 px-3 py-1 rounded"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
