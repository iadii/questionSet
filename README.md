
A production-grade, full-stack interview preparation platform built for software engineers targeting top product-based companies. Track your DSA progress, practice system design, and simulate real interviews — all in one place.

---

## ✨ Features

### 📊 DSA Question Bank (120+ Questions)
- Curated questions organized by **topic** (Arrays, Strings, Trees, Graphs, DP, and 13 more)
- Difficulty levels: Easy, Medium, Hard
- **Progressive hints** — get help without revealing the full answer
- Company tags, frequency indicators, and LeetCode links
- Filter by difficulty or previously asked status

### 🏗️ System Design
- **Low-Level Design (LLD)** — Parking Lot, BookMyShow, ATM, LRU Cache, Rate Limiter, and more
- **High-Level Design (HLD)** — URL Shortener, WhatsApp, Netflix, Uber, Inventory Systems, Payment Systems
- Each topic includes requirements, approach hints, and interview questions

### 📝 Previously Asked Questions
- Dedicated section for questions reported in real interviews (2024–2025)
- Covers DSA, SQL, System Design, and CS Fundamentals
- Filterable by year, round, and difficulty

### 🧠 CS Fundamentals
- **DBMS** — Normalization, Indexing, ACID, Transactions
- **OS** — Deadlocks, Processes vs Threads, Scheduling, Paging
- **Networking** — TCP vs UDP, DNS, HTTPS, Load Balancers
- **OOP** — SOLID Principles, Design Patterns, Polymorphism

### 💻 Online Judge (Planned)
- LeetCode-style code editor powered by Monaco Editor
- Run code with custom input (C++, Java, Python)
- Submit against hidden test cases with runtime/memory stats
- Secure execution via Docker sandbox

### 📈 Progress Dashboard
- Readiness Score, Current Streak, Questions Solved
- Topic-wise progress tracking
- Weekly progress charts

### 🔁 Revision Scheduler
- Spaced repetition (1, 3, 7, 15, 30 days)
- Automatically surfaces questions due for revision

### 🎯 Interview Simulation
- Randomly selects questions across DSA, OS, DBMS, and OOP
- Simulates a real interview round and gives a score

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15, TypeScript, Tailwind CSS, TanStack Query, Zustand, Monaco Editor |
| **Backend** | Spring Boot 3, Java 21, Spring Security |
| **Database** | PostgreSQL, Flyway Migrations |
| **Auth** | JWT (JSON Web Tokens) |
| **Code Execution** | Docker Sandbox (planned) |

---

## 📁 Project Structure

```
InterviewPrep/
├── frontend/                # Next.js 15 Application
│   ├── src/
│   │   ├── app/             # App Router pages (dashboard, dsa, signup)
│   │   ├── components/      # Reusable UI components
│   │   ├── store/           # Zustand state management
│   │   └── hooks/           # TanStack Query hooks
│   └── package.json
│
├── backend/                 # Spring Boot 3 Application
│   ├── src/main/java/com/walmartprep/
│   │   ├── config/          # Security, CORS, DataSeeder
│   │   ├── controller/      # REST API endpoints
│   │   ├── dto/             # Request/Response objects
│   │   ├── entity/          # JPA Entities
│   │   ├── repository/      # Spring Data JPA interfaces
│   │   ├── service/         # Business logic
│   │   └── security/        # JWT filters
│   ├── src/main/resources/
│   │   ├── data/            # JSON question seeds (dsa, lld, hld, previous)
│   │   ├── db/migration/    # Flyway SQL migrations
│   │   └── application.yml
│   └── pom.xml
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+
- **Java** 21+
- **PostgreSQL** 15+
- **Maven** 3.9+

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/interviewprep.git
cd interviewprep
```

### 2. Set up the database
We recommend using Docker to run the PostgreSQL database.
```bash
# Start the database using Docker Compose
docker-compose up -d
```
Alternatively, if you have PostgreSQL installed locally:
```bash
createdb walmartprep
# Ensure credentials in backend/src/main/resources/application.yml match your local setup
```

### 3. Database Seeding (Question Sets)
All interview questions (DSA, HLD, LLD, Behavioral, CS Fundamentals) are stored in JSON format located at `backend/src/main/resources/data/`.
When you start the backend for the first time, the `DataSeeder.java` component automatically detects if the database is empty and seeds all questions from these JSON files into the PostgreSQL database.
*If you need to re-seed or add custom questions:*
1. Add/modify the JSON files in `backend/src/main/resources/data/`.
2. Drop/truncate the `questions` table in PostgreSQL.
3. Restart the Spring Boot backend, and it will re-seed the new data.

### 4. Start the backend
```bash
cd backend
mvn spring-boot:run
```
The API will start at `http://localhost:8080`. Flyway will auto-run migrations and the DataSeeder will populate the questions as mentioned above.

### 5. Start the frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and get JWT |
| `GET` | `/api/questions` | Get all questions (paginated) |
| `GET` | `/api/questions?category=DSA&topic=Arrays` | Filter by category and topic |
| `GET` | `/api/questions/{id}` | Get a single question |

---

## 🗄️ Database Schema

```
users            — id, name, email, password_hash, target_company, current_streak
questions        — id, title, description, difficulty, topic, category, hints, company_tags
submissions      — id, user_id, question_id, language, code, status, runtime_ms, memory_kb
user_progress    — id, user_id, question_id, status, next_revision_date
```

---

## 📸 Screenshots

> Screenshots will be added once the UI is fully wired up.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is for personal use and interview preparation purposes.

---

Built with ❤️ for cracking interviews at top product companies.
