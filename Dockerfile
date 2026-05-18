# --- Stage 1: build --------------------------------------------------------
FROM eclipse-temurin:21-jdk AS build

WORKDIR /workspace

# Cache de dependencias
COPY .mvn .mvn
COPY mvnw mvnw
COPY pom.xml pom.xml
RUN chmod +x mvnw && ./mvnw -B -q dependency:go-offline

# Compila e empacota (pulando testes — o CI ja roda)
COPY src src
RUN ./mvnw -B -q clean package -DskipTests

# --- Stage 2: runtime ------------------------------------------------------
FROM eclipse-temurin:21-jre AS runtime

WORKDIR /app

# Usuario nao-root
RUN groupadd --system spring && useradd --system --gid spring spring
USER spring

COPY --from=build /workspace/target/*.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
