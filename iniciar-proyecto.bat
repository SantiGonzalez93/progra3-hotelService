@echo off
echo Configurando variables de entorno...
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.8.9-hotspot

echo Iniciando aplicacion Spring Boot...
C:\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run

pause

