---
trigger: always_on
---


# REGLA BACKEND — API Laravel

## Setup
- Laravel 11+, modo API. Punto de partida: [RUTA_A_TU_TEMPLATE_LARAVEL] (copiar a ./backend y adaptar; si no aplica, crear desde cero).
- Autenticación: Laravel Sanctum (Personal Access Tokens).

## Arquitectura
- Rutas versionadas bajo prefijo `/api/v1` en `routes/api.php`.
- Controladores delgados en `app/Http/Controllers/Api/V1/`.
- TODA la validación en FormRequests (`app/Http/Requests/`); nunca validar en el controlador.
- Respuestas con API Resources (`app/Http/Resources/`).
- Lógica repetida → Service classes en `app/Services/`.
- Relaciones: `Client hasMany Projects`, `Project belongsTo Client`. Decidir y documentar: al borrar un cliente con proyectos, impedir el borrado (409 con mensaje claro).

## Formato JSON estándar (toda la API)
- Éxito: `{ "success": true, "data": {...}, "message": "..." }`
- Error: `{ "success": false, "message": "...", "errors": {...} }`
- Códigos correctos: 200, 201, 204, 400, 401, 403, 404, 422.

## Validación (FormRequests)
- Cliente: nombre requerido, email requerido/único/formato válido, teléfono opcional, estado en valores permitidos.
- Proyecto: nombre requerido, `client_id` debe existir, `deadline` >= `start_date`, estado en valores permitidos.
- Errores de validación → 422 con el formato de error estándar.

## Obligatorios
- Seeders: usuario demo (credenciales documentadas en README) + 8–12 clientes y 15–20 proyectos de ejemplo con estados variados.
- `.env.example` completo (DB, Sanctum, AI key opcional).
- Endpoint bonus IA: `POST /api/v1/ai/generate-description` recibe `{ "project_name", "client_name" }` y devuelve `{ "description" }` usando key de `config/services.php`. Sin key configurada → 503 con mensaje claro (no romper la app).
- Endpoint de stats: `GET /api/v1/dashboard/stats` → `{ total_clients, active_projects, completed_projects, pending_projects }`.

## Prohibido
- Blade o vistas del lado servidor.
- Exponer stack traces (`APP_DEBUG=false` en producción).
- Hardcodear credenciales o URLs.