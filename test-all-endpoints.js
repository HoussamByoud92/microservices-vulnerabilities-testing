#!/usr/bin/env node

/**
 * Comprehensive endpoint testing script
 * Tests all endpoints across all 4 microservices
 */

const BASE_URLS = {
  auth: "http://localhost:3001",
  employee: "http://localhost:3002",
  payroll: "http://localhost:3003",
  notification: "http://localhost:3004",
}

let totalTests = 0
let passedTests = 0
let failedTests = 0

function log(message, type = "info") {
  const colors = {
    success: "\x1b[32m",
    error: "\x1b[31m",
    info: "\x1b[36m",
    warning: "\x1b[33m",
    reset: "\x1b[0m",
  }
  console.log(`${colors[type]}${message}${colors.reset}`)
}

async function testEndpoint(name, method, url, body = null, expectedStatus = 200) {
  totalTests++
  try {
    const options = {
      method,
      headers: { "Content-Type": "application/json" },
    }
    if (body) {
      options.body = JSON.stringify(body)
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.status === expectedStatus) {
      passedTests++
      log(`✓ ${name} - Status: ${response.status}`, "success")
      return { success: true, data }
    } else {
      failedTests++
      log(`✗ ${name} - Expected ${expectedStatus}, got ${response.status}`, "error")
      return { success: false, data }
    }
  } catch (error) {
    failedTests++
    log(`✗ ${name} - Error: ${error.message}`, "error")
    return { success: false, error: error.message }
  }
}

async function runTests() {
  log("\n========================================", "info")
  log("  MICROSERVICES ENDPOINT TEST SUITE", "info")
  log("========================================\n", "info")

  // AUTH SERVICE TESTS
  log("\n📋 AUTH SERVICE TESTS (Port 3001)", "warning")
  log("─────────────────────────────────────\n", "warning")

  await testEndpoint("GET /users - List all users", "GET", `${BASE_URLS.auth}/users`)

  await testEndpoint("POST /login - Valid credentials", "POST", `${BASE_URLS.auth}/login`, {
    username: "admin",
    password: "admin123",
  })

  await testEndpoint(
    "POST /login - Invalid credentials",
    "POST",
    `${BASE_URLS.auth}/login`,
    {
      username: "admin",
      password: "wrongpassword",
    },
    401,
  )

  const newUser = await testEndpoint(
    "POST /users - Create new user",
    "POST",
    `${BASE_URLS.auth}/users`,
    {
      username: "testuser",
      password: "test123",
      role: "employee",
      ssn: "999-88-7777",
    },
    201,
  )

  await testEndpoint("GET /users/:id - Get user by ID", "GET", `${BASE_URLS.auth}/users/1`)

  if (newUser.success && newUser.data.id) {
    await testEndpoint("DELETE /users/:id - Delete user", "DELETE", `${BASE_URLS.auth}/users/${newUser.data.id}`)
  }

  // EMPLOYEE SERVICE TESTS
  log("\n📋 EMPLOYEE SERVICE TESTS (Port 3002)", "warning")
  log("─────────────────────────────────────\n", "warning")

  await testEndpoint("GET /employees - List all employees", "GET", `${BASE_URLS.employee}/employees`)

  await testEndpoint("GET /employees/:id - Get employee by ID", "GET", `${BASE_URLS.employee}/employees/1`)

  const newEmployee = await testEndpoint(
    "POST /employees - Create new employee",
    "POST",
    `${BASE_URLS.employee}/employees`,
    {
      firstName: "Test",
      lastName: "Employee",
      email: "test@company.com",
      ssn: "888-77-6666",
      dateOfBirth: "1995-05-15",
      address: "999 Test St",
      phone: "555-9999",
      department: "Testing",
      position: "QA Engineer",
      hireDate: "2024-01-01",
    },
    201,
  )

  if (newEmployee.success && newEmployee.data.id) {
    await testEndpoint(
      "PUT /employees/:id - Update employee",
      "PUT",
      `${BASE_URLS.employee}/employees/${newEmployee.data.id}`,
      {
        position: "Senior QA Engineer",
        department: "Quality Assurance",
      },
    )

    await testEndpoint(
      "DELETE /employees/:id - Delete employee",
      "DELETE",
      `${BASE_URLS.employee}/employees/${newEmployee.data.id}`,
    )
  }

  // PAYROLL SERVICE TESTS
  log("\n📋 PAYROLL SERVICE TESTS (Port 3003)", "warning")
  log("─────────────────────────────────────\n", "warning")

  await testEndpoint("GET /payroll - List all payroll records", "GET", `${BASE_URLS.payroll}/payroll`)

  await testEndpoint("GET /payroll/:employeeId - Get payroll by employee ID", "GET", `${BASE_URLS.payroll}/payroll/1`)

  await testEndpoint("GET /payroll/banking/:employeeId - Get banking info", "GET", `${BASE_URLS.payroll}/banking/1`)

  await testEndpoint("POST /payroll/adjust - Adjust salary", "POST", `${BASE_URLS.payroll}/payroll/adjust`, {
    employeeId: 1,
    newSalary: 100000,
    reason: "Performance review",
  })

  await testEndpoint("POST /payroll/bonus - Add bonus", "POST", `${BASE_URLS.payroll}/payroll/bonus`, {
    employeeId: 2,
    bonusAmount: 5000,
  })

  // NOTIFICATION SERVICE TESTS
  log("\n📋 NOTIFICATION SERVICE TESTS (Port 3004)", "warning")
  log("─────────────────────────────────────\n", "warning")

  await testEndpoint("GET /notifications - List all notifications", "GET", `${BASE_URLS.notification}/notifications`)

  const newNotification = await testEndpoint(
    "POST /notify - Send notification",
    "POST",
    `${BASE_URLS.notification}/notify`,
    {
      recipient: "test@example.com",
      subject: "Test Notification",
      message: "This is a test message",
      sensitiveData: { testKey: "testValue" },
    },
  )

  if (newNotification.success && newNotification.data.notification.id) {
    await testEndpoint(
      "GET /notifications/:id - Get notification by ID",
      "GET",
      `${BASE_URLS.notification}/notifications/${newNotification.data.notification.id}`,
    )
  }

  await testEndpoint(
    "POST /notify/payroll - Send payroll notification",
    "POST",
    `${BASE_URLS.notification}/notify/payroll`,
    {
      employeeId: 1,
      employeeName: "John Doe",
      salary: 95000,
      ssn: "987-65-4321",
      email: "john.doe@company.com",
    },
  )

  // SUMMARY
  log("\n========================================", "info")
  log("  TEST SUMMARY", "info")
  log("========================================\n", "info")
  log(`Total Tests: ${totalTests}`, "info")
  log(`Passed: ${passedTests}`, "success")
  log(`Failed: ${failedTests}`, failedTests > 0 ? "error" : "success")
  log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(2)}%\n`, "info")

  if (failedTests === 0) {
    log("🎉 All tests passed!", "success")
  } else {
    log("⚠️  Some tests failed. Check the output above.", "warning")
  }

  process.exit(failedTests > 0 ? 1 : 0)
}

// Run tests
runTests().catch((error) => {
  log(`Fatal error: ${error.message}`, "error")
  process.exit(1)
})
