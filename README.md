# 🚀 Blogora – AI Powered Blogging Platform

Blogora is a full-stack blogging platform that allows users to create, manage, and interact with blogs in a secure and intelligent environment. The platform includes AI-powered NLP tag generation, sentiment analysis, toxic content detection, analytics, role-based authentication, comments, likes, and admin dashboard functionalities.

---

## 📌 Features

### 🔐 Authentication & Authorization
- User Registration & Login
- JWT-based Authentication
- Role-Based Access Control (User/Admin)
- Protected Routes using Middleware

### 📝 Blog Management
- Create Blog Posts
- Edit Existing Posts
- Delete Posts
- View All Posts
- Categorization & Tags

### 🤖 AI / NLP Features
- **Automatic Tag Generation**
  - Uses NLP techniques
  - Tokenization
  - Stopword Removal
  - Frequency-based keyword extraction

- **Sentiment Analysis**
  - Implemented using **TextBlob**
  - Detects:
    - Positive 😊
    - Neutral 😐
    - Negative 😞

### 🚫 Toxic Content Detection
- Detects harmful/toxic content before publishing
- Blocks offensive blog posts
- Integrated using Machine Learning Classification Model

### ❤️ User Interaction
- Like Posts
- Add Comments
- View Comments in Real Time

### 📊 Analytics Dashboard
- Total Posts Count
- Total Users Count
- Total Comments Count
- Real-time analytics updates

### 👑 Admin Dashboard
- Role-based Admin Access
- View All Users
- View All Posts
- Manage Content

---

## 🛠️ Tech Stack

### Frontend
- HTML
- CSS
- Bootstrap
- JavaScript
- Quill.js (Rich Text Editor)

### Backend
- Node.js
- Express.js

### Database
- MySQL (XAMPP)

### Authentication
- JWT (JSON Web Token)

### NLP & Machine Learning
- Python
- NLTK
- TextBlob
- Toxicity Classification Model

---

## 📂 Project Structure

```bash
blogora/
│── backend/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── posts.js
│   │   ├── comments.js
│   │   ├── analytics.js
│   │   └── admin.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── admin.js
│   │
│   ├── tag_generator.py
│   ├── toxicity_model.py
│   ├── server.js
│   └── db.js
│
│── frontend/
│   ├── index.html
│   ├── dashboard.html
│   ├── admin.html
│   ├── app.js
│   └── style.css
