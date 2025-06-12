# Etapa de compilación
FROM node:20-alpine as build

WORKDIR /app

# Copiar archivos de dependencias
COPY Frontend/TodoFrontend/package.json Frontend/TodoFrontend/package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY Frontend/TodoFrontend/ ./

# Crear un archivo .env para la URL del API
RUN echo "VITE_API_URL=http://localhost:8000/api" > .env

# Compilar la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar configuración de nginx
COPY Docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos de compilación al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
