# NexusArena — University Esports & Tech Events Platform
**Subject:** Web Development  
**Project Title:** Design and Development of an Interactive Website  
**Selected Theme:** Theme 7 — Event Management and Ticket Reservation Website  

---

## I. Project Overview

**NexusArena** is a modern, responsive event management and ticket reservation platform engineered specifically for university student organizations, collegiate esports federations, and departmental technology societies.

The website provides a centralized hub where university students can discover upcoming esports tournaments (e.g., Valorant Collegiate Championship, League of Legends Derby), register squads for 36-hour hackathons, reserve seats for cybersecurity masterclasses, and compute simulated ticket costs with real-time feedback.

All data management, user accounts, and financial transactions are simulated locally using **strictly HTML5, external CSS stylesheets, and vanilla JavaScript**, adhering 100% to course guidelines and eliminating backend server or database dependencies.

---

## II. Color Palette & Visual Specifications

Designed with a high-contrast dark theme optimized for esports stages and technology showcases:
- **Main Body Background:** `#111111`
- **Interactive Card Containers:** `#121212` (hover states at `#171717`)
- **Hairline Borders:** `#242424` / `#333333`
- **Accent Palette:**
  - Tech Cobalt: `#3b82f6`
  - Esports Cyan: `#06b6d4`
  - Success / Active: `#10b981`
  - Highlighting / Prizes: `#f59e0b`
  - Validation Alerts: `#ef4444`
- **Typography:** Display face `Outfit`, Body prose `Plus Jakarta Sans`, and Monospace numerals `JetBrains Mono`.

---

## III. Page Architecture (Eight Interconnected Pages)

The website consists of eight interconnected HTML pages:

### Main Content Pages:
1. **Home Page (`index.html`)**: Features a hero banner, key statistics, platform overview, featured tournament cards, organizational bento highlights, and navigation.
2. **About Page (`about.html`)**: Details the background, history, mission, vision, four constituent student guilds (Esports, ACM, Robotics, Game Dev), and the 2026–2027 Executive Committee.
3. **Events / Products Page (`events.html`)**: Displays upcoming campus events with category filtering (`All`, `Esports`, `Tech`, `Seminars`, `Social`), live keyword search, sorting controls, and an infinite scrolling feed.
4. **Details / Information Page (`details.html`)**: Extended match overview, schedule timeline, tournament eligibility rules, and the interactive ticket reservation calculation widget with simulated pass generation.
5. **Contact / Registration Page (`contact.html`)**: Interactive dual-mode form for general campus inquiries and direct event registration with live fee computation and input validation.

### User Account Interfaces:
6. **Login Page (`login.html`)**: Validates credentials against predefined sample accounts and newly registered local users, featuring error and success alerts, show/hide password toggle, and one-click demo account auto-fill buttons.
7. **Sign Up / Registration Page (`signup.html`)**: Captures full name, username, university email, password, and confirm password. Validates all inputs and performs real-time matching checks between passwords before permitting submission.
8. **Forgot Password Page (`forgot-password.html`)**: Validates registered university email addresses and displays a simulated confirmation message with masked email feedback.

---

## IV. Required JavaScript Functionalities Demonstrated

The platform implements five distinct, robust JavaScript interactive features:

1. **Form Validation (`HTML5` & `JavaScript`)**:
   - Enforces format checks on name, alphanumeric username, and university email regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
   - Dynamic character counter for textareas (`0 / 500 characters`) with warning colors when below minimum threshold.
2. **Password & Confirm Password Matching (`signup.html`)**:
   - Compares the `password` and `confirmPassword` inputs on every keystroke (`input` event).
   - Dynamically updates DOM indicator: *"Passwords match perfectly"* (emerald) or *"Passwords do not match"* (rose). Form submission is strictly prevented unless both fields match.
3. **Credential Simulation & Session State (`login.html`, `js/data.js`)**:
   - Verifies credentials against predefined student accounts stored in JavaScript objects and persists new accounts in `localStorage`.
   - Simulates active user session, reflecting student names dynamically in the top navigation bar across all pages.
4. **Interactive Cost Computation (`details.html`, `contact.html`)**:
   - Dynamically computes ticket totals in real time based on:
     $$\text{Total} = (\text{Base Fee} \times \text{Tier Multiplier} \times \text{Squad Count}) - \text{Student Discount (15\%)} + \text{Add-ons}$$
   - Allows incrementing/decrementing squad sizes, toggling jersey and certificate add-ons, and generating an interactive pass modal with booking reference codes.
5. **Dynamic Filtering & Infinite Scrolling (`events.html`)**:
   - Segmented buttons instantly filter catalog items by category without page reload.
   - Utilizes `IntersectionObserver` to trigger continuous infinite feed loading as the user scrolls down, accompanied by an animated loading spinner.

---

## V. Predefined Sample Accounts (For Instructor / Evaluator Testing)

Use any of the following pre-configured credentials on the **Login Page** or click the quick-fill buttons:

| Full Name | Role / Title | Email Address | Username | Password |
| :--- | :--- | :--- | :--- | :--- |
| **Alex Rivera** | Esports Varsity Captain | `alex@campus.edu` | `alex_esports` | `Password123!` |
| **Sarah Chen** | ACM Chapter President | `sarah@univ.edu` | `sarah_tech` | `TechLead2026` |
| **Demo Guest** | Student Guild Member | `guest@campus.edu` | `guest_user` | `GuestPassword` |

*Note: You can also create a new account on `signup.html` and immediately log in with your custom credentials.*

---

## VI. Folder Structure

```
├── index.html               # Home Page
├── about.html               # About Organization Page
├── events.html              # Events Catalog & Feed Page
├── details.html             # Event Details & Ticket Reservation Page
├── contact.html             # Contact & Registration Page
├── login.html               # User Sign In Page
├── signup.html              # User Sign Up Page
├── forgot-password.html     # Password Recovery Page
├── README.md                # Project Documentation & Guidelines
├── css/
│   └── style.css            # External CSS Stylesheet (Dark Theme, #111111 / #121212)
├── js/
│   ├── data.js              # Sample Accounts & Campus Events Catalog
│   ├── main.js              # Shared Navigation, Mobile Drawer & Session State
│   ├── events.js            # Dynamic Filtering, Search & Infinite Scrolling
│   ├── details.js           # Dynamic Ticket Cost Calculation & Modal Pass
│   ├── contact.js           # Interactive Form Validation & Fee Breakdown
│   └── auth.js              # Credential Simulation, Sign Up & Password Match
└── public/
    └── assets/
        └── images/          # Tournament, Hackathon & Seminar Visual Assets
```

---

## VII. How to Run the Website

### Option 1: Direct File Access (No Server Required)
Simply double-click `index.html` in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari). All navigation, local simulations, and styles will operate seamlessly.

### Option 2: Local Development Server (Vite / Node.js)
```bash
# 1. Install dependencies (if running via package.json)
npm install

# 2. Start the local server
npm run dev

# 3. Open in browser: http://localhost:3000
```

### Option 3: Netlify Deployment (Recommended Settings)
When connecting your GitHub repository (`WEBDEVFINALS`) to Netlify:

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Base directory:** *(leave blank / repository root)*

#### Why the Login Page issue occurred on Netlify & How It Was Resolved:
1. **Missing JS in `dist/`:** Netlify runs `npm run build`, which triggers Vite. In pure HTML projects, non-module vanilla `<script src="js/...">` tags are not bundled by default, causing Vite to omit the `js/` folder from `dist/` on Netlify. As a result, `js/auth.js` and `js/data.js` returned 404, preventing the login script from executing.
2. **The Fix:**
   - Updated `package.json` `"build"` script to automatically copy `js/` and `css/` into `dist/` whenever `npm run build` runs.
   - Added a `netlify.toml` file with proper build command and static headers (`Content-Type: application/javascript`).
   - Synced `public/js/` and `public/css/` to ensure static asset persistence.
   - Added `safeNavigate()` and `isLocalStorageAvailable()` fallbacks to `auth.js` and `data.js` so login and session state remain functional even in private browsing or iframe environments.
