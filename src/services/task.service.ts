import { apiFetch, type ApiResponse } from './api';

// 1. Modelo de datos de una Tarea
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt?: string;
  userId?: string;
}

// 2. Objetos de transferencia de datos (DTOs)
export interface CreateTaskDTO {
  title: string;
  description: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
}

/**
 * Obtener todas las tareas del usuario autenticado
 * Endpoint: GET /tasks
 */
export async function getTasksRequest(): Promise<ApiResponse<Task[]>> {
  return apiFetch<Task[]>('/tasks');
}

/**
 * Crear una nueva tarea
 * Endpoint: POST /tasks
 */
export async function createTaskRequest(
  taskData: CreateTaskDTO
): Promise<ApiResponse<Task>> {
  return apiFetch<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
}

/**
 * Actualizar título y/o descripción de una tarea existente
 * Endpoint: PUT /tasks/:id
 */
export async function updateTaskRequest(
  id: string,
  taskData: UpdateTaskDTO
): Promise<ApiResponse<Task>> {
  return apiFetch<Task>(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  });
}

/**
 * Alternar estado completado de una tarea
 * Endpoint: PATCH /tasks/:id/complete
 */
export async function completeTaskRequest(
  id: string
): Promise<ApiResponse<Task>> {
  return apiFetch<Task>(`/tasks/${id}/complete`, {
    method: 'PATCH',
  });
}

/**
 * Eliminar una tarea permanentemente
 * Endpoint: DELETE /tasks/:id
 */
export async function deleteTaskRequest(
  id: string
): Promise<ApiResponse<null>> {
  return apiFetch<null>(`/tasks/${id}`, {
    method: 'DELETE',
  });
}

/**
 * Marcar una tarea como pendiente nuevamente
 * Endpoint: PATCH /tasks/:id/pending
 */
export async function pendingTaskRequest(
  id: string
): Promise<ApiResponse<Task>> {
  return apiFetch<Task>(`/tasks/${id}/pending`, {
    method: 'PATCH',
  });
}
