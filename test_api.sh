#!/bin/bash

set -x
BASE_URL="http://127.0.0.1:8000/api"
TIMESTAMP=$(date +%s)
USERNAME="testuser_$TIMESTAMP"
EMAIL="testuser_$TIMESTAMP@example.com"
PASSWORD="TestPassword123!"

echo "--- 1. Registering User ---"
REG_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register/" \
  -H "Content-Type: application/json" \
  -d "{
    \"username\": \"$USERNAME\",
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"password2\": \"$PASSWORD\",
    \"first_name\": \"Test\",
    \"last_name\": \"User\"
  }")
echo $REG_RESPONSE
echo ""

echo "--- 2. Logging In ---"
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

echo "--- 3. Testing Me Endpoint ---"
curl -s -X GET "$BASE_URL/auth/me/" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
echo ""
echo ""

echo "--- 4. Creating a Lead ---"
LEAD_RESPONSE=$(curl -s -X POST "$BASE_URL/leads/" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"first_name\": \"John\",
    \"last_name\": \"Doe\",
    \"email\": \"john_$TIMESTAMP@example.com\",
    \"company\": \"Test Corp\",
    \"source\": \"Web\",
    \"status\": \"new\"
  }")
echo $LEAD_RESPONSE
LEAD_ID=$(echo $LEAD_RESPONSE | grep -oP '"id":\K[0-9]+' | head -n 1)
echo ""

echo "--- 5. Listing Leads ---"
curl -s -X GET "$BASE_URL/leads/" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
echo ""
echo ""

echo "--- 6. Updating Lead Status ---"
curl -s -w "\nStatus: %{http_code}\n" -X PATCH "$BASE_URL/leads/$LEAD_ID/" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"status\": \"contacted\"}"
echo ""

echo "--- 7. Dashboard Stats ---"
curl -s -w "\nStatus: %{http_code}\n" -X GET "$BASE_URL/dashboard/" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
echo ""

echo "--- 8. Testing Admin Endpoint (Should return 403 for sales user) ---"
curl -s -w "\nStatus: %{http_code}\n" -X GET "$BASE_URL/users/" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
echo ""

echo "--- 9. Deleting Lead ---"
curl -s -w "\nStatus: %{http_code}\n" -X DELETE "$BASE_URL/leads/$LEAD_ID/" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
echo ""
