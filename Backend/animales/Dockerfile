# --- Etapa 1: Build (Construcción) ---
# Usamos una imagen de Node.js para compilar el proyecto
FROM node:18 AS builder

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de dependencias y las instalamos
COPY package*.json ./
RUN npm install

# Copiamos el resto del código fuente
COPY . .

# Compilamos la aplicación a JavaScript
RUN npm run build

# --- Etapa 2: Production (Producción) ---
# Usamos una imagen de Node.js mucho más liviana y segura
FROM node:18-alpine

WORKDIR /app

# Copiamos solo los archivos necesarios de la etapa anterior
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# El comando que se ejecutará cuando el contenedor inicie
CMD ["node", "dist/main"]