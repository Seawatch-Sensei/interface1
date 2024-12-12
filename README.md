# Food Project

A full-stack web application built with Flask for the backend and Next.js for the frontend.

## Directory Structure

```
/
├── server/   # Backend files (Flask)
└── client/   # Frontend files (Next.js)
```

## Prerequisites

Ensure you have the following installed:

- Python 3.8+
- Node.js (LTS version recommended)
- npm (comes with Node.js)

## Setup

### Backend (Flask)

1. Navigate to the `server` directory:

   ```bash
   cd server
   ```
2. Create and activate a virtual environment:

   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install the required Python packages:

   ```bash
   pip install -r requirements.txt
   ```
4. Run the Flask application:

   ```bash
   python app.py
   ```

   The backend server should now be running at `http://127.0.0.1:5000`.

### Frontend (Next.js)

1. Navigate to the `client` directory:

   ```bash
   cd client
   ```
2. Install the required Node.js packages:

   ```bash
   npm install
   ```
3. Start the development server:

   ```bash
   npm run dev
   ```
   The frontend application should now be running at `http://localhost:3000`.
