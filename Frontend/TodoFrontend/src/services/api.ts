import axios from 'axios';
import type { Task, CreateTaskDto, UpdateTaskDto } from '../types/task';

// Usar la variable de entorno o el valor por defecto
const API_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to authorization header when available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const TaskService = {
  getAllTasks: async (): Promise<Task[]> => {
    // El middleware en el backend filtrará las tareas según el usuario autenticado
    const response = await apiClient.get<Task[]>('/tasks/');
    return response.data;
  },
  
  getTaskById: async (id: number): Promise<Task> => {
    const response = await apiClient.get<Task>(`/tasks/${id}/`);
    return response.data;
  },
  
  createTask: async (task: CreateTaskDto): Promise<Task> => {
    // Get the user ID from the JWT token if possible
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Decode the token (note: this doesn't verify the signature)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        if (payload.user_id) {
          task.user_id = payload.user_id;
          console.log('Added user_id from token:', payload.user_id);
        }
      }
    } catch (e) {
      console.error('Error parsing JWT token:', e);
    }
    
    const response = await apiClient.post<Task>('/tasks/', task);
    return response.data;
  },
  
  updateTask: async (id: number, task: UpdateTaskDto): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/tasks/${id}/`, task);
    return response.data;
  },
  
  deleteTask: async (id: number): Promise<void> => {
    await apiClient.delete(`/tasks/${id}/`);
  },
  
  toggleTaskCompletion: async (id: number, completed: boolean): Promise<Task> => {
    const response = await apiClient.patch<Task>(`/tasks/${id}/`, { completed });
    return response.data;
  }
};
