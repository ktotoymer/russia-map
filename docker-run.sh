#!/bin/bash

# Add Docker to PATH
export PATH="/Applications/Docker.app/Contents/Resources/bin:$PATH"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker daemon is not running. Please start Docker Desktop first."
    echo "   Open Docker Desktop from Applications and wait for it to fully start."
    exit 1
fi

# Change to project directory
cd "$(dirname "$0")"

# Use docker-compose if available, otherwise try docker compose
if command -v docker-compose > /dev/null 2>&1; then
    docker-compose "$@"
elif docker compose version > /dev/null 2>&1; then
    docker compose "$@"
else
    echo "❌ Neither docker-compose nor docker compose is available."
    echo "   Please ensure Docker Desktop is fully started."
    exit 1
fi

