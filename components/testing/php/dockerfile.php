# Establece la imagen base con PHP CLI
FROM php:7.4-cli

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia los archivos del proyecto al directorio de trabajo en el contenedor
COPY . .

# Opcional: Si tienes un script para instalar dependencias o preparar el entorno, puedes descomentar la siguiente línea
# RUN php install.php

# Comando por defecto para ejecutar al iniciar el contenedor
# Aquí puedes ajustar para ejecutar tu script principal o dejar el contenedor en espera para comandos manuales
CMD ["php", "main.php"]

# docker build -t mi-aplicacion-php -f dockerfile.php .