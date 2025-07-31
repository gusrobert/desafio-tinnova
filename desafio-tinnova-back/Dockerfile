# Multi-stage build
FROM maven:3.9.11-eclipse-temurin-17 AS builder

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos do projeto
COPY pom.xml .
COPY src ./src

# Compilar o projeto
RUN mvn clean package -DskipTests

# Stage final - runtime
FROM eclipse-temurin:17-jre

# Instalar curl para health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Criar usuário não-root
RUN addgroup --system spring && adduser --system spring --ingroup spring
USER spring:spring

# Definir diretório de trabalho
WORKDIR /app

# Copiar JAR do stage de build
COPY --from=builder /app/target/*.jar app.jar

# Expor porta
EXPOSE 8080

# Definir ponto de entrada
ENTRYPOINT ["java", "-jar", "app.jar"]
