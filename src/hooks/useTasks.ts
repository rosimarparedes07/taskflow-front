import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import {
  getTasksRequest,
  createTaskRequest,
  updateTaskRequest,
  completeTaskRequest,
  deleteTaskRequest,
  pendingTaskRequest,
  type Task,
  type CreateTaskDTO,
  type UpdateTaskDTO,
} from '@/services/task.service';

/**
 * Custom Hook para gestionar las tareas de un proyecto.
 *
 * El projectId identifica el proyecto cuyas tareas se están gestionando.
 */
export function useTasks(projectId?: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtener las tareas del proyecto seleccionado
   */
  const fetchTasks = useCallback(async () => {
    if (!projectId) {
      setTasks([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getTasksRequest(projectId);

      setTasks(response.data.items);
      toast.success('Lista de tareas sincronizada');
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Error al cargar las tareas';

      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  /**
   * Carga inicial de tareas cuando cambia el proyecto
   */
  useEffect(() => {
    let ignore = false;

    const loadInitialTasks = async () => {
      if (!projectId) {
        setTasks([]);
        setError(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await getTasksRequest(projectId);

        if (!ignore) {
          setTasks(response.data.items);
        }
      } catch (err) {
        if (!ignore) {
          const msg =
            err instanceof Error
              ? err.message
              : 'Error al cargar las tareas';

          setError(msg);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadInitialTasks();

    return () => {
      ignore = true;
    };
  }, [projectId]);

  /**
   * Crear tarea
   */
  const addTask = async (data: CreateTaskDTO) => {
    if (!projectId) {
      const msg = 'Selecciona un proyecto antes de crear una tarea';
      toast.error(msg);
      throw new Error(msg);
    }

    try {
      const response = await createTaskRequest(projectId, data);

      setTasks((prev) => [response.data, ...prev]);

      toast.success('Tarea creada con éxito');

      return response.data;
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Error al crear la tarea';

      toast.error(msg);
      throw err;
    }
  };

  /**
   * Cambiar estado de una tarea
   */
  const toggleTask = async (id: string) => {
    if (!projectId) {
      toast.error('Selecciona un proyecto');
      return;
    }

    try {
      const currentTask = tasks.find((task) => task.id === id);

      if (!currentTask) {
        throw new Error('No se encontró la tarea');
      }

      const response = currentTask.completed
        ? await pendingTaskRequest(projectId, id)
        : await completeTaskRequest(projectId, id);

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? response.data : task
        )
      );

      if (response.data.completed) {
        toast.success('¡Tarea completada!');
      } else {
        toast.info('Tarea marcada como pendiente');
      }
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Error al cambiar el estado';

      toast.error(msg);
    }
  };

  /**
   * Editar tarea
   */
  const editTask = async (
    id: string,
    data: UpdateTaskDTO
  ) => {
    if (!projectId) {
      const msg = 'Selecciona un proyecto antes de editar una tarea';
      toast.error(msg);
      throw new Error(msg);
    }

    try {
      const response = await updateTaskRequest(
  projectId,
  id,
  data
);

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? response.data : task
        )
      );

      toast.success('Tarea actualizada correctamente');

      return response.data;
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Error al actualizar la tarea';

      toast.error(msg);
      throw err;
    }
  };

  /**
   * Eliminar tarea
   */
  const removeTask = async (id: string) => {
    if (!projectId) {
      const msg = 'Selecciona un proyecto antes de eliminar una tarea';
      toast.error(msg);
      throw new Error(msg);
    }

    try {
      await deleteTaskRequest(projectId, id);

      setTasks((prev) =>
        prev.filter((task) => task.id !== id)
      );

      toast.success('Tarea eliminada del sistema');
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Error al eliminar la tarea';

      toast.error(msg);
      throw err;
    }
  };

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    toggleTask,
    editTask,
    removeTask,
  };
}