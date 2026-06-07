FROM nginx:alpine

# Eliminar configuración por defecto
RUN rm /etc/nginx/conf.d/default.conf

# Copiar configuración personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos compilados
COPY dist /usr/share/nginx/html

# Verificar que los archivos existen
RUN ls -la /usr/share/nginx/html && \
    ls -la /usr/share/nginx/html/assets || true

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]