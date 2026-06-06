# OpsFlow Docker Compose Makefile
# Usage: make <target>

.PHONY: help up up-build down restart restart-build logs ps clean

# Default target
help:
	@echo "OpsFlow Docker Compose Commands"
	@echo "==============================="
	@echo "  make up          - Start all services (use existing images)"
	@echo "  make up-build    - Start all services and rebuild images"
	@echo "  make down        - Stop and remove all services"
	@echo "  make restart     - Restart all services (use existing images)"
	@echo "  make restart-build - Restart all services and rebuild images"
	@echo "  make logs        - Follow logs from all services"
	@echo "  make ps          - Show running containers status"
	@echo "  make clean       - Stop services, remove containers, volumes, and images"
	@echo "  make api-logs    - Follow API service logs"
	@echo "  make web-logs    - Follow Web service logs"

# Start services (fast, no rebuild)
up:
	@echo "Starting OpsFlow services..."
	docker compose up -d

# Start services with rebuild
up-build:
	@echo "Starting OpsFlow services with rebuild..."
	docker compose up -d --build

# Stop services
down:
	@echo "Stopping OpsFlow services..."
	docker compose down

# Restart services (fast, no rebuild)
restart: down up
	@echo "OpsFlow services restarted."

# Restart services with rebuild
restart-build: down up-build
	@echo "OpsFlow services restarted with rebuild."

# Follow all logs
logs:
	docker compose logs -f

# Show container status
ps:
	docker compose ps

# Clean everything (containers, volumes, images)
clean:
	@echo "Cleaning OpsFlow containers, volumes, and images..."
	docker compose down -v --rmi all --remove-orphans

# API-specific logs
api-logs:
	docker compose logs -f api

# Web-specific logs
web-logs:
	docker compose logs -f web
