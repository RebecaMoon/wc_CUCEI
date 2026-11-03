#!/bin/bash

set -e

# Directorio raíz del proyecto
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$PROJECT_DIR"

SESSION="campusrestrooms-dev"

# Evitar iniciar una segunda sesión
if tmux has-session -t "$SESSION" 2>/dev/null; then
    echo "El entorno de desarrollo ya está iniciado."
    tmux attach-session -t "$SESSION"
    exit 0
fi

echo "Iniciando base de datos..."
sudo docker compose up -d db

echo "Esperando a PostgreSQL..."

until sudo docker compose exec -T db pg_isready -U campus_admin -d campusrestrooms >/dev/null 2>&1; do
    sleep 1
done

echo "Iniciando backend y frontend..."

# Panel 1: Backend
tmux new-session -d -s "$SESSION" -n desarrollo \
    -c "$PROJECT_DIR/backend" \
    "bash -c 'source .venv/bin/activate && python app.py'"

# Panel 2: Frontend
tmux split-window -h -t "$SESSION" \
    -c "$PROJECT_DIR/frontend" \
    "bash -c 'npm run dev -- --host 0.0.0.0'"

# Distribuir los paneles
tmux select-layout -t "$SESSION" tiled

echo "Entorno de desarrollo iniciado."

# Mostrar terminales
tmux attach-session -t "$SESSION"
