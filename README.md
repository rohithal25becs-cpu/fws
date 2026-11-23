# Food Waste Reduction and Expiry Management System (FoodSaver)

A modern, responsive, frontend single-page application built for college project demonstration using **React 18, HTML5, CSS3, Tailwind CSS, Chart.js, and Lucide Icons**.

---

## 🌟 Key Features

1. **Modern Green & White SaaS UI**: Designed with clean typography, emerald/mint accents, card glassmorphism, and responsive layout for mobile, tablet, and desktop.
2. **Landing Page**: Complete hero section, project problem statement, college motivation, core feature grid, and live system alert preview.
3. **Overview Dashboard**: High-level KPI summary cards:
   - Total Food Items
   - Expiring Soon (≤3 days warning)
   - Expired Items
   - Food Donated
   - Priority expiry alerts & quick donation action
4. **Inventory Management**: Searchable and filterable table displaying food name, quantity, category, added date, expiry date, storage location, status badges, and deletion/donation actions.
5. **Add Food Form**: Real-time validated input form with category selection, date picker, unit specifications, and storage location choices.
6. **Color-Coded Expiry Tracker**: Traffic-light alert system:
   - 🔴 **Red**: Expired (past due date)
   - 🟡 **Amber**: Expiring Soon (3 days or less left)
   - 🟢 **Green**: Fresh (> 3 days left)
7. **Food Donation Network**: Connects edible surplus food with campus food banks and NGOs with full donation logs.
8. **Reports & Analytics**: Visual charts powered by Chart.js (Inventory by Category doughnut chart, Waste Prevention bar chart, and CO2 offset metrics).
9. **Authentication Portal**: Modal for Login and Registration with sample prefilled credentials.
10. **Data Persistence**: Uses browser `localStorage` to retain items added or donated across reloads without requiring an external database.

---

## 📂 Project Structure & File Purpose

| File | Purpose |
| :--- | :--- |
| [`index.html`](file:///c:/Users/Lenovo/OneDrive/Desktop/F-w-m/index.html) | Main HTML container file. Imports Tailwind CSS, Google Fonts, Lucide icons, Chart.js, React 18, and Babel Standalone. |
| [`app.js`](file:///c:/Users/Lenovo/OneDrive/Desktop/F-w-m/app.js) | Core React application containing all state management, realistic sample food data, view routers, and components (`LandingPage`, `DashboardPage`, `InventoryPage`, `AddFoodPage`, `ExpiryTrackingPage`, `DonationsPage`, `ReportsPage`, `AuthModal`). |
| [`styles.css`](file:///c:/Users/Lenovo/OneDrive/Desktop/F-w-m/styles.css) | Custom styling for smooth fade-in animations, custom scrollbars, and card glassmorphism. |
| [`README.md`](file:///c:/Users/Lenovo/OneDrive/Desktop/F-w-m/README.md) | Documentation explaining project goals, file architecture, and running instructions. |

---

## 🚀 How to Run the Website

You have two easy ways to run this project:

### Method 1: Using Python HTTP Server (Recommended)
1. Open PowerShell or Command Prompt in this folder (`c:\Users\Lenovo\OneDrive\Desktop\F-w-m`).
2. Run:
   ```powershell
   python -m http.server 3000
   ```
3. Open your browser and navigate to:
   [http://localhost:3000](http://localhost:3000)

### Method 2: Direct Browser Launch
Simply double-click `index.html` or right-click `index.html` -> **Open with Google Chrome / Microsoft Edge**.
