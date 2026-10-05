# ⚡ TaskFlow Frontend

**Estudiante:** Rosimar Paredes  
**Módulo:** Módulo 7 – React  
**Proyecto:** Sistema de administración de proyectos y tareas

Aplicación web para la administración de proyectos y tareas, desarrollada con React, TypeScript y Vite.

## 🚀 Funcionalidades

### 🔐 Autenticación

- Registro de usuarios.
- Inicio de sesión.
- Autenticación mediante JWT.
- Persistencia del token en `localStorage`.
- Rutas protegidas mediante `ProtectedRoute`.
- Cierre de sesión.

### 📁 Gestión de proyectos

- Crear proyectos.
- Listar proyectos.
- Editar proyectos.
- Eliminar proyectos.
- Seleccionar un proyecto para administrar sus tareas.

### 📋 Gestión de tareas

- Crear tareas dentro de un proyecto.
- Listar tareas de un proyecto.
- Editar tareas.
- Eliminar tareas.
- Marcar tareas como completadas.
- Marcar tareas como pendientes.
- Visualizar métricas de tareas:
  - Total.
  - Completadas.
  - Pendientes.

### 🎨 Interfaz

- Dashboard principal.
- Formularios para proyectos y tareas.
- Modales para crear y editar información.
- Indicadores de carga.
- Manejo de errores.
- Notificaciones mediante Toast.
- Diseño responsive.

---

## 🛠️ Tecnologías utilizadas

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Context API
- Hooks de React
- Sonner
- Lucide React

---

## 📁 Estructura principal

```text
src/
├── components/
│   ├── common/
│   ├── tasks/
│   └── ui/
├── context/
│   └── AuthContext
├── hooks/
│   ├── useAuth.ts
│   ├── useProjects.ts
│   └── useTasks.ts
├── layouts/
├── lib/
├── pages/
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── DashboardPage.tsx
├── services/
│   ├── api.ts
│   ├── auth.service.ts
│   ├── project.service.ts
│   └── task.service.ts
├── App.tsx
└── main.tsx