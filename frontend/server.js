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
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          background: #f5f5f5;
          padding: 20px;
        }
        .container { max-width: 1400px; margin: 0 auto; }
        h1 { color: #e74c3c; margin-bottom: 20px; font-size: 32px; }
        .warning { 
          background: #fff3cd; 
          border-left: 4px solid #ffc107; 
          padding: 20px; 
          margin-bottom: 30px; 
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .warning strong { color: #856404; }
        .services-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(600px, 1fr)); 
          gap: 20px; 
          margin-bottom: 30px;
        }
        .service { 
          background: white; 
          padding: 25px; 
          border-radius: 8px; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .service h2 { 
          color: #2c3e50; 
          margin-bottom: 15px; 
          font-size: 24px;
          border-bottom: 2px solid #3498db;
          padding-bottom: 10px;
        }
        .endpoint-group { 
          margin: 15px 0; 
          padding: 15px; 
          background: #f8f9fa; 
          border-radius: 6px;
        }
        .endpoint-title { 
          font-family: 'Courier New', monospace; 
          font-weight: bold; 
          color: #2c3e50;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .endpoint-desc { 
          color: #7f8c8d; 
          font-size: 13px; 
          margin-bottom: 10px;
        }
        button { 
          background: #3498db; 
          color: white; 
          border: none; 
          padding: 10px 20px; 
          margin: 5px 5px 5px 0; 
          cursor: pointer; 
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }
        button:hover { 
          background: #2980b9; 
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        button.danger { background: #e74c3c; }
        button.danger:hover { background: #c0392b; }
        button.success { background: #27ae60; }
        button.success:hover { background: #229954; }
        button.warning { background: #f39c12; }
        button.warning:hover { background: #d68910; }
        .input-group { 
          margin: 10px 0; 
          display: flex; 
          gap: 10px; 
          flex-wrap: wrap;
        }
        input, textarea { 
          padding: 8px 12px; 
          border: 1px solid #ddd; 
          border-radius: 4px;
          font-size: 14px;
          font-family: inherit;
        }
        input { flex: 1; min-width: 150px; }
        textarea { 
          width: 100%; 
          min-height: 80px; 
          font-family: 'Courier New', monospace;
          resize: vertical;
        }
        .results-section { 
          background: white; 
          padding: 25px; 
          border-radius: 8px; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .results-section h2 { 
          color: #2c3e50; 
          margin-bottom: 15px;
          font-size: 24px;
        }
        pre { 
          background: #2d2d2d; 
          color: #f8f8f2; 
          padding: 20px; 
          border-radius: 6px; 
          overflow-x: auto;
          font-size: 13px;
          line-height: 1.5;
          max-height: 600px;
          overflow-y: auto;
        }
        .test-all { 
          background: #9b59b6; 
          font-size: 16px; 
          padding: 15px 30px;
          margin: 20px 0;
        }
        .test-all:hover { background: #8e44ad; }
        .badge { 
          display: inline-block; 
          padding: 4px 8px; 
          border-radius: 3px; 
          font-size: 11px; 
          font-weight: bold; 
          margin-left: 8px;
        }
        .badge.get { background: #3498db; color: white; }
        .badge.post { background: #27ae60; color: white; }
        .badge.put { background: #f39c12; color: white; }
        .badge.delete { background: #e74c3c; color: white; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>⚠️ Vulnerable Microservices Testing Dashboard</h1>
        
        <div class="warning">
          <strong>⚠️ ATTENTION ÉDUCATIVE:</strong> Ce système est intentionnellement vulnérable pour démontrer les failles de sécurité courantes.
          <br><strong>Vulnérabilités:</strong> Pas d'authentification, pas de validation, exposition de PII (SSN, salaires, mots de passe), logs non sécurisés.
        </div>

        <button class="test-all" onclick="testAllEndpoints()">🚀 TESTER TOUS LES ENDPOINTS</button>

        <div class="services-grid">
          <!-- AUTH SERVICE -->
          <div class="service">
            <h2>🔓 Auth Service (Port 3001)</h2>
            
            <div class="endpoint-group">
              <div class="endpoint-title">GET /users <span class="badge get">GET</span></div>
              <div class="endpoint-desc">Liste tous les utilisateurs avec mots de passe en clair</div>
              <button onclick="testEndpoint('GET', '/api/auth/users')">Tester</button>
            </div>

            <div class="endpoint-group">
              <div class="endpoint-title">GET /users/:id <span class="badge get">GET</span></div>
              <div class="endpoint-desc">Obtenir un utilisateur spécifique</div>
              <div class="input-group">
                <input type="number" id="auth-user-id" placeholder="User ID" value="1">
                <button onclick="testEndpoint('GET', '/api/auth/users/' + document.getElementById('auth-user-id').value)">Tester</button>
              </div>
            </div>

            <div class="endpoint-group">
              <div class="endpoint-title">POST /login <span class="badge post">POST</span></div>
              <div class="endpoint-desc">Login sans token (retourne le mot de passe!)</div>
              <div class="input-group">
                <input type="text" id="login-username" placeholder="Username" value="admin">
                <input type="password" id="login-password" placeholder="Password" value="admin123">
                <button class="success" onclick="testLogin()">Login</button>
              </div>
            </div>

            <div class="endpoint-group">
              <div class="endpoint-title">POST /users <span class="badge post">POST</span></div>
              <div class="endpoint-desc">Créer un utilisateur sans validation</div>
              <div class="input-group">
                <input type="text" id="new-username" placeholder="Username" value="hacker">
                <input type="password" id="new-password" placeholder="Password" value="123">
                <input type="text" id="new-role" placeholder="Role" value="admin">
                <input type="text" id="new-ssn" placeholder="SSN" value="000-00-0000">
                <button class="success" onclick="createUser()">Créer</button>
              </div>
            </div>

            <div class="endpoint-group">
              <div class="endpoint-title">DELETE /users/:id <span class="badge delete">DELETE</span></div>
              <div class="endpoint-desc">Supprimer un utilisateur sans autorisation</div>
              <div class="input-group">
                <input type="number" id="delete-user-id" placeholder="User ID" value="2">
                <button class="danger" onclick="testEndpoint('DELETE', '/api/auth/users/' + document.getElementById('delete-user-id').value)">Supprimer</button>
              </div>
            </div>
          </div>

          <!-- EMPLOYEE SERVICE -->
          <div class="service">
            <h2>👥 Employee Service (Port 3002)</h2>
            
            <div class="endpoint-group">
              <div class="endpoint-title">GET /employees <span class="badge get">GET</span></div>
              <div class="endpoint-desc">Liste tous les employés avec SSN et adresses</div>
              <button onclick="testEndpoint('GET', '/api/employee/employees')">Tester</button>
            </div>

            <div class="endpoint-group">
              <div class="endpoint-title">GET /employees/:id <span class="badge get">GET</span></div>
              <div class="endpoint-desc">Obtenir un employé spécifique</div>
              <div class="input-group">
                <input type="number" id="emp-id" placeholder="Employee ID" value="1">
                <button onclick="testEndpoint('GET', '/api/employee/employees/' + document.getElementById('emp-id').value)">Tester</button>
              </div>
            </div>

            <div class="endpoint-group">
              <div class="endpoint-title">POST /employees <span class="badge post">POST</span></div>
              <div class="endpoint-desc">Créer un employé sans validation</div>
              <textarea id="new-employee" placeholder="JSON de l'employé">{"firstName":"Alice","lastName":"Hacker","email":"alice@evil.com","ssn":"999-99-9999","dateOfBirth":"1995-01-01","address":"123 Evil St","phone":"555-HACK","department":"IT","position":"Pentester"}</textarea>
              <button class="success" onclick="testEndpoint('POST', '/api/employee/employees', document.getElementById('new-employee').value)">Créer</button>
            </div>

            <div class="endpoint-group">
              <div class="endpoint-title">PUT /employees/:id <span class="badge put">PUT</span></div>
              <div class="endpoint-desc">Modifier un employé sans autorisation</div>
              <div class="input-group">
                <input type="number" id="update-emp-id" placeholder="Employee ID" value="1">
                <textarea id="update-employee" placeholder="JSON des modifications">{"position":"CEO","salary":999999}</textarea>
                <button class="warning" onclick="testEndpoint('PUT', '/api/employee/employees/' + document.getElementById('update-emp-id').value, document.getElementById('update-employee').value)">Modifier</button>
              </div>
            </div>

            <div class="endpoint-group">
              <div class="endpoint-title">DELETE /employees/:id <span class="badge delete">DELETE</span></div>
              <div class="endpoint-desc">Supprimer un employé</div>
              <div class="input-group">
                <input type="number" id="delete-emp-id" placeholder="Employee ID" value="3">
                <button class="danger" onclick="testEndpoint('DELETE', '/api/employee/employees/' + document.getElementById('delete-emp-id').value)">Supprimer</button>
              </div>
            </div>
          </div>

          <!-- PAYROLL SERVICE -->
          <div class="service">
            <h2>💰 Payroll Service (Port 3003)</h2>
            
            <div class="endpoint-group">
              <div class="endpoint-title">GET /payroll <span class="badge get">GET</span></div>
              <div class="endpoint-desc">Liste tous les salaires avec comptes bancaires</div>
              <button onclick="testEndpoint('GET', '/api/payroll/payroll')">Tester</button>
            </div>

            <div class="endpoint-group">
              <div class="endpoint-title">GET /payroll/:id <span class="badge get">GET</span></div>
              <div class="endpoint-desc">Obtenir le salaire d'un employé</div>
              <div class="input-group">
                <input type="number" id="payroll-id" placeholder="Employee ID" value="1">
                <button onclick="testEndpoint('GET', '/api/payroll/payroll/' + document.getElementById('payroll-id').value)">Tester</button>
              </div>
            </div>

            <div class="endpoint-group">
              <div class="endpoint-title">GET /payroll/banking/:id <span class="badge get">GET</span></div>
              <div class="endpoint-desc">Obtenir les infos bancaires d'un employé</div>
              <div class="input-group">
                <input type="number" id="banking-id" placeholder="Employee ID" value="1">
                <button onclick="testEndpoint('GET', '/api/payroll/banking/' + document.getElementById('banking-id').value)">Tester</button>
              </div>
            </div>

            <div class="endpoint-group">
              <div class="endpoint-title">POST /payroll/adjust <span class="badge post">POST</span></div>
              <div class="endpoint-desc">⚠️ AJUSTER UN SALAIRE sans autorisation!</div>
              <div class="input-group">
                <input type="number" id="adjust-emp-id" placeholder="Employee ID" value="1">
                <input type="number" id="adjust-salary" placeholder="Nouveau salaire" value="250000">
                <input type="text" id="adjust-reason" placeholder="Raison" value="Self-promotion">
                <button class="warning" onclick="adjustSalary()">Ajuster</button>
              </div>
            </div>

            <div class="endpoint-group">
              <div class="endpoint-title">POST /payroll/bonus <span class="badge post">POST</span></div>
              <div class="endpoint-desc">⚠️ AJOUTER UN BONUS sans autorisation!</div>
              <div class="input-group">
                <input type="number" id="bonus-emp-id" placeholder="Employee ID" value="1">
                <input type="number" id="bonus-amount" placeholder="Montant bonus" value="50000">
                <button class="success" onclick="addBonus()">Ajouter Bonus</button>
              </div>
            </div>
          </div>

          <!-- NOTIFICATION SERVICE -->
          <div class="service">
            <h2>📧 Notification Service (Port 3004)</h2>
            
            <div class="endpoint-group">
              <div class="endpoint-title">GET /notifications <span class="badge get">GET</span></div>
              <div class="endpoint-desc">Voir toutes les notifications</div>
              <button onclick="testEndpoint('GET', '/api/notification/notifications')">Tester</button>
            </div>

            <div class="endpoint-group">
              <div class="endpoint-title">GET /notifications/:id <span class="badge get">GET</span></div>
              <div class="endpoint-desc">Obtenir une notification spécifique</div>
              <div class="input-group">
                <input type="number" id="notif-id" placeholder="Notification ID" value="1">
                <button onclick="testEndpoint('GET', '/api/notification/notifications/' + document.getElementById('notif-id').value)">Tester</button>
              </div>
            </div>

            <div class="endpoint-group">
              <div class="endpoint-title">POST /notify <span class="badge post">POST</span></div>
              <div class="endpoint-desc">Envoyer une notification avec données sensibles</div>
              <textarea id="notify-data" placeholder="JSON de la notification">{"recipient":"victim@company.com","subject":"Your salary has been adjusted","message":"Congratulations!","sensitiveData":{"ssn":"123-45-6789","newSalary":1000000}}</textarea>
              <button class="success" onclick="testEndpoint('POST', '/api/notification/notify', document.getElementById('notify-data').value)">Envoyer</button>
            </div>

            <div class="endpoint-group">
              <div class="endpoint-title">POST /notify/payroll <span class="badge post">POST</span></div>
              <div class="endpoint-desc">Envoyer une notification de paie</div>
              <textarea id="payroll-notif-data" placeholder="JSON de la notification">{"employeeId":1,"employeeName":"John Doe","salary":95000,"ssn":"987-65-4321","email":"john.doe@company.com"}</textarea>
              <button class="success" onclick="testEndpoint('POST', '/api/notification/notify/payroll', document.getElementById('payroll-notif-data').value)">Envoyer</button>
            </div>
          </div>
        </div>

        <div class="results-section">
          <h2>📊 Résultats des Tests</h2>
          <pre id="results">Cliquez sur un bouton de test pour voir les résultats...</pre>
        </div>
      </div>

      <script>
        let testResults = [];

        async function testEndpoint(method, path, body = null) {
          const results = document.getElementById('results');
          results.textContent = \`Testing \${method} \${path}...\\n\`;
          
          try {
            const options = {
              method: method,
              headers: { 'Content-Type': 'application/json' }
            };
            
            if (body && method !== 'GET') {
              options.body = typeof body === 'string' ? body : JSON.stringify(body);
            }
            
            const res = await fetch(path, options);
            const data = await res.json();
            
            results.textContent = \`✅ \${method} \${path}\\n\`;
            results.textContent += \`Status: \${res.status} \${res.statusText}\\n\\n\`;
            results.textContent += JSON.stringify(data, null, 2);
            
            return { success: true, method, path, status: res.status, data };
          } catch (err) {
            results.textContent = \`❌ Error: \${err.message}\`;
            return { success: false, method, path, error: err.message };
          }
        }

        async function testLogin() {
          const username = document.getElementById('login-username').value;
          const password = document.getElementById('login-password').value;
          await testEndpoint('POST', '/api/auth/login', { username, password });
        }

        async function createUser() {
          const username = document.getElementById('new-username').value;
          const password = document.getElementById('new-password').value;
          const role = document.getElementById('new-role').value;
          const ssn = document.getElementById('new-ssn').value;
          await testEndpoint('POST', '/api/auth/users', { username, password, role, ssn });
        }

        async function adjustSalary() {
          const employeeId = parseInt(document.getElementById('adjust-emp-id').value);
          const newSalary = parseInt(document.getElementById('adjust-salary').value);
          const reason = document.getElementById('adjust-reason').value;
          await testEndpoint('POST', '/api/payroll/adjust', { employeeId, newSalary, reason });
        }

        async function addBonus() {
          const employeeId = parseInt(document.getElementById('bonus-emp-id').value);
          const bonusAmount = parseInt(document.getElementById('bonus-amount').value);
          await testEndpoint('POST', '/api/payroll/bonus', { employeeId, bonusAmount });
        }

        async function testAllEndpoints() {
          const results = document.getElementById('results');
          results.textContent = '🚀 TESTING ALL ENDPOINTS...\\n\\n';
          testResults = [];
          
          const tests = [
            // Auth Service
            { method: 'GET', path: '/api/auth/users', name: 'Auth: List Users' },
            { method: 'GET', path: '/api/auth/users/1', name: 'Auth: Get User 1' },
            { method: 'POST', path: '/api/auth/login', body: {username:'admin',password:'admin123'}, name: 'Auth: Login' },
            
            // Employee Service
            { method: 'GET', path: '/api/employee/employees', name: 'Employee: List All' },
            { method: 'GET', path: '/api/employee/employees/1', name: 'Employee: Get Employee 1' },
            
            // Payroll Service
            { method: 'GET', path: '/api/payroll/payroll', name: 'Payroll: List All' },
            { method: 'GET', path: '/api/payroll/payroll/1', name: 'Payroll: Get Payroll 1' },
            { method: 'GET', path: '/api/payroll/banking/1', name: 'Payroll: Get Banking Info' },
            
            // Notification Service
            { method: 'GET', path: '/api/notification/notifications', name: 'Notification: List All' },
          ];
          
          for (const test of tests) {
            results.textContent += \`Testing: \${test.name}...\\n\`;
            
            try {
              const options = {
                method: test.method,
                headers: { 'Content-Type': 'application/json' }
              };
              
              if (test.body) {
                options.body = JSON.stringify(test.body);
              }
              
              const res = await fetch(test.path, options);
              const data = await res.json();
              
              const result = {
                name: test.name,
                method: test.method,
                path: test.path,
                status: res.status,
                success: res.ok
              };
              
              testResults.push(result);
              results.textContent += \`  ✅ \${res.status} \${res.statusText}\\n\`;
            } catch (err) {
              testResults.push({
                name: test.name,
                method: test.method,
                path: test.path,
                error: err.message,
                success: false
              });
              results.textContent += \`  ❌ Error: \${err.message}\\n\`;
            }
            
            await new Promise(resolve => setTimeout(resolve, 200));
          }
          
          // Summary
          const passed = testResults.filter(r => r.success).length;
          const total = testResults.length;
          
          results.textContent += \`\\n\\n📊 SUMMARY:\\n\`;
          results.textContent += \`  Total Tests: \${total}\\n\`;
          results.textContent += \`  Passed: \${passed}\\n\`;
          results.textContent += \`  Failed: \${total - passed}\\n\\n\`;
          
          results.textContent += \`DETAILED RESULTS:\\n\`;
          results.textContent += JSON.stringify(testResults, null, 2);
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
