FROM node:22 AS frontend-build

WORKDIR /app/frontend

COPY frontend-app/package*.json ./
RUN npm install

COPY frontend-app/ .
RUN npm run build


# ---------- Step 2: Build FastAPI ----------
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend

# Copy React build into backend static folder
COPY --from=frontend-build /app/frontend/dist ./backend/static

WORKDIR /app/backend

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]