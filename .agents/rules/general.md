---
trigger: always_on
---

 

## Qué es este proyecto
Dashboard de gestión de clientes y proyectos para una agencia digital. Es una PRUEBA TÉCNICA con límite de 24 horas para postular a un puesto Full-Stack Developer (Laravel + React). El evaluador revisará: estructura del proyecto, legibilidad del código, arquitectura de la API, validación, manejo de errores, diseño responsive, uso de Git/GitHub y enfoque de resolución de problemas. Entregable final: repositorio GitHub + demo en vivo (si es posible).

## Stack
- Backend: Laravel 11+ (API REST, solo API, sin Blade)
- Frontend: React + Vite (SPA)
- Base de datos: MySQL 
- Auth: Laravel Sanctum (tokens)

## Estructura del repositorio
/backend   → API Laravel
/frontend  → SPA React
README.md  → instalación, credenciales demo, endpoints

## Convenciones globales
- Todo el código, comentarios, nombres de variables, commits y README en INGLÉS.
- Commits atómicos y descriptivos en inglés: `feat: add client CRUD endpoints`, `fix: validate project dates`. Un commit por funcionalidad; nunca un solo commit gigante.
- Nunca commitear secretos: `.env.example` con valores de ejemplo; keys reales solo en `.env` local (ignorado por git).
- No sobre-ingenierizar: implementar exactamente los requerimientos + bonus listados. Nada de features inventadas.
- Prioridad: que TODO funcione de punta a punta antes de pulir diseño.

## Requerimientos funcionales
1. Login: página de login + dashboard autenticado (rutas protegidas).
2. Dashboard con: total de clientes, proyectos activos, completados y pendientes.
3. CRUD de clientes: nombre, email, teléfono, empresa, estado.
4. CRUD de proyectos: nombre, cliente (relación), descripción, estado, fecha inicio, fecha límite.
5. API REST en Laravel: autenticación, validación y manejo de errores adecuados.
6. Frontend React: dashboard, listas de clientes y proyectos, formularios crear/editar, responsive desktop + móvil.
7. Bonus (en orden de prioridad): búsqueda/filtros, paginación, integración con API de IA (botón "generar descripción" en el formulario de proyecto), UI limpia, roles.

## Estados permitidos
- Cliente: `active`, `inactive`, `lead`
- Proyecto: `pending`, `active`, `completed`
 
