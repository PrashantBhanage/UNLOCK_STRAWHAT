# EduBridge

Not every student has access to good learning resources or someone who can help them understand difficult subjects. **EduBridge** is a platform that connects students who need academic help with tutors/volunteers who can teach them — built to work even in low or no internet conditions.

**Core Flow:** Student Request → Find Tutor → Match → Schedule → Learn

---

## Tech Stack

| Layer     | Technology                          |
|-----------|--------------------------------------|
| Backend   | Java, Spring Boot, Spring Security, JWT |
| Database  | MySQL                                |
| Frontend  | HTML, CSS, JavaScript (vanilla, no framework) |
| Build Tool| Maven                                |

---

## Project Structure

```
EduBridge/
├── Backend/        → Spring Boot REST API
├── Frontend/        → HTML/CSS/JS client
└── DB/               → MySQL schema/scripts
```

---

## Prerequisites

Before running the project, make sure you have installed:

- **Java 17+** (JDK)
- **Maven** (usually bundled with most Java IDEs, or install separately)
- **MySQL** (running locally, e.g. via MySQL Workbench or XAMPP)
- A code editor (VS Code recommended for frontend)
- **Postman** (optional, for testing backend APIs directly)

---

## Step 1: Set Up the Database

1. Open MySQL and create a new database:
   ```sql
   CREATE DATABASE edubridge_db;
   ```
2. No need to manually create tables — Spring Boot (JPA/Hibernate) will auto-generate them on first run based on the entity classes.

---

## Step 2: Run the Backend

1. Open a terminal and navigate to the Backend folder:
   ```bash
   cd EduBridge/Backend
   ```

2. Open `src/main/resources/application.properties` and update it with your MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/edubridge_db
   spring.datasource.username=root
   spring.datasource.password=YOUR_MYSQL_PASSWORD

   spring.jpa.hibernate.ddl-auto=update
   spring.jpa.show-sql=true

   server.port=8080
   ```

3. Build and run the backend:
   ```bash
   mvn spring-boot:run
   ```

4. If it starts successfully, you'll see something like:
   ```
   Tomcat started on port(s): 8080
   Started EduBridgeApplication in X.XXX seconds
   ```

5. Backend is now live at:
   ```
   http://localhost:8080
   ```

### Quick Backend Test (Postman)

**Signup:**
```
POST http://localhost:8080/api/auth/signup
Body (JSON):
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```
Response should return a JWT `token`.

**Login:**
```
POST http://localhost:8080/api/auth/login
Body (JSON):
{
  "email": "jane@example.com",
  "password": "password123"
}
```

Use the returned token as a header on all other requests:
```
Authorization: Bearer <token>
```

---

## Step 3: Run the Frontend

The frontend is plain HTML/CSS/JS — no build step needed.

**Option A — Simplest (double-click):**
1. Navigate to `EduBridge/Frontend/`
2. Open `index.html` directly in your browser

**Option B — Recommended (avoids CORS/localStorage issues):**
Run it through a local server instead of opening the file directly.

- If using **VS Code**: install the **Live Server** extension → right-click `index.html` → "Open with Live Server"
- Or using Python (if installed):
  ```bash
  cd EduBridge/Frontend
  python -m http.server 5500
  ```
  Then open: `http://localhost:5500`

> Make sure the **backend is already running** on port 8080 before opening the frontend, or login/signup calls will fail.

---

## Step 4: Using the App

1. **Sign up** as either a Student or Tutor
2. **Login** — you'll be redirected based on your role:
   - Student → Dashboard (pick a subject, then choose "Learn from Tutor" or "AI Assistant")
   - Tutor → Tutor Panel (view and accept pending requests)
3. **Student flow:**
   - Describe your problem → Request Help → wait for a tutor to accept → session gets scheduled
   - Or use the AI Assistant → browse subject slides → ask questions in the chat
4. **Tutor flow:**
   - View pending requests for your subjects → Accept → Schedule the session → Mark Complete once done

---

## Low/No Internet Feature (Our Twist)

EduBridge is designed to keep working even when connectivity is poor or completely absent:

| Condition            | What Happens                                                                 |
|-----------------------|-------------------------------------------------------------------------------|
| **No internet at all** | AI Assistant still works — slides and FAQs are cached locally (`localStorage`) after the first successful load, so students can keep learning and asking questions offline |
| **Weak internet**      | Tutor list loads via a lightweight endpoint (`/api/tutors/lightweight`) with minimal data only |
| **Connection drops mid-request** | Requests made while offline are saved locally and automatically synced to the backend once the connection returns |

An **Online/Offline indicator** is shown on screen at all times so this is easy to demonstrate live.

---

## API Endpoints Reference

### Auth
| Method | Endpoint             | Access | Description        |
|--------|-----------------------|--------|---------------------|
| POST   | `/api/auth/signup`    | Public | Register a new user |
| POST   | `/api/auth/login`     | Public | Login, returns JWT   |

### Requests
| Method | Endpoint                     | Access  | Description                     |
|--------|-------------------------------|---------|----------------------------------|
| POST   | `/api/requests`               | Student | Create a help request           |
| GET    | `/api/requests/pending`       | Tutor   | View pending requests (by subject) |
| PUT    | `/api/requests/{id}/accept`   | Tutor   | Accept a request, auto-creates a session |

### Sessions
| Method | Endpoint                        | Access | Description               |
|--------|-----------------------------------|--------|-----------------------------|
| PUT    | `/api/sessions/{id}/schedule`     | Tutor  | Set the session's scheduled time |
| PUT    | `/api/sessions/{id}/complete`     | Tutor  | Mark session (and request) as completed |

### AI Assistant
| Method | Endpoint                    | Access | Description                        |
|--------|-------------------------------|--------|--------------------------------------|
| GET    | `/api/ai/slides/{subject}`    | Auth   | Get ordered syllabus slides for a subject |
| GET    | `/api/ai/faq/{subject}`       | Auth   | Get FAQ list for a subject (cached offline) |
| POST   | `/api/ai/ask`                 | Auth   | Ask a question, get a matched answer |

### Tutors
| Method | Endpoint                  | Access | Description                          |
|--------|------------------------------|--------|----------------------------------------|
| GET    | `/api/tutors/lightweight`     | Auth   | Minimal tutor list (low-data mode)     |

*(All endpoints except signup/login require the `Authorization: Bearer <token>` header.)*

---

## Troubleshooting

| Problem                              | Fix                                                                 |
|----------------------------------------|----------------------------------------------------------------------|
| Backend won't start / DB connection error | Check MySQL is running and credentials in `application.properties` are correct |
| 401/403 errors on frontend            | Make sure you're logged in and the token is being sent; try logging in again |
| Frontend shows blank/CORS errors      | Run frontend via a local server (Live Server / `python -m http.server`) instead of opening the file directly |
| Port 8080 already in use              | Change `server.port` in `application.properties`, or stop the other process using that port |

---

## Team

Built for [Hackathon Name] — **EduBridge** team.

**Build. Innovate. Collaborate. Have Fun!**
