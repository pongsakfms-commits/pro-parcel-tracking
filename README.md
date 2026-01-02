# 🚚 Pro Parcel Tracking System (ProTrack)

![Project Banner](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Firebase%20%7C%20Google%20Sheets-blue?style=for-the-badge)

**ProTrack** is a professional-grade, real-time logistics tracking application designed to bridge the gap between traditional operations (Google Sheets) and modern customer experiences (Web App).

It features a seamless ecosystem where drivers use a **No-Code App (AppSheet)** to update statuses, and customers trace their packages via a **Premium React Web Interface** powered by Firebase.

---

## ✨ Key Features

### For Customers (Web App)
- **Real-Time Tracking**: Updates instantly as data changes in the backend.
- **Visual Timeline**: Dynamic progress bar from "Order Received" to "Delivered".
- **Live Map Integration**: Visualizes absolute location coordinates using Leaflet/OpenStreetMap.
- **Proof of Delivery**: Securely displays delivery confirmation references (Photos).
- **Premium UI**: Glassmorphism design system with responsive mobile-first layout.

### For Operations (Admin & Drivers)
- **Google Sheets Backend**: Manage thousands of orders in a familiar spreadsheet interface.
- **Driver Mobile App**: Custom AppSheet application for scanning orders, capturing GPS, and uploading photos.
- **Automated Sync**: Google Apps Script "Bot" that pushes data to Firestore in sub-seconds.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | Fast, modern web application framework. |
| **Database** | Cloud Firestore | Real-time NoSQL database for sub-second updates. |
| **Hosting** | Firebase Hosting | Secure, global CDN delivery. |
| **Operations** | Google Sheets | The "CMS" for order management. |
| **Driver App** | AppSheet | No-code mobile solution for field operations. |
| **Middleware** | Apps Script | Bridging Google ecosystem with Firebase. |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Google Cloud Project (Firebase)
- Google Workspace Account (for Sheets/AppSheet)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pongsakfms-commits/pro-parcel-tracking.git
   cd pro-parcel-tracking
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Create `src/firebase.js` with your Firebase Config keys.

4. **Run Locally**
   ```bash
   npm run dev
   ```

---

## 📦 Deployment

This project is optimized for **Firebase Hosting**.

```bash
# Build for production
npm run build

# Deploy to live URL
firebase deploy
```

---

## 👥 Authors & Credits

*   **Pongsak** - *Lead Developer & Architect*

---

> "Delivering excellence, one parcel at a time." 🚛💨
