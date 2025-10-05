# 💰 React Native Coding Challenge: Offline Expense Tracker (Senior Level)
> kevin@bildit.co  
> 2025-03-01

## ⏳ Time Limit  
- **Maximum Time:** 8 hours  
- **You must submit your work within this time limit.** Manage your time effectively.

## 🎯 Objective  
Build an **offline-first expense tracker** where users can **add, categorize, and delete expenses**, with all data stored locally.  

---

## 📌 Tasks (Jira-Style)  

### **TASK 1: Set Up the Project**  
- Create a **React Native + TypeScript** project (Bare RN, NOT Expo).  
- **Initialize a Git repository locally (`git init`).**  
- **Make meaningful commits as you progress** (DO NOT submit everything in one commit).  
- Ensure proper **file structure** and **clean code organization**.  

---

### **TASK 2: Implement Local Storage (Using a State Management Library)**  
- **DO NOT** use `useState` directly for expense management.  
- Use **Redux Toolkit (Preferred) or Zustand** for global state.  
- Persist expenses using **AsyncStorage**.  
- Expenses must **not disappear on app restart**.  

---

### **TASK 3: Implement Expense List with Memoization**  
- Display a list of expenses (category, amount, date).  
- **Use `React.memo` and `useMemo` to optimize rendering.**  
- List should be **scrollable** and display all stored expenses.  
- Expenses should be **sortable by date and category.**  

---

### **TASK 4: Add, Edit & Delete Expenses**  
- Implement a form for users to **add new expenses**.  
- Users should be able to **edit existing expenses**.  
- Users should be able to **delete expenses**.  
- **Use React Query (`useQuery`, `useMutation`) for async data handling** (even though it's local).  

---

### **🔥 Bonus Tasks (If You Want to Impress)**  
- 📊 **Basic Charts/Analytics** (e.g., category-wise spending breakdown using `react-native-svg`).  
- 🛑 **Spending Limit Alerts** (warn if spending exceeds a threshold).  
- 🌙 **Dark Mode Toggle**.  
- 👆 **Swipe Gestures for Deleting Expenses** (React Native Gesture Handler).  
- **Offline Data Syncing** (Pretend a backend exists—sync to JSON file, reconcile conflicts).  

---

## 📦 Submission Guidelines  
- **Submit a ZIP file** containing your project **including the `.git` folder**.  
- Your Git history should reflect **real development habits**.  
- Include a **README.md** with:  
  - How to run the project.  
  - Any decisions/assumptions made.  
  - Any extra features you added.  
- **Screenshots or a short demo video (optional, but recommended).**  

---

## ❌ Disqualifications  
- No submission after the deadline.  
- Failure to follow these instructions.  
- Code that does not work or run properly.  
- **Single-commit Git history (no meaningful commits).**  
- **Not using Redux/Zustand or React Query as required.**  

---

## 🏁 Evaluation Criteria  
✅ **Advanced State Management** (Redux/Zustand, AsyncStorage).  
✅ **Performance Optimization** (React.memo, useMemo).  
✅ **Asynchronous Handling** (`useQuery`, `useMutation`).  
✅ **Clean Architecture & Maintainability**.  
✅ **Git usage & commit history** (clean, structured commits).  
✅ **UI/UX and usability**.  
✅ **Attention to detail & ability to follow instructions**.  
✅ **Extra effort beyond the basic requirements.**  

---

🔹 **Good luck! Show us what you got.** 🚀  
