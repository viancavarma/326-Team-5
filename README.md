# 326-Team-5
# Expense Tracker Application

## Overview

This repository contains the codebase for an Expense Tracker Application. It allows users to log expenses, track weekly and monthly spending, set savings goals, view financial tips, and manage notifications, among other features. The application is designed to support financial wellness by providing an intuitive and interactive user interface.

---

## Features

### 1. **Dashboard**
   - Displays a weekly bar graph for expense tracking by category.
   - Shows a monthly pie chart for spending distribution.

### 2. **Add Expenditure**
   - Users can add expenses with details such as amount, category, date, and label.
   - Real-time updates are reflected in the dashboard and logs.

### 3. **Logs**
   - View and filter expenses by date, category, label, and amount.
   - Supports bulk deletion of selected entries.

### 4. **Savings Goals**
   - Add, edit, and delete financial goals.
   - Visualize progress using progress bars.

### 5. **Tips**
   - Displays financial tips for better spending habits.
   - Users can add custom tips and refresh for weekly suggestions.

### 6. **Notifications**
   - View, mark as read, prioritize, archive, or delete notifications.

### 7. **Settings**
   - Update account information (username, email, and password).

### 8. **Planner and Notes**
   - Manage personal planners and wishlists.
   - Add, edit, delete items for better organization.

---

## Technologies Used

### **Frontend**
- **HTML5**, **CSS3**, **JavaScript**
- Chart.js for graphical visualizations.
- IndexedDB for local data storage.

### **Backend**
- **Node.js** with **Express.js**
- **SQLite** for database management.

### **Additional Tools**
- Fetch API for HTTP requests between the frontend and backend.
- LocalStorage for tips and settings persistence.

---

## Installation

### Prerequisites
- **Node.js** and **npm** installed.

### Steps
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   node server.js
   ```

4. Open `index.html` in your preferred browser to view the frontend.

---

## Usage

1. **Adding Expenses**:
   - Navigate to "Add Expenditure" and input details to log an expense.

2. **Viewing Data**:
   - Check "Dashboard" for weekly and monthly spending insights.
   - View detailed logs in the "Logs" section.

3. **Managing Goals**:
   - Add and monitor progress in "Savings Goals."

4. **Tips and Notifications**:
   - Use "Tips" for financial advice and "Notifications" to stay updated.

---

## Directory Structure

```
.
├── backend/               # Backend API and database setup
├── frontend/              # HTML, CSS, JavaScript files
├── assets/                # Images, icons, and static assets
├── index.html             # Entry point for the application
├── server.js              # Main backend server file
└── README.md              # Documentation
```

---

## API Endpoints

### **Expense Endpoints**
- `GET /expenses/by-date/:date` - Fetch expenses by a specific date.
- `GET /expenses/by-month/:month` - Fetch expenses for a specific month.
- `POST /expenses/add` - Add a new expense.

### **Tips Endpoints**
- `GET /tips/most-expensive` - Get the most expensive expense.

### **Notification Endpoints**
- `GET /notifications` - Fetch all notifications.
- `POST /notifications/add` - Add a new notification.

---

## Contributing

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit changes:
   ```bash
   git commit -m 'Add a meaningful message'
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a Pull Request.

---

## Acknowledgments

- The contributors for their hard work and dedication.
- Open-source tools and libraries that made development easier.

---
