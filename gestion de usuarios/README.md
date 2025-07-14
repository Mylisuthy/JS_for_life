# SPA Gestión de Usuarios y Cursos

## Tecnologías
- HTML5, CSS3 (Flexbox/Grid), JavaScript (ES6+)
- `json-server` como API REST simulada

## Estructura de Carpetas
```
/src
  /assets
  /components
    header.js
    sidebar.js
    modal.js
  /pages
    login.html
    register.html
    dashboard.html
    public.html
  /services
    auth.js
    users.js
    courses.js
    enrollments.js
  /utils
    validation.js
    storage.js
  main.js

db.json
README.md
```

## Instalación y Uso
1. Instala dependencias: `npm install -g json-server`
2. Inicia la API: `json-server --watch db.json --port 3000`
3. Abre `/src/pages/login.html` en tu navegador.

## Funcionalidades
- Autenticación y roles (admin, visitante)
- CRUD de usuarios y cursos (admin)
- Inscripción a cursos (visitante)
- Interfaz responsive y modular

## Estructura inicial de db.json
Consulta el archivo `db.json` para ver la estructura obligatoria.
