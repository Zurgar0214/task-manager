# task-manager-mvc

Estructura base de un proyecto MVC para un gestor de tareas usando NestJS (esqueleto).

Estructura:

/task-manager-mvc/
├── src/
│   ├── app/           # Lógica de aplicación (servicios, DTOs, casos de uso)
│   ├── domain/        # Modelo de dominio (entidades, interfaces, repositorios)
│   ├── ui/            # Controladores y endpoints (HTTP/adaptadores)
│   ├── main.ts        # Entry point de NestJS
│   └── app.module.ts  # Módulo raíz
├── test/
├── package.json
├── tsconfig.json
└── README.md

Swagger / Documentación OpenAPI
-------------------------------

La aplicación expone una interfaz Swagger UI para explorar la API.

- Inicia la aplicación en desarrollo:

```bash
npm run start
```

- Abre la documentación en: http://localhost:3000/api/docs

Decoradores añadidos
--------------------

Se añadieron decoradores de Swagger en `src/ui/task.controller.ts` y se crearon DTOs en `src/ui/dto/`:

- `src/ui/dto/create-task.dto.ts` — `CreateTaskDto` con propiedades documentadas (`@ApiProperty`).
- `src/ui/dto/update-task.dto.ts` — `UpdateTaskDto` con propiedades opcionales (`@ApiPropertyOptional`).

Recomendaciones
---------------

- Agrega `@ApiProperty`/`@ApiPropertyOptional` a otros DTOs/entidades según vayas definiendo más rutas.
- Considera habilitar Swagger sólo en entornos no productivos (comprobar `NODE_ENV`).

Configuración de entorno
-------------------------

Este proyecto utiliza una variable de entorno `MONGO_URI` para la conexión a MongoDB. Se carga automáticamente desde un archivo `.env` en la raíz del proyecto (usando `@nestjs/config`).

Ejemplo de `.env` (ya incluido en el repositorio):

```env
MONGO_URI="mongodb+srv://<user>:<password>@cluster0..."
```

Para cambiar la conexión, edita el `.env` o configura la variable de entorno en tu entorno de ejecución.

