const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

// In-memory database with sensitive financial data
const payrollRecords = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "John Doe",
    ssn: "987-65-4321",
    salary: 95000,
    bankAccount: "1234567890",
    bankRouting: "021000021",
    taxId: "T123456",
    lastPayment: "2024-01-15",
    ytdEarnings: 95000,
    bonus: 10000,
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: "Jane Smith",
    ssn: "555-12-3456",
    salary: 85000,
    bankAccount: "0987654321",
    bankRouting: "021000021",
    taxId: "T789012",
    lastPayment: "2024-01-15",
    ytdEarnings: 85000,
    bonus: 8000,
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: "Bob Johnson",
    ssn: "111-22-3333",
    salary: 75000,
    bankAccount: "5555555555",
    bankRouting: "021000021",
    taxId: "T345678",
    lastPayment: "2024-01-15",
    ytdEarnings: 75000,
    bonus: 5000,
  },
]

// VULNERABLE: Exposes all salary and banking information
app.get("/payroll", (req, res) => {
  console.log("[PAYROLL] 💰 Exposing ALL payroll data including salaries and bank accounts:")
  payrollRecords.forEach((record) => {
    console.log(`  - ${record.employeeName} (SSN: ${record.ssn})`)
    console.log(`    Salary: $${record.salary}, Bank: ${record.bankAccount}, Routing: ${record.bankRouting}`)
  })
  res.json(payrollRecords)
})

// VULNERABLE: Anyone can view individual salary
app.get("/payroll/:employeeId", (req, res) => {
  const record = payrollRecords.find((r) => r.employeeId === Number.parseInt(req.params.employeeId))
  console.log(`[PAYROLL] 💰 Exposing payroll for employee ${req.params.employeeId}:`, JSON.stringify(record, null, 2))
  res.json(record || { error: "Payroll record not found" })
})

// VULNERABLE: Anyone can adjust salaries without authorization
app.post("/payroll/adjust", (req, res) => {
  const { employeeId, newSalary, reason } = req.body
  console.log(`[PAYROLL] 💰 SALARY ADJUSTMENT (no authorization):`)
  console.log(`  Employee ID: ${employeeId}`)
  console.log(`  New Salary: $${newSalary}`)
  console.log(`  Reason: ${reason || "Not provided"}`)

  const record = payrollRecords.find((r) => r.employeeId === employeeId)
  if (record) {
    const oldSalary = record.salary
    record.salary = newSalary
    console.log(`  ✅ Salary changed from $${oldSalary} to $${newSalary}`)
    res.json({ success: true, record })
  } else {
    res.status(404).json({ error: "Employee not found" })
  }
})

// VULNERABLE: Anyone can add bonus
app.post("/payroll/bonus", (req, res) => {
  const { employeeId, bonusAmount } = req.body
  console.log(`[PAYROLL] 💰 BONUS ADDED (no authorization):`)
  console.log(`  Employee ID: ${employeeId}, Bonus: $${bonusAmount}`)

  const record = payrollRecords.find((r) => r.employeeId === employeeId)
  if (record) {
    record.bonus = (record.bonus || 0) + bonusAmount
    console.log(`  ✅ New total bonus: $${record.bonus}`)
    res.json({ success: true, record })
  } else {
    res.status(404).json({ error: "Employee not found" })
  }
})

// VULNERABLE: Exposes banking information
app.get("/payroll/banking/:employeeId", (req, res) => {
  const record = payrollRecords.find((r) => r.employeeId === Number.parseInt(req.params.employeeId))
  if (record) {
    const bankingInfo = {
      employeeName: record.employeeName,
      ssn: record.ssn,
      bankAccount: record.bankAccount,
      bankRouting: record.bankRouting,
    }
    console.log(`[PAYROLL] 💰 Exposing banking info:`, JSON.stringify(bankingInfo, null, 2))
    res.json(bankingInfo)
  } else {
    res.status(404).json({ error: "Employee not found" })
  }
})

app.listen(3003, () => {
  console.log("🔓 PAYROLL SERVICE running on port 3003 (VULNERABLE - NO SECURITY)")
})
