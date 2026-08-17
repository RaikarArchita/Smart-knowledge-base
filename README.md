Smart Knowledge Base

A full-stack personal knowledge management application built with React, FastAPI, and PostgreSQL. It allows users to organize notes into folders, search and manage knowledge, and use an AI service to automatically suggest relevant tags for note content.

✨ Features

🔐 User registration, login, JWT authentication, refresh and logout
📝 Create, edit, view, and delete notes
📁 Organize notes using folders
🌳 Folder tree management
🏷️ Create and manage note tags
🔎 Search and manage knowledge content
🤖 AI-powered tag suggestions for notes
📊 Dashboard with knowledge-base statistics
🛡️ CSRF protection for state-changing API requests
⚡ FastAPI REST API
🐘 PostgreSQL database
🎨 Responsive React UI with Material UI
🐳 Docker support for building the frontend and serving it through FastAPI


🏗️ Architecture

┌──────────────────────────────┐
│        React Frontend        │
│  React 19 + Vite + MUI       │
└──────────────┬───────────────┘
               │ REST / Axios
               ▼
┌──────────────────────────────┐
│        FastAPI Backend       │
│                              │
│  Auth │ Notes │ Folders      │
│  Dashboard │ AI Services     │
└──────────────┬───────────────┘
               │ SQLAlchemy
               ▼
┌──────────────────────────────┐
│        PostgreSQL            │
└──────────────────────────────┘

               │
               │ AI Tag Suggestion
               ▼
┌──────────────────────────────┐
│ Hugging Face Inference API   │
│        LLM Service           │
└──────────────────────────────┘

🛠️ Tech Stack

Frontend

React 19

Vite

React Router

Material UI

Axios

TanStack React Query

Formik

Recharts

Day.js

Backend

Python 3.11

FastAPI

SQLAlchemy 2

Pydantic

Async PostgreSQL access

JWT authentication

python-jose

bcrypt

Hugging Face Inference API

Database

PostgreSQL

asyncpg

Deployment

Docker

Uvicorn

Frontend production build served through FastAPI

📂 Project Structure

Smart-knowledge-base/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── dependencies.py
│   │   │
│   │   ├── crud/
│   │   │   ├── dashboard.py
│   │   │   ├── folders.py
│   │   │   ├── notes.py
│   │   │   └── user.py
│   │   │
│   │   ├── models/
│   │   │   ├── folders.py
│   │   │   ├── notes.py
│   │   │   ├── notes_tags.py
│   │   │   ├── tags.py
│   │   │   └── user.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── ai.py
│   │   │   ├── folders.py
│   │   │   ├── notes.py
│   │   │   ├── tags.py
│   │   │   └── user.py
│   │   │
│   │   ├── services/
│   │   │   ├── ai_service.py
│   │   │   └── llm_service.py
│   │   │
│   │   ├── utils/
│   │   ├── main.py
│   │   └── router.py
│   │
│   └── requirements.txt
│
├── frontend-app/
│   ├── src/
│   │   ├── components/
│   │   ├── constants/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── views/
│   │       ├── dashboard/
│   │       ├── login/
│   │       ├── register/
│   │       └── workspace/
│   │
│   ├── package.json
│   └── vite.config.js
│
├── Dockerfile
└── README.md

🚀 Getting Started

Prerequisites

Make sure you have the following installed:

Python 3.11+

Node.js 20+

npm

PostgreSQL

Git

A Hugging Face API token for AI tag suggestions

1. Clone the Repository

git clone <your-repository-url>
cd Smart-knowledge-base

2. Configure the Backend

Create a .env file inside the backend directory:

ENV_NAME=Development
BASE_URL=http://localhost:8000

DB_URL=postgresql+asyncpg://postgres:password@localhost:5432/knowledge_base

SECRET_KEY=your-secret-key
ALGORITHM=HS256

HF_TOKEN=your-huggingface-token
MODEL_NAME=your-huggingface-chat-model

Never commit .env files or API tokens to Git. The repository already ignores .env files.

PostgreSQL

Create a PostgreSQL database:

CREATE DATABASE knowledge_base;

Update DB_URL with your PostgreSQL username, password, host, port, and database name.

The application uses an async PostgreSQL driver, so the SQLAlchemy connection URL should use postgresql+asyncpg.

3. Install Backend Dependencies

From the project root:

cd backend

Create a virtual environment:

Windows

python -m venv venv
venv\Scripts\activate

macOS / Linux

python3 -m venv venv
source venv/bin/activate

Install dependencies:

pip install -r requirements.txt

4. Start the Backend

From the backend directory:

uvicorn app.main:app --reload

The API will be available at:

http://localhost:8000

FastAPI Swagger documentation:

http://localhost:8000/docs

ReDoc:

http://localhost:8000/redoc

5. Start the Frontend

Open another terminal:

cd frontend-app
npm install
npm run dev

The frontend will normally be available at:

http://localhost:5173

🤖 AI Tag Suggestion

The application includes an AI endpoint that analyzes note content and suggests five concise, relevant tags.

Request

POST /api/v1/ai/suggest-tags
Content-Type: application/json

Example:

{
  "content": "Customer churn prediction using feature engineering and Random Forest."
}

The backend sends a structured prompt to the configured Hugging Face model and expects JSON containing a list of tags.

Example result:

[
  "Customer Churn",
  "Feature Engineering",
  "Random Forest",
  "Machine Learning",
  "Predictive Analytics"
]

The AI service uses temperature 0 to make tag generation more deterministic.

🔐 Authentication

Authentication is implemented using JWT-based access/refresh tokens.

Available user operations include:

Method

Endpoint

Purpose

POST

/api/v1/user/register

Register a user

POST

/api/v1/user/login

Login

POST

/api/v1/user/refresh

Refresh authentication

POST

/api/v1/user/logout

Logout

GET

/api/v1/user/me

Get current user

Protected APIs require an authenticated user.

📁 Folder APIs

Method

Endpoint

Purpose

POST

/api/v1/folders/create-folder

Create a folder

GET

/api/v1/folders/folder-tree

Get folder hierarchy

PATCH

/api/v1/folders/rename-folder

Rename a folder

DELETE

/api/v1/folders/delete-folder/{folder_id}

Delete a folder

📝 Note APIs

Method

Endpoint

Purpose

GET

/api/v1/notes/get-notes/{folder_id}

Get notes for a folder

POST

/api/v1/notes/create-note

Create a note

PATCH

/api/v1/notes/edit-note

Edit a note

DELETE

/api/v1/notes/delete-note/{note_id}

Delete a note

📊 Dashboard

The dashboard API provides aggregated information about the knowledge base:

GET /api/v1/dashboard/

🛡️ CSRF Protection

The backend includes CSRF protection for state-changing requests.

Safe methods such as:

GET

HEAD

OPTIONS

are allowed without CSRF validation.

Authentication and AI tag-suggestion endpoints are also excluded where required by the application flow.

For protected state-changing requests, the frontend sends:

X-CSRF-Token: <csrf-token>

and the backend validates it against the CSRF cookie.

🐳 Docker

The repository includes a multi-stage Dockerfile.

Build

From the project root:

docker build -t smart-knowledge-base .

Run

docker run -p 8000:8000 --env-file backend/.env smart-knowledge-base

The Docker build:

Installs frontend dependencies.

Builds the React application.

Creates a Python image for FastAPI.

Installs backend dependencies.

Copies the React production build into the backend static directory.

Starts Uvicorn.

The application can then be accessed through:

http://localhost:8000

🔄 Application Flow

Creating a Note

User
  ↓
React UI
  ↓
POST /notes/create-note
  ↓
FastAPI Router
  ↓
CRUD Layer
  ↓
SQLAlchemy
  ↓
PostgreSQL

AI Tag Generation

User enters note content
        ↓
React UI
        ↓
POST /ai/suggest-tags
        ↓
AIService
        ↓
Prompt generation
        ↓
LLMService
        ↓
Hugging Face Inference API
        ↓
JSON tag response
        ↓
React UI

🔧 Development

Frontend

Run the development server:

npm run dev

Build for production:

npm run build

Run ESLint:

npm run lint

Preview the production build:

npm run preview

Backend

Run FastAPI with auto-reload:

uvicorn app.main:app --reload

🔒 Environment Variables

Variable

Description

ENV_NAME

Application environment name

BASE_URL

Backend base URL

DB_URL

Async PostgreSQL connection string

SECRET_KEY

Secret used for authentication

ALGORITHM

JWT signing algorithm

HF_TOKEN

Hugging Face API token

MODEL_NAME

Hugging Face chat model

Keep all secrets in .env and never commit them to source control.

🎯 Learning Goals

This project is designed as a practical full-stack and AI learning project covering:

React application architecture

FastAPI REST API development

PostgreSQL and SQLAlchemy

JWT authentication

Secure API design

Async Python

LLM API integration

Prompt engineering

AI-assisted content organization

Dockerized full-stack deployment
