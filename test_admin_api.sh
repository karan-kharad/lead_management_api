#!/bin/bash

BASE_URL="http://127.0.0.1:8000/api"
EMAIL="admin@example.com"
PASSWORD="AdminPassword123!"

echo "--- 1. Logging In as Admin ---"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/login/" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")
echo $LOGIN_RESPONSE

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | grep -oP '"access_token":"\K[^"]+')

if [ -z "$ACCESS_TOKEN" ]; then
  echo "Login failed, no token received."
  exit 1
fi
echo ""

echo "--- 2. Testing User List (Admin Only) ---"
curl -s -w "\nStatus: %{http_code}\n" -X GET "$BASE_URL/users/" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
echo ""

echo "--- 3. Testing Lead List (Admin sees all) ---"
curl -s -w "\nStatus: %{http_code}\n" -X GET "$BASE_URL/leads/" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
echo ""
