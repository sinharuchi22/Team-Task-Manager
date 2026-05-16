# Team Task Manager (TTM) 🚀

A modern, full-stack web application designed to help teams collaborate, manage projects, and track tasks efficiently. Built with a sleek dark-mode aesthetic, TTM offers a seamless user experience for productivity and team coordination.

## 🌟 Features

- **User Authentication**: Secure signup and login using JWT (JSON Web Tokens) and bcrypt password hashing.
- **Project Management**: Create, view, and manage multiple projects within your team.
- **Task Tracking**: Assign tasks, set deadlines, and track progress (To-Do, In Progress, Done).
- **Team Collaboration**: Form teams, add members, and manage roles to streamline workflows.
- **Analytics Dashboard**: Get a quick overview of project progress and team productivity.
- **Modern UI/UX**: A visually stunning dark-mode interface featuring glassmorphism and smooth interactions.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js
- **Routing**: React Router
- **Styling**: Vanilla CSS (Dark Mode, Glassmorphism)
- **State Management**: React Context API

### Backend
- **Framework**: Python Flask
- **Database**: SQLite (via Flask-SQLAlchemy)
- **Authentication**: Flask-JWT-Extended & Flask-Bcrypt
- **CORS**: Flask-CORS

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/sinharuchi22/Team-Task-Manager.git
cd Team-Task-Manager
```

### 2. Backend Setup

Open a terminal and navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment and activate it:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

Install the required Python packages:
```bash
pip install -r requirements.txt
```

Run the Flask server:
```bash
python run.py
```
*The backend server will typically run on `http://127.0.0.1:5000`.*

### 3. Frontend Setup

Open a **new** terminal window and navigate to the frontend directory:

```bash
cd frontend
```

Install the Node.js dependencies:
```bash
npm install
```

Start the React development server:
```bash
npm run dev
```
*The frontend will typically run on `http://localhost:5173`.*

## 📸 Screenshots

*(Add your screenshots here! Example below)*
- `![Dashboard view](/path/to/image.png)`
- `![Kanban Board](/path/to/image.png)`

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is open-source and available under the MIT License.
