# 📚 Newton Learn Hub — Assignment Portal Backend

A backend API for the Newton Learn Hub Assignment Portal built using **Node.js**, **Express**, and **PostgreSQL** with raw SQL queries via the `pg` package.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Database Driver:** `pg` (node-postgres) with connection pooling & parameterized raw SQL
- **Configuration:** `dotenv`

---

## 🗄️ Database Setup

### 1. Create Database
```sql
CREATE DATABASE assignment_portal;
```

### 2. Connect & Create Table
```sql
\c assignment_portal

CREATE TABLE IF NOT EXISTS assignments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200),
    deadline DATE,
    submitted BOOLEAN DEFAULT false
);
```

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/quickDhav/assignment-portal.git
cd assignment-portal
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password_here
DB_NAME=assignment_portal
```

### 4. Run the Server
```bash
node app.js
```
The server will run on `http://localhost:3000`.

---

## 🔌 API Endpoints & Documentation

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| **POST** | `/assignments` | Create a new assignment | `201 Created` |
| **GET** | `/assignments` | List all assignments (newest first) | `200 OK` |
| **GET** | `/assignments?submitted=true` | Filter submitted assignments | `200 OK` |
| **PATCH** | `/assignments/:id` | Mark an assignment as submitted | `200 OK` / `404 Not Found` |
| **DELETE** | `/assignments/:id` | Delete an assignment | `200 OK` / `404 Not Found` |

---

## 🧪 Example API Requests

### 1. Create an Assignment
```bash
curl -X POST http://localhost:3000/assignments \
  -H "Content-Type: application/json" \
  -d '{"title": "Backend Lab", "deadline": "2026-08-10"}'
```
**Response (`201 Created`):**
```json
{
  "id": 1,
  "title": "Backend Lab",
  "deadline": "2026-08-10",
  "submitted": false
}
```

### 2. Get All Assignments (Newest First)
```bash
curl http://localhost:3000/assignments
```

### 3. Mark Assignment as Submitted
```bash
curl -X PATCH http://localhost:3000/assignments/1
```
**Response (`200 OK`):**
```json
{
  "id": 1,
  "title": "Backend Lab",
  "deadline": "2026-08-10",
  "submitted": true
}
```

### 4. Filter Submitted Assignments
```bash
curl "http://localhost:3000/assignments?submitted=true"
```

### 5. Delete an Assignment
```bash
curl -X DELETE http://localhost:3000/assignments/1
```
**Response (`200 OK`):**
```json
{
  "message": "Assignment deleted successfully",
  "assignment": {
    "id": 1,
    "title": "Backend Lab",
    "deadline": "2026-08-10",
    "submitted": true
  }
}
```

---

## 🔒 Security & Architecture Highlights
- **Parameterized Queries:** All queries strictly use SQL parameterization (`$1`, `$2`) to prevent SQL Injection.
- **No ORM:** Implemented purely with raw PostgreSQL queries.
- **Default Database Handling:** Defaults `submitted` status to `false` at the schema level.
