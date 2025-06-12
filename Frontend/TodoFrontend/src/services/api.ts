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

export const TaskService = {
  getAllTasks: async (): Promise<Task[]> => {
    const response = await apiClient.get<Task[]>('/tasks/');
    return response.data;
  },
  
  getTaskById: async (id: number): Promise<Task> => {
    const response = await apiClient.get<Task>(`/tasks/${id}/`);
    return response.data;
  },
  
  createTask: async (task: CreateTaskDto): Promise<Task> => {
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
