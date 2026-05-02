A full-stack personal knowledge management system built with React.js, FastAPI, and PostgreSQL.
This application helps users create, organize, search, and manage notes, and knowledge articles efficiently.

🚀 Features
📚 Create, edit, and delete knowledge articles
🔍 Full-text search functionality
🏷️ Tag-based categorization
📁 Organize notes into collections/categories
🕒 Auto timestamps for created/updated notes
🔐 Authentication & Authorization (JWT-based)
🌙 Responsive and modern UI
⚡ REST API with FastAPI
🐘 PostgreSQL database integration

🛠️ Tech Stack
Frontend
React.js
React Router
Axios
Context API / Redux (optional)
Tailwind CSS / CSS Modules
Backend
FastAPI
SQLAlchemy
Pydantic
JWT Authentication
Database
PostgreSQL

⚙️ Installation
1️⃣ Clone the Repository
git clone https://github.com/your-username/smart-knowledge-base.git
cd smart-knowledge-base

Frontend Setup (React)
cd frontend-app
npm install
npm run dev
Frontend runs on: http://localhost:5173

⚙️ Backend Setup (FastAPI)
Create Virtual Environment
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

Backend runs on : http://127.0.0.1:8000



