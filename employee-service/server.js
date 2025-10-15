const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())
app.use(express.json())

// In-memory database with sensitive PII
let employees = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    ssn: "987-65-4321",
    dateOfBirth: "1985-03-15",
    address: "123 Main St, New York, NY 10001",
    phone: "555-0101",
    department: "Engineering",
    position: "Senior Developer",
    hireDate: "2020-01-15",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@company.com",
    ssn: "555-12-3456",
    dateOfBirth: "1990-07-22",
    address: "456 Oak Ave, Los Angeles, CA 90001",
    phone: "555-0102",
    department: "HR",
    position: "HR Manager",
    hireDate: "2019-06-01",
  },
  {
    id: 3,
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob.johnson@company.com",
    ssn: "111-22-3333",
    dateOfBirth: "1988-11-30",
    address: "789 Pine Rd, Chicago, IL 60601",
    phone: "555-0103",
    department: "Finance",
    position: "Accountant",
    hireDate: "2021-03-10",
  },
]

// VULNERABLE: No authentication, exposes all PII
app.get("/employees", (req, res) => {
  console.log("[EMPLOYEE] 🔓 Exposing ALL employee data including SSNs:")
  employees.forEach((emp) => {
    console.log(
      `  - ${emp.firstName} ${emp.lastName}, SSN: ${emp.ssn}, DOB: ${emp.dateOfBirth}, Address: ${emp.address}`,
    )
  })
  res.json(employees)
})

// VULNERABLE: No input validation
app.post("/employees", (req, res) => {
  const newEmployee = { id: employees.length + 1, ...req.body }
  console.log("[EMPLOYEE] 🔓 Creating employee (no validation):", JSON.stringify(newEmployee, null, 2))
  employees.push(newEmployee)
  res.status(201).json(newEmployee)
})

// VULNERABLE: Direct access to PII
app.get("/employees/:id", (req, res) => {
  const employee = employees.find((e) => e.id === Number.parseInt(req.params.id))
  console.log(`[EMPLOYEE] 🔓 Exposing employee ${req.params.id} PII:`, JSON.stringify(employee, null, 2))
  res.json(employee || { error: "Employee not found" })
})

// VULNERABLE: No authorization
app.put("/employees/:id", (req, res) => {
  const index = employees.findIndex((e) => e.id === Number.parseInt(req.params.id))
  if (index !== -1) {
    employees[index] = { ...employees[index], ...req.body }
    console.log(`[EMPLOYEE] 🔓 Updated employee ${req.params.id}:`, JSON.stringify(employees[index], null, 2))
    res.json(employees[index])
  } else {
    res.status(404).json({ error: "Employee not found" })
  }
})

// VULNERABLE: No authorization
app.delete("/employees/:id", (req, res) => {
  console.log(`[EMPLOYEE] 🔓 Deleting employee ${req.params.id} without authorization`)
  employees = employees.filter((e) => e.id !== Number.parseInt(req.params.id))
  res.json({ success: true })
})

app.listen(3002, () => {
  console.log("🔓 EMPLOYEE SERVICE running on port 3002 (VULNERABLE - NO SECURITY)")
})
