import requests
import json

url = "http://127.0.0.1:8000/api/register/"

# Test data matching mobile app
data = {
    "first_name": "Test",
    "last_name": "User",
    "email": "testuser@example.com",
    "phone_number": "1234567890",
    "username": "testuser123",
    "password": "testpass123",
    "user_type": "buyer"
}

print("Testing registration endpoint...")
print(f"URL: {url}")
print(f"Data: {json.dumps(data, indent=2)}")
print("\n" + "="*50)

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 201:
        print("\n✅ Registration SUCCESSFUL!")
    else:
        print("\n❌ Registration FAILED!")
        
except Exception as e:
    print(f"\n❌ Error: {e}")
