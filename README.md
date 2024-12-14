## 📘 EventSphere Management System

**EventSphere Management** is a scalable event management platform designed for expos and trade shows. Built with the **MEVN stack**, it ensures secure authentication, real-time updates, and powerful analytics.

---

### Features

- **Core Functionalities**:
  - Manage dashboards, schedules, and event details.
  - Assign resources, book venues, and allocate budgets.
  - Receive live analytics and feedback from users.

- **Additional Highlights**:
  - 📊 Real-time updates.
  - 🌐 Scalable design with modular components.

---

### 📂 Folder Structure

```
EventSphere-Management/
│
├── backend/   # Backend server code
│   ├── config/  # Configuration files
│   ├── models/  # MongoDB schemas
│   └── routes/  # API endpoints
│
├── frontend/  # React frontend code
│   ├── event_sphere/  # main directory
│       ├── src/     # React components and pages
│       ├── public/  # Static assets
│       └── package.json
│
└── README.md  # Project documentation
```

---

### 🔧 Installation and Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Huzaifa1509/EventSphere-Management-System.git
   ```

2. **Navigate to the project directory**:
   ```bash
   cd EventSphere-Management
   ```

3. **Install dependencies for both backend and frontend**:
   ```bash
   # Backend
   cd Backend
   npm install
   
   # Frontend
   cd Frontend/event_sphere
   npm install
   ```

4. **Configure environment variables**:  
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=your-mongodb-connection-string
   JWT_SECRET=your-secret
   SMTP_USER='your@smtpaacount.com'
   SMTP_PASS='your_smtp_pass'
   SMTP_HOSTNAME='your.smtp.hostname'
   SMTP_PORT=your_smtp_host
   ```

5. **Start the backend server**:
   ```bash
   cd backend
   npm start
   ```

6. **Start the frontend server**:
   ```bash
   cd frontend
   npm run dev
   ```

7. **Open your browser**:
   ```
   copy the url from the terminal where you've started the frontend server
   ```

---

### 📜 Environment Variables

| Variable        | Description                       |
|-----------------|-----------------------------------|
| `PORT`          | Backend server port               |
| `MONGO_URI`     | MongoDB connection string         |
| `JWT_SECRET`    | Secret for JSON Web Tokens (JWTs) |
| `SMTP_USER`     | SMTP account username             |
| `SMTP_PASS`     | SMTP account password             |
| `SMTP_HOSTNAME` | SMTP hostname                     |
| `SMTP_PORT`     | SMTP port                         |

---

### 🎉 Happy Coding!

---

The above structure improves readability with clear headings, icons, and well-organized content. Let me know if you'd like specific changes or additional customizations!
