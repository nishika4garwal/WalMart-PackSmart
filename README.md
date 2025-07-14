<p align="center">
  <img src="Frontend/src/assets/logo.png" alt="WalMart-PackSmart Logo" width="200"/>
</p>

<p align="center">
  <a href="https://wal-mart-pack-smart.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/Live-Demo-blue?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo"/>
  </a>
</p>

# WalMart-PackSmart

**Smart Packing. Sustainable Future.**

WalMart-PackSmart is a warehouse assistant tool built to help packers choose the most optimal box for a given set of products — minimizing waste, maximizing space efficiency, and supporting sustainable retail operations.

## 🌍 Why It Matters

In large-scale warehouses like Walmart’s, choosing the right box size and material is more than a logistical decision — it’s an opportunity to reduce waste and support eco-conscious goals. This tool aims to contribute to **retail with purpose** by making packaging decisions smarter and more sustainable.

---

## 🚀 Features

- 📦 **Box Recommendation Engine**  
  Input multiple products and receive the best-fit box and material suggestion based on size, dimensions, and eco-impact.

- 🔍 **Barcode Scanning**  
  Easily scan product barcodes to fetch or register product details.

- 📊 **Dashboard Analytics**  
  Track eco-efficiency, sustainability metrics, and material usage statistics.

- 🧾 **Inventory Management**  
  View, add, and manage scanned items with quantity tracking.

---

## 🛠 Tech Stack

- **Frontend:**  
  - React 19  
  - React Router DOM  
  - React Toastify  
  - Vite  
  - Lucide React  
  - @zxing/browser & @zxing/library for barcode scanning  
  - Axios for API requests  

- **Backend:**  
  - Node.js with Express  
  - MongoDB with Mongoose  
  - JWT for authentication  
  - bcryptjs for password hashing  
  - express-validator for request validation  
  - dotenv for environment configs  
  - `python-shell` to run Python scripts from Node (for box logic or AI-based analysis)

---

## 📂 Project Structure

```bash
WalMart-PackSmart/
├── Frontend/        
├── Backend/        
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm installed  
- MongoDB running (locally or via cloud like Atlas)

### Installation

#### Clone the repo

```bash
git clone https://github.com/ishita-tayal/WalMart-PackSmart.git
cd WalMart-PackSmart
```


#### Setup Backend

```bash
cd Backend
npm install
npm run dev
```

#### Setup Frontend

```bash
cd ../Frontend
npm install
npm run dev
```

> ✅ Ensure both frontend and backend `.env` files are configured properly.

---

## 📸 Screenshots

### 🔍 Login Page
![Login Page](Frontend/src/assets/screenshots/login.png)

### 🔍 Home Page
![Home Page](Frontend/src/assets/screenshots/home.png)

### 📦 Box Recommendation
![Box Recommendation](Frontend/src/assets/screenshots/box.png)

### 📊 Sustainability Score
![Score](Frontend/src/assets/screenshots/score.png)


---

## 👩‍💻 Built By

- **Ishita Tayal**  
- **Nishika Agarwal**  
- **Raghvi Gupta**

We built this with purpose and passion — hoping to contribute a small piece to the larger goal of sustainable commerce.
