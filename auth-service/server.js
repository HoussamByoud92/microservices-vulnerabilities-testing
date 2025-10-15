const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

// In-memory database (vulnerable: no encryption)
let users = [
  { id: 1, username: "admin", password: "admin123", role: "admin", ssn: "123-45-6789" },
  { id: 2, username: "john.doe", password: "password", role: "employee", ssn: "987-65-4321" },
  { id: 3, username: "jane.smith", password: "12345", role: "manager", ssn: "555-12-3456" },
]

// VULNERABLE: No authentication required
app.get("/users", (req, res) => {
  console.log("[AUTH] 🔓 Exposing all users with passwords and SSNs:", JSON.stringify(users, null, 2))
  res.json(users)
})

// VULNERABLE: No input validation
app.post("/login", (req, res) => {
  const { username, password } = req.body
  console.log(`[AUTH] 🔓 Login attempt - Username: ${username}, Password: ${password}`)

  const user = users.find((u) => u.username === username && u.password === password)

  if (user) {
    console.log(`[AUTH] ✅ Login successful for user:`, JSON.stringify(user, null, 2))
    // VULNERABLE: Returning full user object including password and SSN
    res.json({ success: true, user })
  } else {
    console.log(`[AUTH] ❌ Login failed for username: ${username}`)
    res.status(401).json({ success: false, message: "Invalid credentials" })
  }
})

// VULNERABLE: No authorization check
app.post("/users", (req, res) => {
  const newUser = { id: users.length + 1, ...req.body }
  console.log("[AUTH] 🔓 Creating new user (no validation):", JSON.stringify(newUser, null, 2))
  users.push(newUser)
  res.status(201).json(newUser)
})

// VULNERABLE: Direct access to sensitive data
app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === Number.parseInt(req.params.id))
  console.log(`[AUTH] 🔓 Exposing user ${req.params.id}:`, JSON.stringify(user, null, 2))
  res.json(user || { error: "User not found" })
})

// VULNERABLE: No authorization
app.delete("/users/:id", (req, res) => {
  console.log(`[AUTH] 🔓 Deleting user ${req.params.id} without authorization`)
  users = users.filter((u) => u.id !== Number.parseInt(req.params.id))
  res.json({ success: true })
})

app.listen(3001, () => {
  console.log("🔓 AUTH SERVICE running on port 3001 (VULNERABLE - NO SECURITY)")
})
