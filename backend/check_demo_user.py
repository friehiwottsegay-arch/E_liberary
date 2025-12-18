import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dl.settings')
django.setup()

from api.models import User

try:
    user = User.objects.get(username='demo_buyer')
    print(f"✅ Demo user found!")
    print(f"Username: {user.username}")
    print(f"Email: {user.email}")
    print(f"Active: {user.is_active}")
    print(f"User Type: {user.user_type}")
    print(f"First Name: {user.first_name}")
    print(f"Last Name: {user.last_name}")
    
    # Test password
    if user.check_password('demo123'):
        print("✅ Password 'demo123' is CORRECT")
    else:
        print("❌ Password 'demo123' is WRONG")
        
except User.DoesNotExist:
    print("❌ Demo user NOT found!")
    print("Run: python create_demo_user.py")
