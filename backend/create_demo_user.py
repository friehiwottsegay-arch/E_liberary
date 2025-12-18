#!/usr/bin/env python
"""
Create a demo buyer account for testing the mobile app
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dl.settings')
django.setup()

from api.models import User

def create_demo_user():
    """Create or update demo buyer account"""
    
    # Demo user credentials
    username = 'demo_buyer'
    email = 'demo@bookmarket.com'
    password = 'demo123'
    
    # Check if user already exists
    if User.objects.filter(username=username).exists():
        print(f"✓ Demo user '{username}' already exists")
        user = User.objects.get(username=username)
        # Update password in case it changed
        user.set_password(password)
        user.user_type = 'buyer'
        user.role = 'Buyer'
        user.phone_number = '+251911234567'
        user.address = 'Demo Address, Addis Ababa, Ethiopia'
        user.save()
        print(f"✓ Password and profile updated for '{username}'")
    else:
        # Create new user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name='Demo',
            last_name='User',
            user_type='buyer',
            role='Buyer',
            phone_number='+251911234567',
            address='Demo Address, Addis Ababa, Ethiopia'
        )
        print(f"✓ Created demo user: {username}")
        print(f"✓ Set user type to: buyer")
    
    print("\n" + "="*50)
    print("DEMO ACCOUNT CREDENTIALS")
    print("="*50)
    print(f"Username: {username}")
    print(f"Password: {password}")
    print(f"Email: {email}")
    print("="*50)
    print("\nYou can now use these credentials to login to the mobile app!")
    print("Tap 'Try Demo' on the welcome screen for instant access.\n")

if __name__ == '__main__':
    create_demo_user()
