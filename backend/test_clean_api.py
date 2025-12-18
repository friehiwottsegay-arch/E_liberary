#!/usr/bin/env python
import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dl.settings')
django.setup()

from api.simple_api import SimpleBook, SimpleBookSerializer

print("=== CLEAN DJANGO API DEMO ===")
print("One Model | One Serializer | One View | One URL Route")
print("=" * 50)

# Create sample data
SimpleBook.objects.all().delete()

books_data = [
    {'title': 'Clean Code', 'author': 'Robert Martin', 'description': 'Good book', 'price': 39.99},
    {'title': 'Python Crash Course', 'author': 'Eric Matthes', 'description': 'Learn Python', 'price': 29.99},
    {'title': 'Django for Beginners', 'author': 'William Vincent', 'description': 'Web dev', 'price': 34.99}
]

for book_data in books_data:
    book = SimpleBook.objects.create(**book_data)
    print(f"Created: {book.title} - ${book.price}")

# Test serializer
books = SimpleBook.objects.all()
serializer = SimpleBookSerializer(books, many=True)

print(f"\nTotal books: {len(serializer.data)}")
print("API Endpoint: /api/simple-books/")
print("Available methods: GET, POST, PUT, PATCH, DELETE")
print("\nClean API ready!")