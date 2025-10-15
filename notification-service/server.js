const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

// In-memory notification log
const notifications = []

// VULNERABLE: No authentication, logs contain sensitive data
app.post("/notify", (req, res) => {
  const { recipient, subject, message, sensitiveData } = req.body

  const notification = {
    id: notifications.length + 1,
    recipient,
    subject,
    message,
    sensitiveData,
    timestamp: new Date().toISOString(),
  }

  console.log("[NOTIFICATION] 📧 Sending notification with sensitive data:")
  console.log(`  To: ${recipient}`)
  console.log(`  Subject: ${subject}`)
  console.log(`  Message: ${message}`)
  console.log(`  Sensitive Data:`, JSON.stringify(sensitiveData, null, 2))

  notifications.push(notification)
  res.json({ success: true, notification })
})

// VULNERABLE: Anyone can view all notifications
app.get("/notifications", (req, res) => {
  console.log(`[NOTIFICATION] 📧 Exposing all ${notifications.length} notifications including sensitive data`)
  res.json(notifications)
})

// VULNERABLE: No authorization to view specific notification
app.get("/notifications/:id", (req, res) => {
  const notification = notifications.find((n) => n.id === Number.parseInt(req.params.id))
  console.log(`[NOTIFICATION] 📧 Exposing notification ${req.params.id}:`, JSON.stringify(notification, null, 2))
  res.json(notification || { error: "Notification not found" })
})

// VULNERABLE: Anyone can send payroll notifications
app.post("/notify/payroll", (req, res) => {
  const { employeeId, employeeName, salary, ssn, email } = req.body

  const message = `Payroll processed for ${employeeName} (SSN: ${ssn}). Salary: $${salary}`

  console.log("[NOTIFICATION] 📧 Sending PAYROLL notification:")
  console.log(`  Employee: ${employeeName} (ID: ${employeeId})`)
  console.log(`  SSN: ${ssn}`)
  console.log(`  Salary: $${salary}`)
  console.log(`  Email: ${email}`)

  const notification = {
    id: notifications.length + 1,
    type: "payroll",
    recipient: email,
    subject: "Payroll Processed",
    message,
    sensitiveData: { employeeId, ssn, salary },
    timestamp: new Date().toISOString(),
  }

  notifications.push(notification)
  res.json({ success: true, notification })
})

app.listen(3004, () => {
  console.log("🔓 NOTIFICATION SERVICE running on port 3004 (VULNERABLE - NO SECURITY)")
})
