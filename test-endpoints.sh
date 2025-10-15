#!/bin/bash

# Comprehensive endpoint testing script
# Tests all endpoints with curl commands

echo "========================================="
echo "  MICROSERVICES ENDPOINT TEST SUITE"
echo "========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test counter
TOTAL=0
PASSED=0
FAILED=0

test_endpoint() {
    TOTAL=$((TOTAL + 1))
    local name=$1
    local method=$2
    local url=$3
    local data=$4
    local expected_status=${5:-200}
    
    echo -e "${CYAN}Testing: $name${NC}"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$url")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$url" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$status_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ Status: $status_code${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}✗ Expected $expected_status, got $status_code${NC}"
        FAILED=$((FAILED + 1))
    fi
    echo ""
}

# AUTH SERVICE TESTS
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}AUTH SERVICE TESTS (Port 3001)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "GET /users - List all users" "GET" "http://localhost:3001/users"

test_endpoint "POST /login - Valid credentials" "POST" "http://localhost:3001/login" \
    '{"username":"admin","password":"admin123"}'

test_endpoint "POST /login - Invalid credentials" "POST" "http://localhost:3001/login" \
    '{"username":"admin","password":"wrong"}' 401

test_endpoint "POST /users - Create new user" "POST" "http://localhost:3001/users" \
    '{"username":"testuser","password":"test123","role":"employee","ssn":"999-88-7777"}' 201

test_endpoint "GET /users/1 - Get user by ID" "GET" "http://localhost:3001/users/1"

test_endpoint "DELETE /users/4 - Delete user" "DELETE" "http://localhost:3001/users/4"

# EMPLOYEE SERVICE TESTS
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}EMPLOYEE SERVICE TESTS (Port 3002)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "GET /employees - List all employees" "GET" "http://localhost:3002/employees"

test_endpoint "GET /employees/1 - Get employee by ID" "GET" "http://localhost:3002/employees/1"

test_endpoint "POST /employees - Create new employee" "POST" "http://localhost:3002/employees" \
    '{"firstName":"Test","lastName":"Employee","email":"test@company.com","ssn":"888-77-6666","dateOfBirth":"1995-05-15","address":"999 Test St","phone":"555-9999","department":"Testing","position":"QA Engineer","hireDate":"2024-01-01"}' 201

test_endpoint "PUT /employees/1 - Update employee" "PUT" "http://localhost:3002/employees/1" \
    '{"position":"Lead Developer","department":"Engineering"}'

test_endpoint "DELETE /employees/4 - Delete employee" "DELETE" "http://localhost:3002/employees/4"

# PAYROLL SERVICE TESTS
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}PAYROLL SERVICE TESTS (Port 3003)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "GET /payroll - List all payroll records" "GET" "http://localhost:3003/payroll"

test_endpoint "GET /payroll/1 - Get payroll by employee ID" "GET" "http://localhost:3003/payroll/1"

test_endpoint "GET /payroll/banking/1 - Get banking info" "GET" "http://localhost:3003/payroll/banking/1"

test_endpoint "POST /payroll/adjust - Adjust salary" "POST" "http://localhost:3003/payroll/adjust" \
    '{"employeeId":1,"newSalary":100000,"reason":"Performance review"}'

test_endpoint "POST /payroll/bonus - Add bonus" "POST" "http://localhost:3003/payroll/bonus" \
    '{"employeeId":2,"bonusAmount":5000}'

# NOTIFICATION SERVICE TESTS
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}NOTIFICATION SERVICE TESTS (Port 3004)${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

test_endpoint "GET /notifications - List all notifications" "GET" "http://localhost:3004/notifications"

test_endpoint "POST /notify - Send notification" "POST" "http://localhost:3004/notify" \
    '{"recipient":"test@example.com","subject":"Test","message":"Test message","sensitiveData":{"key":"value"}}'

test_endpoint "GET /notifications/1 - Get notification by ID" "GET" "http://localhost:3004/notifications/1"

test_endpoint "POST /notify/payroll - Send payroll notification" "POST" "http://localhost:3004/notify/payroll" \
    '{"employeeId":1,"employeeName":"John Doe","salary":95000,"ssn":"987-65-4321","email":"john.doe@company.com"}'

# SUMMARY
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}TEST SUMMARY${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Total Tests: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Failed: $FAILED${NC}"
else
    echo -e "${GREEN}Failed: $FAILED${NC}"
fi
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed.${NC}"
    exit 1
fi
