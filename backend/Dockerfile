# Usa Node.js 24 oficial
FROM node:24-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar TypeScript (si es necesario)
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Comando para iniciar en producción
CMD ["node", "dist/main"]
# Si no tienes compilación, usa: CMD ["npm", "run", "start:dev"]