# 🔷 Visual Flow Builder with Simulation & Cycle Detection

A powerful **React Flow-based visual flow editor** built with **React**, **Redux Toolkit**, and **Tailwind CSS**, allowing users to:

- Drag and drop configurable nodes onto a canvas
- Create and save connection flows
- Detect and highlight invalid flow cycles
- Simulate node execution logic
- View logs in a real-time console
- Visually highlight problematic nodes for better UX

---

## 🚀 Features

- ⚙️ Drag-and-drop node creation
- 🔌 Edge connections between nodes
- 💾 Persistent state using `localStorage` + Redux
- 🔁 Cycle detection with visual highlighting
- 🧪 Flow simulation with per-node log output
- 💬 Live error/success console
- 🧩 Node configuration panel for dynamic property editing

---

## 📦 Tech Stack

- **React 18**
- **React Flow**
- **Redux Toolkit**
- **Tailwind CSS**
- **LocalStorage** (for state persistence)

---

## 📂 Project Structure

.
├── README.md
├── package.json
├── public/
│ ├── favicon.ico
│ ├── index.html
│ ├── logo192.png
│ ├── logo512.png
│ ├── manifest.json
│ └── robots.txt
├── src/
│ ├── App.js
│ ├── App.css
│ ├── index.js
│ ├── index.css
│ ├── logo.svg
│ ├── App.test.js
│ ├── setupTests.js
│ ├── reportWebVitals.js
│ ├── components/
│ │ ├── Canvas.jsx
│ │ ├── NodeConfigPanel.jsx
│ │ ├── NodeEditor.jsx
│ │ ├── OutputConsole.jsx
│ │ └── Sidebar.jsx
│ ├── redux/
│ │ ├── builderSlice.js
│ │ └── store.js
│ └── data/
│ └── blocks.js
└── tailwind.config.js


---

## 🛠️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/mamta-vyas/visual-agent-builder.git
cd visual-agent-builder

2. Install dependencies
npm install


3. Start the development server
npm start

🎯 Key Functionalities
🧩 Canvas (Canvas.jsx)
Displays a React Flow canvas with full drag/drop capabilities

Handles onConnect, onDrop, onNodesChange, and onEdgesChange events

Automatically syncs node and edge state to both Redux and localStorage

⚠️ Cycle Detection
Implements a DFS-based algorithm to check for cycles

Prevents simulation if cycles are present

Visually highlights nodes involved in a cycle using a red border and background

🧪 Simulation Mode
Simulates each node's logic based on its configuration

Outputs detailed logs per node during simulation

Validates node configuration before execution

📝 Output Console (OutputConsole.jsx)
Real-time console logs of simulation results

Supports log clearing for repeated runs

⚙️ Node Configuration Panel (NodeConfigPanel.jsx)
Allows editing of selected node properties

Updates node data live on the canvas

✅ UX Enhancements
Cycle Visual Feedback:

Nodes in a cycle are rendered with red outlines and backgrounds

Simulation is blocked until cycles are resolved

📌 Commit History Summary
Initial Setup:

React + Vite + Tailwind CSS + Redux Toolkit + React Flow configuration

Core Canvas Logic:

Node drag/drop, edge connection logic

Redux integration with localStorage persistence

Cycle Detection:

DFS-based algorithm implementation

Prevent simulation if cycles detected

Visual Feedback:

Highlighting cycle nodes with styling

Log simulation results to output console

Simulation Engine:

Config-based simulation with validation

Per-node log messages

Output Console & UX Polish:

Scrollable console

Clear logs button

Visual state feedback

🧪 How to Test
Drag nodes from the sidebar into the canvas

Connect the nodes to form a flow

(Optional) Create a cycle by connecting a node back to a previous node

Click "Simulate Flow"

✅ If there's a cycle, involved nodes will be highlighted and an error will show in the console.

🙌 Contributing
Pull requests are welcome!
For major feature suggestions or changes, please open an issue first to discuss your ideas.

✨ Credits
Built by Mamta Vyas using:

React Flow

Redux Toolkit

Tailwind CSS

❤️ and curiosity for visual systems

