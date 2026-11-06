# LWSS Gumma & Drabla Pumping Station Portal

> **Lift Water Supply Scheme (LWSS) Gumma — Second Stage Pumping, New Gumma Line**  
> Complete Technical Documentation, Interactive Himalayan GIS Elevation Profile, and Real-Time SCADA Operations Simulator.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-lwss--gumma--project.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://lwss-gumma-project.vercel.app/)
[![Status](https://img.shields.io/badge/Status-Live%20Simulation-success.svg?style=for-the-badge)](#)
[![Stack](https://img.shields.io/badge/Stack-Vanilla%20HTML5%20%7C%20CSS3%20%7C%20ES6%2B-blue.svg?style=for-the-badge)](#)

---

> 🚀 **Live Web Application:** [https://lwss-gumma-project.vercel.app/](https://lwss-gumma-project.vercel.app/)  
> Open the link above in any web browser to interact with the real-time SCADA telemetry simulator, 4-pump bay controls, dynamic reservoir balancing, and GIS topographic profile.

---

## 🌐 Live Deployment & How Users Find It

Users visiting this repository can access the live application through any of the following:

1. **Top Repository Badge & Header Link**: Click the **Live Demo (Vercel)** badge or direct link at the top of this `README.md`.
2. **GitHub Repository "About" Section (Recommended)**:  
   On the right sidebar of the GitHub repository page ([github.com/hideepaksharma5-create/Lwss-Gumma-project](https://github.com/hideepaksharma5-create/Lwss-Gumma-project)), repository owners can set the **Website URL** so it appears prominently for every visitor:
   - Click the ⚙️ **gear icon** next to **"About"** on the right sidebar.
   - In the **Website** field, enter: `https://lwss-gumma-project.vercel.app/`
   - Check the **"Use your GitHub Pages website"** or save your custom URL.
   - Click **Save changes**. The live link will now display right below the repository description!
3. **In-App Utility Bar & Footer**: Both the live website header bar and footer include verified links back to the production deployment.

---

## 🌊 Overview

The **LWSS Gumma** project is the primary bulk water supply lifeline for Shimla, Himachal Pradesh, India. First commissioned in **1921–22** during the British era and substantially expanded under modern multi-stage initiatives (including the **24.06 MLD** New Gumma scheme), the system lifts water across a dramatic vertical gradient of **over 1,600 meters** from the riverbed of the Sutlej / Nauti Khad (~640m MSL) to the Craignano Ridge summit reservoir (~2,280m MSL).

This portal provides complete engineering documentation, site imagery, and a **client-side dynamic SCADA Telemetry & Operations Simulator**.

---

## ⚡ Core Features

### 1. Real-Time SCADA Telemetry Dashboard (`#scada-dashboard`)
- **Station Operations Console**:
  - Live **Indian Standard Time (IST)** clock with synchronized simulation tick.
  - Pulsing status indicator (`ONLINE • LIVE SIMULATION`, `TRIP / ALARM`, `STANDBY`).
  - **Scenario Presets**: Nominal Operations, Peak Summer Demand, Single Pump Economy, Surge Transient Alert, and Monsoon Turbidity Spike.
  - Simulation Speed toggles (`1x`, `2x`, `5x`) and Emergency Sim Trip / Reset.

- **Dynamic KPI Telemetry Cards**:
  - **Bulk Transmission Flow Rate**: Live MLD and $m^3/hr$ with a rolling SVG sparkline waveform.
  - **Hydraulic Head & Delivery Pressure**: Real-time delivery pressure in Bar, dynamic head in meters, and safety threshold alerts.
  - **Station Electric Load**: Active power demand in kW/MW, Specific Energy Consumption ($kWh/m^3$), power factor, and grid frequency.
  - **Finished Water Quality Index**: Real-time turbidity in NTU, residual chlorine, pH, temperature, and dissolved oxygen.

### 2. Interactive 4-Pump House Control Bay
- Individual control bays for **Pump 01** (Duty), **Pump 02** (Duty), **Pump 03** (Standby), and **Pump 04** (LOTO Maintenance).
- Physical Start / Stop controls and **VFD Throttle Sliders (40 Hz – 55 Hz / 1,180 – 1,620 RPM)**.
- Reactive hydraulic simulation: throttling pump frequencies dynamically recomputes discharge flow, head, power demand, and winding temperatures.
- Rotating impeller SVG animations synced to motor running states.

### 3. Dynamic 3-Reservoir Balancing System
- Real-time animated water level balancing across the double-stage route:
  - **Gumma Intake Raw Sump** (0.90 ML / 4.2m)
  - **Drabla Intermediate Balancing Sump** (1.45 ML / 5.8m)
  - **Craignano Ridge Summit Reservoir** (3.60 ML / 6.5m)
- Dual-layer sinusoidal CSS wave animations showing dynamic liquid capacity.

### 4. Interactive Himalayan GIS Elevation Profile
- High-fidelity topographic SVG cross-section showing vertical elevations:
  - Sutlej / Nauti Khad Intake (640m MSL)
  - New Gumma WTP (704m MSL)
  - Drabla Pumping Station (1,274m MSL)
  - Craignano Summit Reservoir (2,280m MSL)
- Animated SVG water flow beads (`<animateMotion>`) traveling along the rising main.
- Clickable station waypoints opening the interactive **Station Waypoint Drawer** with technical specifications.

### 5. Water & Energy Cost Calculator
- User-adjustable sliders for **Daily Pumping Duration** and **Industrial Tariff (₹/kWh)**.
- Instant calculation of daily/monthly volume, energy consumption (MWh), electricity expenditure (in ₹ Crores & Lakhs), specific energy index, and carbon footprint ($tCO_2e$).

---

## 📁 Repository Structure

```
Lwss-Gumma-project/
├── index.html       # Full portal structure & SCADA markup
├── styles.css       # Design system, industrial SCADA styling, keyframe animations
├── script.js        # Reactive telemetry engine, sparklines, reservoir physics, GIS drawer
├── README.md        # Comprehensive project documentation & live deploy link
├── README.txt       # Technical audit notes & reference documentation
└── images/          # Supplied site photography & engineering flowcharts
```

---

## 🚀 How to Run Locally

Because this portal is built with native web technologies, **no build step, package manager, or server dependencies** are required.

### Option 1: Direct File
Simply open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Local HTTP Server (Python)
```bash
# In the repository root directory:
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

---

## 🌐 Deploy Options

### 1. Vercel (Current Production)
The production site is continuously deployed on Vercel at:  
👉 **[https://lwss-gumma-project.vercel.app/](https://lwss-gumma-project.vercel.app/)**

### 2. GitHub Pages (Alternative Static Host)
To also enable GitHub Pages:
1. Navigate to **Repository Settings** → **Pages**.
2. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
3. Select `main` branch and `/ (root)` folder, then click **Save**.

---

## 📜 Technical & Historical References

- **Commissioning**: 1921–22 (Old Gumma Steam & Electric Pumping Plant)
- **New Gumma Scheme**: 1981–82 / 24.06 MLD design capacity
- **Department**: Jal Shakti Vibhag (formerly IPH Department), Himachal Pradesh
- **Designation**: Lift Water Supply Scheme (LWSS) Gumma & Drabla Pumping Station
