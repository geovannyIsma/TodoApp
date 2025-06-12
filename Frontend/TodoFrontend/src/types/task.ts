export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
  user_id: number | null;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  completed: boolean;
  user_id?: number; // Add user_id as optional property
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  completed?: boolean;
  user_id?: number; // Add user_id as optional property
}
