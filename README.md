# EduBridge

## What this is about

Not every student gets access to good learning resources, or has someone around who can actually sit with them and explain a difficult topic. That's especially true for students in remote areas or places with weak internet — they're often left out of the "extra help" that other students get easily.

EduBridge tries to fix that. It's a platform that connects students who need academic help with tutors or volunteers who are willing to teach them. The twist we focused on: it's built to keep working even when the internet is slow, unreliable, or completely gone — because that's the reality for a lot of the students this is meant to help.

The whole system follows one simple flow:

**Student Request → Find Tutor → Match → Schedule → Learn**

---

## What's actually in this project

We built this with a fairly standard but solid stack, nothing fancy, just things that work reliably:

- **Backend** — Java with Spring Boot, using Spring Security and JWT for login/auth
- **Database** — MySQL
- **Frontend** — plain HTML, CSS and JavaScript (no React or frameworks, kept it simple on purpose since we were short on time)
- **Build tool** — Maven for the backend

The project folder is split into three parts:

```
EduBridge/
├── Backend/     → the Spring Boot API, all the logic and database handling
├── Frontend/    → the website itself, what the user actually sees
└── DB/          → MySQL schema and any scripts related to the database
```

---

## Before you start

Make sure these are installed on your machine, otherwise nothing will run:

- Java 17 or newer (JDK)
- Maven (comes bundled with most IDEs, but you can install it separately too)
- MySQL or MariaDB running locally
- A code editor — VS Code works well, especially for the frontend
- Postman, if you want to test the backend directly without touching the frontend

---

## Setting up the database

Open your MySQL/MariaDB and just create the database — you don't need to create any tables yourself, Spring Boot handles that automatically the first time it runs, based on our entity classes.

```sql
CREATE DATABASE edubridge_db;
```

That's really it for this step.

---

## Running the backend

Head into the Backend folder:

```bash
cd EduBridge/Backend
```

Open `src/main/resources/application.properties` and put in your actual MySQL credentials — the placeholder values won't work, this trips people up a lot:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/edubridge_db
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8080
```

Then just run it:

```bash
mvn spring-boot:run
```

If everything's fine, you'll see something like this near the bottom of the logs:

```
Tomcat started on port(s): 8080
Started EduBridgeApplication in X.XXX seconds
```

That means your backend is live at `http://localhost:8080`, and Hibernate will have already created all the tables for you behind the scenes.

### Quick way to check it's working (Postman)

Try signing someone up:

```
POST http://localhost:8080/api/auth/signup

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

You should get back a JWT token in the response. Then try logging in with the same credentials:

```
POST http://localhost:8080/api/auth/login

{
  "email": "jane@example.com",
  "password": "password123"
}
```

Same thing — you get a token back. From here on, every other request (creating a request, viewing tutors, asking the AI, etc.) needs that token attached as a header:

```
Authorization: Bearer <token>
```

---

## Running the frontend

There's no build step here since it's plain HTML/CSS/JS — you can literally just open the file.

**The quick way:** go into the `Frontend/` folder and double-click `index.html` to open it in your browser.

**The better way** (fewer weird issues with CORS or localStorage not working): serve it through a small local server instead.

- In VS Code, install the **Live Server** extension, then right-click `index.html` and choose "Open with Live Server"
- Or, if you have Python installed, just run:
  ```bash
  cd EduBridge/Frontend
  python -m http.server 5500
  ```
  and open `http://localhost:5500` in your browser

One important thing — **the backend has to already be running** before you open the frontend, otherwise login and signup will fail with a "failed to fetch" type error, since there's nothing on the other end to respond.

---

## How the app actually works, step by step

1. **Sign up** as either a Student or a Tutor.
2. **Log in** — where you land depends on your role:
   - Students go to the Dashboard, where they pick a subject and then choose between "Learn from Tutor" or the "AI Assistant"
   - Tutors go straight to the Tutor Panel, where they can see and accept pending requests
3. **If you're a student going the Tutor route** — you describe your problem, hit "Request Help," and wait. Once a tutor accepts, a session gets created and scheduled.
4. **If you're a student going the AI route** — you get instant access to subject slides and a chat where you can ask questions, and the AI searches through saved answers to help you right away.
5. **If you're a tutor** — you see requests that match the subjects you teach, accept the ones you want to take, schedule a time, and once the session is done, mark it complete.

---

## The low/no internet part — why it matters and how it actually works

This was the core challenge we were given for this hackathon, so instead of treating it like a bonus feature stuck on top, we tried to build it into the actual flow of the app itself. The thinking behind it is simple: a lot of the students EduBridge is meant to help live in places where internet isn't something they can count on. It might work for five minutes, then disappear for an hour. So the app had to be designed around that reality, not around the assumption that everyone has a stable connection all the time.

Here's how we broke the problem down and dealt with each situation separately.

### When there's no internet at all

This is where the AI Assistant really earns its place in the app. The idea is: the first time a student opens a subject while they do have some connection, even just briefly, the app quietly pulls down the syllabus slides and the FAQ questions/answers for that subject and saves them in the browser's local storage. It's not a big download, this is just text, so it happens almost instantly.

After that first save, the AI Assistant doesn't actually need the internet to keep working. When a student later opens the app with zero connectivity, it doesn't try to hit the server at all for anything related to that subject's content — it just reads straight from what's already sitting in local storage. So a student can still browse through the slides, and when they type a question into the chat box, the app searches through the saved FAQ answers on their own device to find something that matches. No request ever leaves their phone or laptop for this to work.

The honest way to describe this is that it's not a live AI thinking through the question in real time — it's closer to a smart, pre-loaded search through content that was gathered when connectivity was last available. But from the student's side, it feels responsive and useful even with the internet completely switched off, which is really what matters here.

### When the internet is there, but weak or unreliable

This is a slightly different problem from having zero internet — here the connection exists, but it's slow, unstable, or expensive in terms of data usage. Loading a full tutor profile with descriptions, extra fields, and so on just wastes time and data on a weak connection. So instead, when the app needs to show a list of available tutors, it calls a separate, lightweight endpoint that only sends back the bare minimum: the tutor's id, their name, and the subject they teach. Nothing else. Less data means the response comes back faster and the page doesn't hang, even on a connection that's barely holding on.

### When the connection drops in the middle of something

This one was important to get right, because it's the most common real scenario — a student is halfway through describing their problem or submitting a help request, and the connection just drops. In a normal app, that request would simply fail and the student would have to start over once they're back online, which is frustrating and easy to give up on.

In EduBridge, if that happens, the request doesn't just disappear. It gets saved locally on the student's device first, before the app even tries to send it anywhere. Then, in the background, the app keeps an eye on the connection status. The moment it detects the internet is back, it automatically resends that saved request to the backend, without the student needing to do anything or even necessarily notice it happened. From their side, it just feels like it eventually went through, sometimes with a short delay.

### How you can actually see this working

There's a small Online/Offline indicator visible on screen at all times, mainly so this isn't just something we can talk about but can't show. During a demo, you can literally turn off your wifi, walk through the AI Assistant still working, submit a request while offline and show it save locally, then turn the wifi back on and watch it sync — that's the clearest way to prove the whole thing isn't just theoretical.

---

## API endpoints, if you need to reference them

**Auth**

| Method | Endpoint | Who can use it | What it does |
|--------|-----------|------------------|----------------|
| POST | `/api/auth/signup` | Anyone | Creates a new account |
| POST | `/api/auth/login` | Anyone | Logs in, returns a JWT token |

**Requests**

| Method | Endpoint | Who can use it | What it does |
|--------|-----------|------------------|----------------|
| POST | `/api/requests` | Student | Creates a help request |
| GET | `/api/requests/pending` | Tutor | Shows pending requests matching their subjects |
| PUT | `/api/requests/{id}/accept` | Tutor | Accepts a request, automatically creates a session |

**Sessions**

| Method | Endpoint | Who can use it | What it does |
|--------|-----------|------------------|----------------|
| PUT | `/api/sessions/{id}/schedule` | Tutor | Sets when the session will happen |
| PUT | `/api/sessions/{id}/complete` | Tutor | Marks the session (and the linked request) as done |

**AI Assistant**

| Method | Endpoint | Who can use it | What it does |
|--------|-----------|------------------|----------------|
| GET | `/api/ai/slides/{subject}` | Logged in | Returns the syllabus slides for that subject, in order |
| GET | `/api/ai/faq/{subject}` | Logged in | Returns saved FAQ entries for that subject (this is what gets cached for offline use) |
| POST | `/api/ai/ask` | Logged in | Takes a question, tries to match it to a saved answer |

**Tutors**

| Method | Endpoint | Who can use it | What it does |
|--------|-----------|------------------|----------------|
| GET | `/api/tutors/lightweight` | Logged in | Returns a minimal tutor list, used for the low-data mode |

Every endpoint except signup and login needs the `Authorization: Bearer <token>` header attached.

---

## If something breaks

| What's happening | What to try |
|---------------------|----------------|
| Backend won't start, or you're getting a database connection error | Make sure MySQL/MariaDB is actually running, and double check the username/password in `application.properties` — this is the most common issue |
| Getting 401 or 403 errors on the frontend | You're probably not logged in, or the token isn't being sent properly — try logging out and back in |
| Frontend loads blank, or you see CORS errors in the console | Don't open `index.html` by double-clicking — serve it through Live Server or a local Python server instead |
| "Port 8080 already in use" | Something else is already running on that port — either stop it, or change `server.port` in `application.properties` |

---

## Team

Built for [Hackathon Name] — the EduBridge team.

Build. Innovate. Collaborate. Have fun.
