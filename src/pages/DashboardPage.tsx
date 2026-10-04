import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskSkeleton } from '@/components/tasks/TaskSkeleton';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { useAuth } from '@/hooks/useAuth';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';

import type { Project } from '@/services/project.service';
import type { Task } from '@/services/task.service';

import {
  AlertCircle,
  CheckCircle2,
  CheckSquare,
  Clock,
  FolderKanban,
  Inbox,
  ListTodo,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from 'lucide-react';

import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  // =========================================================
  // PROYECTOS
  // =========================================================

  const {
    projects,
    isLoading: isProjectsLoading,
    error: projectsError,
    addProject,
    editProject,
    removeProject,
  } = useProjects();

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  // Seleccionar automáticamente un proyecto válido
useEffect(() => {
  if (projects.length === 0) {
    setSelectedProjectId(null);
    return;
  }

  const selectedProjectExists = projects.some(
    (project) => project.id === selectedProjectId
  );

  if (!selectedProjectId || !selectedProjectExists) {
    setSelectedProjectId(projects[0].id);
  }
}, [projects, selectedProjectId]);

  // Proyecto seleccionado
  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) || null;

  // =========================================================
  // TAREAS
  // =========================================================

  const {
    tasks,
    isLoading: isTasksLoading,
    error: tasksError,
    fetchTasks,
    addTask,
    toggleTask,
    editTask,
    removeTask,
  } = useTasks(selectedProjectId);

  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // =========================================================
  // MÉTRICAS
  // =========================================================

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = totalTasks - completedTasks;

  // =========================================================
  // FUNCIONES DE PROYECTOS
  // =========================================================

  const openCreateProjectModal = () => {
    setProjectToEdit(null);
    setProjectName('');
    setProjectDescription('');
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (project: Project) => {
    setProjectToEdit(project);
    setProjectName(project.name);
    setProjectDescription(project.description || '');
    setIsProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setProjectToEdit(null);
    setProjectName('');
    setProjectDescription('');
  };

  const handleProjectSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!projectName.trim()) {
      return;
    }

    try {
      if (projectToEdit) {
        await editProject(projectToEdit.id, {
          name: projectName.trim(),
          description: projectDescription.trim(),
        });
      } else {
        const newProject = await addProject({
          name: projectName.trim(),
          description: projectDescription.trim(),
        });

        setSelectedProjectId(newProject.id);
      }

      closeProjectModal();
    } catch {
      // El hook ya muestra el mensaje de error
    }
  };

  const handleDeleteProject = async (project: Project) => {
    const confirmed = window.confirm(
      `¿Estás seguro de eliminar el proyecto "${project.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await removeProject(project.id);

      const remainingProjects = projects.filter(
        (item) => item.id !== project.id
      );

      if (selectedProjectId === project.id) {
        setSelectedProjectId(
          remainingProjects.length > 0
            ? remainingProjects[0].id
            : null
        );
      }
    } catch {
      // El hook ya muestra el mensaje de error
    }
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">

          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
              <CheckSquare className="h-5 w-5" />
            </div>

            <span className="text-xl font-bold text-white">
              Task<span className="text-indigo-400">Flow</span>
            </span>
          </div>

          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-200">
                {user?.name || 'Usuario'}
              </p>

              <p className="text-xs text-slate-400">
                {user?.email}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-1.5 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">
                Cerrar Sesión
              </span>
            </Button>

          </div>
        </div>
      </header>

      {/* =====================================================
          CONTENIDO PRINCIPAL
      ====================================================== */}

      <main className="container mx-auto px-4 py-8 sm:px-8">

        {/* ENCABEZADO */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Panel de Tareas
            </h1>

            <p className="text-sm text-slate-400">
              Gestiona tus proyectos y tareas desde un solo lugar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">

            <Button
              variant="outline"
              onClick={fetchTasks}
              disabled={isTasksLoading || !selectedProjectId}
              className="gap-2 border-slate-800 text-slate-300 hover:bg-slate-900"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isTasksLoading ? 'animate-spin' : ''
                }`}
              />

              <span>Actualizar</span>
            </Button>

            <Button
              onClick={() => setIsCreateTaskModalOpen(true)}
              disabled={!selectedProjectId}
              className="gap-2 bg-indigo-600 font-semibold text-white shadow-md hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" />
              <span>Nueva Tarea</span>
            </Button>

          </div>
        </div>

        {/* =====================================================
            PROYECTOS
        ====================================================== */}

        <section className="mb-8">

          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                <FolderKanban className="h-5 w-5 text-indigo-400" />
                Mis Proyectos
              </h2>

              <p className="text-sm text-slate-400">
                Selecciona un proyecto para administrar sus tareas.
              </p>
            </div>

            <Button
              onClick={openCreateProjectModal}
              className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" />
              Nuevo Proyecto
            </Button>

          </div>

          {/* ERROR DE PROYECTOS */}

          {projectsError && (
            <div className="mb-4 rounded-lg border border-rose-900/50 bg-rose-950/20 p-4 text-sm text-rose-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>{projectsError}</span>
              </div>
            </div>
          )}

          {/* CARGANDO PROYECTOS */}

          {isProjectsLoading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

              {Array.from({ length: 3 }).map((_, index) => (
                <Card
                  key={index}
                  className="border-slate-800 bg-slate-900/60"
                >
                  <CardContent className="p-5">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="mt-3 h-4 w-full" />
                    <Skeleton className="mt-2 h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}

            </div>
          ) : projects.length === 0 ? (

            <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/30 py-12 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                <FolderKanban className="h-7 w-7" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-200">
                No tienes proyectos
              </h3>

              <p className="mx-auto mt-1 max-w-md text-sm text-slate-400">
                Crea tu primer proyecto para comenzar a organizar tus tareas.
              </p>

              <Button
                onClick={openCreateProjectModal}
                className="mt-4 gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
              >
                <Plus className="h-4 w-4" />
                Crear primer proyecto
              </Button>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

              {projects.map((project) => {
                const isSelected =
                  project.id === selectedProjectId;

                return (
                  <Card
                    key={project.id}
                    className={`cursor-pointer border transition ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/30'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                    onClick={() =>
                      setSelectedProjectId(project.id)
                    }
                  >

                    <CardContent className="p-5">

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0">

                          <div className="flex items-center gap-2">

                            <FolderKanban
                              className={`h-5 w-5 ${
                                isSelected
                                  ? 'text-indigo-400'
                                  : 'text-slate-500'
                              }`}
                            />

                            <h3 className="truncate font-semibold text-white">
                              {project.name}
                            </h3>

                          </div>

                          <p className="mt-2 line-clamp-2 text-sm text-slate-400">
                            {project.description ||
                              'Sin descripción'}
                          </p>

                        </div>

                        {isSelected && (
                          <span className="rounded-full bg-indigo-500/20 px-2 py-1 text-xs font-medium text-indigo-300">
                            Seleccionado
                          </span>
                        )}

                      </div>

                      <div className="mt-4 flex items-center justify-end gap-2">

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation();
                            openEditProjectModal(project);
                          }}
                          className="gap-1 border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Editar
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteProject(project);
                          }}
                          className="gap-1 border-rose-900 text-rose-400 hover:bg-rose-950"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Eliminar
                        </Button>

                      </div>

                    </CardContent>
                  </Card>
                );
              })}

            </div>
          )}

        </section>

        {/* =====================================================
            PROYECTO SELECCIONADO
        ====================================================== */}

        {selectedProject && (
          <div className="mb-6 rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-5">

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-indigo-400">
                  Proyecto seleccionado
                </p>

                <h2 className="mt-1 text-xl font-bold text-white">
                  {selectedProject.name}
                </h2>

                {selectedProject.description && (
                  <p className="mt-1 text-sm text-slate-400">
                    {selectedProject.description}
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-indigo-500/10 px-4 py-2 text-center">
                <p className="text-xs text-slate-400">
                  Tareas
                </p>

                <p className="text-xl font-bold text-indigo-400">
                  {totalTasks}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* =====================================================
            MÉTRICAS
        ====================================================== */}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* TOTAL */}

          <Card className="border-slate-800 bg-slate-900/60">
            <CardContent className="flex items-center gap-4 p-5">

              <div className="rounded-lg bg-indigo-500/10 p-3 text-indigo-400">
                <ListTodo className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Total Tareas
                </p>

                {isTasksLoading ? (
                  <Skeleton className="mt-1 h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-slate-100">
                    {totalTasks}
                  </p>
                )}
              </div>

            </CardContent>
          </Card>

          {/* COMPLETADAS */}

          <Card className="border-slate-800 bg-slate-900/60">
            <CardContent className="flex items-center gap-4 p-5">

              <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Completadas
                </p>

                {isTasksLoading ? (
                  <Skeleton className="mt-1 h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-emerald-400">
                    {completedTasks}
                  </p>
                )}
              </div>

            </CardContent>
          </Card>

          {/* PENDIENTES */}

          <Card className="border-slate-800 bg-slate-900/60">
            <CardContent className="flex items-center gap-4 p-5">

              <div className="rounded-lg bg-amber-500/10 p-3 text-amber-400">
                <Clock className="h-6 w-6" />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  Pendientes
                </p>

                {isTasksLoading ? (
                  <Skeleton className="mt-1 h-8 w-12" />
                ) : (
                  <p className="text-2xl font-bold text-amber-400">
                    {pendingTasks}
                  </p>
                )}
              </div>

            </CardContent>
          </Card>

        </div>

        {/* =====================================================
            TAREAS
        ====================================================== */}

        {!selectedProjectId ? (

          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 py-16 text-center">

            <div className="rounded-full bg-slate-800/80 p-4 text-slate-400">
              <Inbox className="h-8 w-8" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-slate-200">
              Selecciona un proyecto
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-400">
              Selecciona un proyecto existente o crea uno nuevo para administrar sus tareas.
            </p>

          </div>

        ) : isTasksLoading ? (

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

            {Array.from({ length: 6 }).map((_, index) => (
              <TaskSkeleton key={index} />
            ))}

          </div>

        ) : tasksError ? (

          <div className="flex flex-col items-center justify-center rounded-xl border border-rose-900/50 bg-rose-950/20 p-8 text-center">

            <AlertCircle className="h-10 w-10 text-rose-500" />

            <h3 className="mt-3 text-lg font-semibold text-rose-300">
              Error al cargar tareas
            </h3>

            <p className="mt-1 max-w-md text-sm text-rose-400/80">
              {tasksError}
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchTasks}
              className="mt-4 border-rose-800 text-rose-300 hover:bg-rose-950"
            >
              Reintentar
            </Button>

          </div>

        ) : tasks.length === 0 ? (

          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 py-16 text-center">

            <div className="rounded-full bg-slate-800/80 p-4 text-slate-400">
              <Inbox className="h-8 w-8" />
            </div>

            <h3 className="mt-4 text-base font-semibold text-slate-200">
              No tienes tareas registradas
            </h3>

            <p className="mt-1 max-w-sm text-sm text-slate-400">
              Este proyecto todavía no tiene tareas. Crea la primera para comenzar.
            </p>

            <Button
              onClick={() => setIsCreateTaskModalOpen(true)}
              className="mt-4 gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
            >
              <Plus className="h-4 w-4" />
              Crear primera tarea
            </Button>

          </div>

        ) : (

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={removeTask}
                onEdit={setTaskToEdit}
              />
            ))}

          </div>
        )}

        {/* =====================================================
            MODAL CREAR TAREA
        ====================================================== */}

        <TaskForm
          open={isCreateTaskModalOpen}
          onOpenChange={setIsCreateTaskModalOpen}
          onSubmit={addTask}
        />

        {/* =====================================================
            MODAL EDITAR TAREA
        ====================================================== */}

        <TaskForm
          open={Boolean(taskToEdit)}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setTaskToEdit(null);
            }
          }}
          initialData={taskToEdit}
          onSubmit={async (data) => {
            if (taskToEdit) {
              await editTask(taskToEdit.id, data);
            }
          }}
        />

        {/* =====================================================
            MODAL CREAR / EDITAR PROYECTO
        ====================================================== */}

        {isProjectModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

            <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">

              <div className="mb-6">

                <h2 className="text-xl font-bold text-white">
                  {projectToEdit
                    ? 'Editar Proyecto'
                    : 'Nuevo Proyecto'}
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  {projectToEdit
                    ? 'Modifica la información del proyecto.'
                    : 'Crea un proyecto para organizar tus tareas.'}
                </p>

              </div>

              <form
                onSubmit={handleProjectSubmit}
                className="space-y-5"
              >

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Nombre del proyecto
                  </label>

                  <input
                    type="text"
                    value={projectName}
                    onChange={(event) =>
                      setProjectName(event.target.value)
                    }
                    placeholder="Ej. Proyecto académico"
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Descripción
                  </label>

                  <textarea
                    value={projectDescription}
                    onChange={(event) =>
                      setProjectDescription(event.target.value)
                    }
                    placeholder="Describe brevemente el proyecto..."
                    rows={4}
                    className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-3">

                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeProjectModal}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Cancelar
                  </Button>

                  <Button
                    type="submit"
                    disabled={!projectName.trim()}
                    className="bg-indigo-600 text-white hover:bg-indigo-500"
                  >
                    {projectToEdit
                      ? 'Guardar cambios'
                      : 'Crear proyecto'}
                  </Button>

                </div>

              </form>

            </div>
          </div>
        )}

      </main>
    </div>
  );
}