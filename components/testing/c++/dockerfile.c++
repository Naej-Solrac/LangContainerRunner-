# Usa una imagen base con GCC instalado, que es un compilador para C++
FROM gcc:latest

# Establece el directorio de trabajo dentro del contenedor donde se ejecutarán todos los comandos siguientes
WORKDIR /app

# Copia todos los archivos desde tu directorio actual al directorio de trabajo en el contenedor
COPY . .

# Compila el código principal. Ajusta el nombre del ejecutable según necesites.
RUN g++ -o main_program code.cpp

# Compila el código de prueba. Ajusta el nombre del ejecutable de prueba según necesites.
RUN g++ -o test_program test_code.cpp

# El comando por defecto para ejecutar cuando el contenedor se inicia. Ajusta esto para ejecutar el programa que prefieras.
CMD ["./main_program"]

# También podrías configurar para que al ejecutar el contenedor, puedas elegir manualmente qué programa correr,
# por ejemplo, dejando el contenedor abierto con un shell interactivo:
# CMD ["/bin/bash"]
