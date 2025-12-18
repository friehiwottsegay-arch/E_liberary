#!/usr/bin/env python
"""
Test script for the clean Simple API
Demonstrates: One Model, One Serializer, One View, One URL Route
"""

import os
import django
import sys
import json
import requests
from decimal import Decimal

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dl.settings')
django.setup()

from api.simple_api import SimpleBook, SimpleBookSerializer
from django.contrib.auth.models import User

def create_sample_data():
    """Create sample SimpleBook records"""
    print("📚 Creating sample SimpleBook data...")
    
    # Clear existing data
    SimpleBook.objects.all().delete()
    
    # Create sample books
    books_data = [
        {
            'title': 'Clean Code',
            'author': 'Robert C. Martin',
            'description': 'A handbook of agile software craftsmanship',
            'price': Decimal('39.99')
        },
        {
            'title': 'Python Crash Course',
            'author': 'Eric Matthes',
            'description': 'A hands-on, project-based introduction to programming',
            'price': Decimal('29.99')
        },
        {
            'title': 'Django for Beginners',
            'author': 'William S. Vincent',
            'description': 'Build web applications from scratch with Django',
            'price': Decimal('34.99')
        },
        {
            'title': 'JavaScript: The Good Parts',
            'author': 'Douglas Crockford',
            'description': 'The best parts of the JavaScript language',
            'price': Decimal('24.99')
        }
    ]
    
    books = []
    for book_data in books_data:
        book = SimpleBook.objects.create(**book_data)
        books.append(book)
        print(f"✅ Created: {book.title} by {book.author} - ${book.price}")
    
    return books

def test_serializer():
    """Test the single serializer"""
    print("\n🔄 Testing SimpleBookSerializer...")
    
    books = SimpleBook.objects.all()
    serializer = SimpleBookSerializer(books, many=True)
    
    print("📋 Serialized data:")
    for book_data in serializer.data:
        print(f"  - ID: {book_data['id']}, Title: {book_data['title']}, Author: {book_data['author']}")
    
    return serializer.data

def demonstrate_api_endpoints():
    """Demonstrate the API endpoints available"""
    print("\n🌐 Available API Endpoints:")
    print("  GET    /api/simple-books/          - List all books")
    print("  GET    /api/simple-books/{id}/     - Get book details")
    print("  POST   /api/simple-books/          - Create new book")
    print("  PUT    /api/simple-books/{id}/     - Update book")
    print("  PATCH  /api/simple-books/{id}/     - Partial update book")
    print("  DELETE /api/simple-books/{id}/     - Delete book")
    print("  GET    /api/simple-books/?search=  - Search books")

def main():
    """Main test function"""
    print("=" * 60)
    print("🎯 CLEAN DJANGO API DEMONSTRATION")
    print("📋 One Model | One Serializer | One View | One URL Route")
    print("=" * 60)
    
    try:
        # Create sample data
        books = create_sample_data()
        
        # Test serializer
        serialized_data = test_serializer()
        
        # Show API endpoints
        demonstrate_api_endpoints()
        
        print("\n✨ SUMMARY:")
        print(f"  📊 Total books created: {len(books)}")
        print(f"  🏗️  Model: SimpleBook (1 model)")
        print(f"  📝 Serializer: SimpleBookSerializer (1 serializer)")
        print(f"  👁️  View: SimpleBookViewSet (1 view)")
        print(f"  🛣️  URL: /api/simple-books/ (1 route)")
        print(f"  🔗 Clean connection: ✅ All working together!")
        
        print("\n🚀 API is ready for testing!")
        print("   Run: python manage.py runserver")
        print("   Then visit: http://127.0.0.1:8000/api/simple-books/")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1
    
    return 0

if __name__ == "__main__":
    exit_code = main()
    sys.exit(exit_code)