# Utilizar la imagen oficial de OpenJDK (puedes cambiar la versión según necesites)
FROM openjdk:11

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Opcional: si planeas construir la imagen con el código ya dentro (no recomendado para tu caso, ya que usas volúmenes)
# COPY . /app

# Compilar el archivo Java cuando se construye la imagen (esto es opcional y podría no ser lo que necesitas)
# RUN javac MyApplication.java

# El comando por defecto que corre en el contenedor, esto puede ser sobreescrito por cualquier comando de `docker run`
CMD ["java", "MyApplication"]