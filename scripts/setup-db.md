# 🗄️ Setup de Base de Datos PostgreSQL

## Opciones Disponibles:

### 1. 🐳 Docker (Recomendado para desarrollo)

```bash
# Iniciar PostgreSQL con Docker
docker-compose up -d

# Verificar que está corriendo
docker ps

# Configurar DATABASE_URL en .env.local:
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nextjs_blog"
```

### 2. 💻 PostgreSQL Local

Si tienes PostgreSQL instalado localmente:

```bash
# Crear base de datos
createdb nextjs_blog

# Configurar DATABASE_URL en .env.local con tus credenciales:
DATABASE_URL="postgresql://tu_usuario:tu_password@localhost:5432/nextjs_blog"
```

### 3. ☁️ Railway/Supabase (Para producción)

1. Crear cuenta en Railway o Supabase
2. Crear nueva base de datos PostgreSQL
3. Copiar la URL de conexión
4. Configurar en .env.local

## Próximos pasos:

1. Ejecutar migraciones: `npx prisma migrate dev`
2. Poblar con datos: `npx prisma db seed`
3. Verificar en Prisma Studio: `npx prisma studio`
