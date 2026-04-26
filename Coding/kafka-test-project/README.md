# Kafka Test Project

Small Spring Boot project for experimenting with Kafka producer and consumer flows.

## What is included

- Spring Boot application with Kafka producer and consumer
- `POST /api/messages` endpoint to send messages to Kafka
- `GET /api/messages` endpoint to inspect received messages in memory
- Integration test using Spring Kafka's embedded broker

## Run locally

Start Kafka locally on `localhost:9092`, then run:

```bash
./mvnw spring-boot:run
```

Send a message:

```bash
curl -X POST http://localhost:8080/api/messages \
  -H "Content-Type: application/json" \
  -d '{"message":"hello kafka"}'
```

List received messages:

```bash
curl http://localhost:8080/api/messages
```

## Run tests

```bash
./mvnw test
```
