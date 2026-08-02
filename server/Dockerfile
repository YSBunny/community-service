# 1단계: 애플리케이션 빌드
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

COPY gradlew .
COPY gradle ./gradle
COPY build.gradle .
COPY settings.gradle .

RUN chmod +x gradlew

COPY src ./src

RUN ./gradlew clean bootJar --no-daemon

RUN JAR_FILE="$(find build/libs -maxdepth 1 \
    -name '*.jar' ! -name '*-plain.jar' | head -n 1)" \
    && cp "$JAR_FILE" /app/app.jar


# 2단계: 실행 전용 이미지
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

RUN addgroup -S spring \
    && adduser -S spring -G spring \
    && mkdir -p /app/uploads \
    && chown -R spring:spring /app

COPY --from=build --chown=spring:spring /app/app.jar app.jar

USER spring

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]