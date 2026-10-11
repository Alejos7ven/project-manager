---
trigger: always_on
---

# REGLA FRONTEND — SPA React

## Setup
- React 18+ + Vite (+ TypeScript si el template lo usa). inspirate de mi proyecto speak-on-steem para ver mi ultimo trabajo react.
- Estilos: Tailwind CSS si el template lo trae; si no, CSS modules limpios. Nada de UI kits pesados nuevos.
- Routing: `react-router-dom` v6+.

## Arquitectura
src/
  api/         → instancia axios + funciones por recurso (auth.js, clients.js, projects.js)
  components/  → reutilizables (Button, Input, Modal, Table, StatCard, Pagination, SearchBar)
  pages/       → Login, Dashboard, Clients, Projects
  context/     → AuthContext (user, token, login, logout)
  hooks/       → useClients, useProjects, useDashboardStats

## Convenciones
- `api/client.js`: axios con `baseURL` desde `import.meta.env.VITE_API_URL`; interceptor inyecta Bearer token y redirige a /login en 401.
- Rutas protegidas con wrapper `ProtectedRoute` + AuthContext.
- Formularios controlados; validación en cliente (requeridos, email, fechas) + mostrar errores 422 del backend bajo cada campo.
- Estados de UI obligatorios: loading (spinner/skeleton), empty state ("No clients yet"), error state con reintento. Nada de pantallas en blanco.
- Dashboard: 4 StatCards (Total Clients, Active / Completed / Pending Projects) + proyectos recientes.
- Listas: SearchBar + filtro por estado + paginación (componentes reutilizables).
- Responsive mobile-first: tablas → cards apiladas o scroll horizontal controlado en móvil.
- Bonus IA: botón "✨ Generate with AI" junto al campo descripción del formulario de proyecto; spinner mientras genera e inserta el texto al recibirlo.

## Prohibido
- `console.log` en el código final.
- Hardcodear la URL de la API.
- `any` sin justificación (si es TypeScript).