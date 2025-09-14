# 🚀 Setup Supabase PostgreSQL

## Pasos para configurar Supabase:

### 1. Crear cuenta y proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta gratuita
3. Click en "New Project"
4. Llena los datos:
   - **Name**: `nextjs-blog`
   - **Database Password**: (genera una fuerte y guárdala)
   - **Region**: Closest to you
   - **Pricing Plan**: Free tier

### 2. Obtener Database URL

1. Una vez creado el proyecto, ve a **Settings** → **Database**
2. En la sección **Connection String**, copia la URL que dice **URI**
3. La URL tendrá este formato:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### 3. Configurar en el proyecto

Reemplaza la DATABASE_URL en tu archivo `.env.local` con la URL de Supabase.

### 4. Verificar conexión

```bash
# Verificar que Prisma puede conectarse
npx prisma db pull

# Si funciona, proceder con migraciones
npx prisma migrate dev --name init
```

## Notas importantes:

- ✅ La cuenta gratuita incluye: 500MB database, 50MB file storage
- ✅ Perfecto para desarrollo y proyectos pequeños
- ✅ Auto-backup y scaling automático
- ✅ Dashboard web incluido para administrar datos
