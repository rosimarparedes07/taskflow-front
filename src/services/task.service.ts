import { apiFetch, type ApiResponse } from './api';

// Modelo de datos de una tarea
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  projectId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Datos para crear una tarea
export interface CreateTaskDTO {
  title: string;
  description?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
}

// Datos para actualizar una tarea
export interface TaskListResponse {
  items: Task[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

/**
 * Obtener las tareas de un proyecto
 * Endpoint: GET /tasks/:projectId
 */
export async function getTasksRequest(
  projectId: string
): Promise<ApiResponse<TaskListResponse>> {
  return apiFetch<TaskListResponse>(`/tasks/${projectId}`);
}

/**
 * Crear una nueva tarea dentro de un proyecto
 * Endpoint: POST /tasks/:projectId
 */
export async function createTaskRequest(
  projectId: string,
  taskData: CreateTaskDTO
): Promise<ApiResponse<Task>> {
  return apiFetch<Task>(`/tasks/${projectId}`, {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
}

/**
 * Actualizar una tarea
 * Endpoint: PATCH /tasks/:projectId
 *
 * El id de la tarea se envía dentro del body.
 */
export async function updateTaskRequest(
  projectId: string,
  id: string,
  taskData: UpdateTaskDTO
): Promise<ApiResponse<Task>> {
  return apiFetch<Task>(`/tasks/${projectId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      id,
      ...taskData,
    }),
  });
}

/**
 * Marcar una tarea como completada
 * Endpoint: PATCH /tasks/:projectId/complete
 */
export async function completeTaskRequest(
  projectId: string,
  id: string
): Promise<ApiResponse<Task>> {
  return apiFetch<Task>(`/tasks/${projectId}/complete`, {
    method: 'PATCH',
    body: JSON.stringify({ id }),
  });
}

/**
 * Eliminar una tarea
 * Endpoint: DELETE /tasks/:projectId
 */
export async function deleteTaskRequest(
  projectId: string,
  id: string
): Promise<ApiResponse<null>> {
  return apiFetch<null>(`/tasks/${projectId}`, {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  });
}

/**
 * Marcar una tarea como pendiente
 * Endpoint: PATCH /tasks/:projectId/pending
 */
export async function pendingTaskRequest(
  projectId: string,
  id: string
): Promise<ApiResponse<Task>> {
  return apiFetch<Task>(`/tasks/${projectId}/pending`, {
    method: 'PATCH',
    body: JSON.stringify({ id }),
  });
}