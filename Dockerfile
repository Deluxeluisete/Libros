# Imagen base
FROM node:18

RUN mkdir -p /usr/src/app

# Establecimiento del directorio de trabajo
WORKDIR /usr/src/app

# Copiar el código de la aplicación al contenedor
COPY package*.json ./

# Instalar las dependencias de la aplicación
RUN npm install

COPY . .

EXPOSE 8080

# Especificar el comando por defecto para ejecutar al iniciar el contenedor
CMD ["npm", "start"]



