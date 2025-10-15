const express = require("express")
const cors = require("cors")
const fetch = require("node-fetch")

const app = express()
app.use(cors())
app.use(express.json())

// Service URLs
const SERVICES = {
  auth: "http://auth-service:3001",
  employee: "http://employee-service:3002",
  payroll: "http://payroll-service:3003",
  notification: "http://notification-service:3004",
}

// Simple HTML dashboard
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Microservices Demo - Vulnerable System</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 50px auto; padding: 20px; }
        h1 { color: #e74c3c; }
        .warning { background: #fff3cd; border: 2px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .service { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 5px; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; margin: 5px; cursor: pointer; border-radius: 3px; }
        button:hover { background: #0056b3; }
        pre { background: #2d2d2d; color: #f8f8f2; padding: 15px; border-radius: 5px; overflow-x: auto; }
        .endpoint { font-family: monospace; background: #e9ecef; padding: 5px 10px; border-radius: 3px; }
      </style>
    </head>
    <body>
      <h1>⚠️ Vulnerable Microservices Demo</h1>
      <div class="warning">
        <strong>⚠️ ATTENTION:</strong> This system is intentionally vulnerable for educational purposes.
        <br>It demonstrates common security flaws: no authentication, no input validation, exposed PII, and sensitive data in logs.
      </div>

      <div class="service">
        <h2>🔓 Auth Service (Port 3001)</h2>
        <p>Endpoints:</p>
        <ul>
          <li><span class="endpoint">GET /users</span> - List all users (with passwords!)</li>
          <li><span class="endpoint">POST /login</span> - Login (no token, returns password)</li>
          <li><span class="endpoint">POST /users</span> - Create user (no validation)</li>
        </ul>
        <button onclick="testAuth()">Test Auth Service</button>
      </div>

      <div class="service">
        <h2>👥 Employee Service (Port 3002)</h2>
        <p>Endpoints:</p>
        <ul>
          <li><span class="endpoint">GET /employees</span> - List all employees (with SSN!)</li>
          <li><span class="endpoint">GET /employees/:id</span> - Get employee details</li>
          <li><span class="endpoint">POST /employees</span> - Create employee</li>
        </ul>
        <button onclick="testEmployee()">Test Employee Service</button>
      </div>

      <div class="service">
        <h2>💰 Payroll Service (Port 3003)</h2>
        <p>Endpoints:</p>
        <ul>
          <li><span class="endpoint">GET /payroll</span> - List all salaries (with bank accounts!)</li>
          <li><span class="endpoint">POST /payroll/adjust</span> - Adjust salary (no auth!)</li>
          <li><span class="endpoint">POST /payroll/bonus</span> - Add bonus (no auth!)</li>
        </ul>
        <button onclick="testPayroll()">Test Payroll Service</button>
      </div>

      <div class="service">
        <h2>📧 Notification Service (Port 3004)</h2>
        <p>Endpoints:</p>
        <ul>
          <li><span class="endpoint">GET /notifications</span> - View all notifications</li>
          <li><span class="endpoint">POST /notify</span> - Send notification</li>
          <li><span class="endpoint">POST /notify/payroll</span> - Send payroll notification</li>
        </ul>
        <button onclick="testNotification()">Test Notification Service</button>
      </div>

      <h2>Test Results:</h2>
      <pre id="results">Click a test button to see results...</pre>

      <script>
        async function testAuth() {
          const results = document.getElementById('results');
          results.textContent = 'Testing Auth Service...\\n';
          
          try {
            const res = await fetch('/api/auth/users');
            const data = await res.json();
            results.textContent += '✅ GET /users:\\n' + JSON.stringify(data, null, 2);
          } catch (err) {
            results.textContent += '❌ Error: ' + err.message;
          }
        }

        async function testEmployee() {
          const results = document.getElementById('results');
          results.textContent = 'Testing Employee Service...\\n';
          
          try {
            const res = await fetch('/api/employee/employees');
            const data = await res.json();
            results.textContent += '✅ GET /employees:\\n' + JSON.stringify(data, null, 2);
          } catch (err) {
            results.textContent += '❌ Error: ' + err.message;
          }
        }

        async function testPayroll() {
          const results = document.getElementById('results');
          results.textContent = 'Testing Payroll Service...\\n';
          
          try {
            const res = await fetch('/api/payroll/payroll');
            const data = await res.json();
            results.textContent += '✅ GET /payroll:\\n' + JSON.stringify(data, null, 2);
          } catch (err) {
            results.textContent += '❌ Error: ' + err.message;
          }
        }

        async function testNotification() {
          const results = document.getElementById('results');
          results.textContent = 'Testing Notification Service...\\n';
          
          try {
            const res = await fetch('/api/notification/notifications');
            const data = await res.json();
            results.textContent += '✅ GET /notifications:\\n' + JSON.stringify(data, null, 2);
          } catch (err) {
            results.textContent += '❌ Error: ' + err.message;
          }
        }
      </script>
    </body>
    </html>
  `)
})

// API Gateway routes - VULNERABLE: No authentication or rate limiting
app.all("/api/auth/*", async (req, res) => {
  const path = req.path.replace("/api/auth", "")
  console.log(`[GATEWAY] Forwarding to AUTH: ${req.method} ${path}`)
  try {
    const response = await fetch(`${SERVICES.auth}${path}`, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    })
    const data = await response.json()
    res.status(response.status).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.all("/api/employee/*", async (req, res) => {
  const path = req.path.replace("/api/employee", "")
  console.log(`[GATEWAY] Forwarding to EMPLOYEE: ${req.method} ${path}`)
  try {
    const response = await fetch(`${SERVICES.employee}${path}`, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    })
    const data = await response.json()
    res.status(response.status).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.all("/api/payroll/*", async (req, res) => {
  const path = req.path.replace("/api/payroll", "")
  console.log(`[GATEWAY] Forwarding to PAYROLL: ${req.method} ${path}`)
  try {
    const response = await fetch(`${SERVICES.payroll}${path}`, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    })
    const data = await response.json()
    res.status(response.status).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.all("/api/notification/*", async (req, res) => {
  const path = req.path.replace("/api/notification", "")
  console.log(`[GATEWAY] Forwarding to NOTIFICATION: ${req.method} ${path}`)
  try {
    const response = await fetch(`${SERVICES.notification}${path}`, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: req.method !== "GET" ? JSON.stringify(req.body) : undefined,
    })
    const data = await response.json()
    res.status(response.status).json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(3000, () => {
  console.log("🌐 FRONTEND/GATEWAY running on port 3000")
  console.log("📍 Open http://localhost:3000 in your browser")
})
