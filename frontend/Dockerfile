# Etapa 1: Compilación con Node.js
FROM node:24-alpine AS builder

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar el proyecto (genera la carpeta dist)
RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:alpine

# Eliminar configuración por defecto
RUN rm /etc/nginx/conf.d/default.conf

# Copiar configuración personalizada de Nginx (si existe)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos compilados desde la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Verificar que los archivos existen
RUN ls -la /usr/share/nginx/html && \
    ls -la /usr/share/nginx/html/assets || true

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]