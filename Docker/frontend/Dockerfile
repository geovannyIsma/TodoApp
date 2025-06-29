# Etapa de compilación
FROM node:20-alpine as build

WORKDIR /app

# Copiar archivos de dependencias
COPY Frontend/TodoFrontend/package.json Frontend/TodoFrontend/package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY Frontend/TodoFrontend/ ./

# Compilar la aplicación
RUN npm run build       

FROM nginx:alpine

# Copiar configuración de nginx
COPY Docker/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos de compilación al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD sh -c "sleep 15 && nginx -g 'daemon off;'"