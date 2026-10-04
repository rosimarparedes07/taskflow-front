import { apiFetch, type ApiResponse } from './api';

// Modelo de un proyecto
export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Datos para crear un proyecto
export interface CreateProjectDTO {
  name: string;
  description: string;
}

// Datos para actualizar un proyecto
export interface UpdateProjectDTO {
  name: string;
  description: string;
  status?: string;
}

/**
 * Obtener todos los proyectos del usuario autenticado
 * Endpoint: GET /projects
 */
export async function getProjectsRequest(): Promise<
  ApiResponse<Project[]>
> {
  return apiFetch<Project[]>('/projects');
}

/**
 * Obtener un proyecto por ID
 * Endpoint: GET /projects/:id
 */
export async function getProjectRequest(
  id: string
): Promise<ApiResponse<Project>> {
  return apiFetch<Project>(`/projects/${id}`);
}

/**
 * Crear un nuevo proyecto
 * Endpoint: POST /projects
 */
export async function createProjectRequest(
  projectData: CreateProjectDTO
): Promise<ApiResponse<Project>> {
  return apiFetch<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  });
}

/**
 * Actualizar un proyecto
 * Endpoint: PUT /projects/:id
 */
export async function updateProjectRequest(
  id: string,
  projectData: UpdateProjectDTO
): Promise<ApiResponse<Project>> {
  return apiFetch<Project>(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(projectData),
  });
}

/**
 * Eliminar un proyecto
 * Endpoint: DELETE /projects/:id
 */
export async function deleteProjectRequest(
  id: string
): Promise<ApiResponse<Project>> {
  return apiFetch<Project>(`/projects/${id}`, {
    method: 'DELETE',
  });
}