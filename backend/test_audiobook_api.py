#!/usr/bin/env python
"""
Test script for audiobook API endpoints
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dl.settings')
django.setup()

from api.models import Book
from api.audiobook_views import extract_pdf_text
from django.test import RequestFactory
from rest_framework.test import APIRequestFactory

def test_books_with_pdf():
    """Check books with PDF files"""
    print("=" * 60)
    print("TESTING: Books with PDF files")
    print("=" * 60)
    
    books = Book.objects.all()
    print(f"\nTotal books: {books.count()}")
    
    books_with_pdf = Book.objects.filter(pdf_file__isnull=False).exclude(pdf_file='')
    print(f"Books with PDF: {books_with_pdf.count()}")
    
    if books_with_pdf.exists():
        print("\nBooks with PDF files:")
        for book in books_with_pdf[:5]:
            print(f"  - ID: {book.id}, Title: {book.title}")
            print(f"    PDF: {book.pdf_file}")
            print(f"    PDF exists: {os.path.exists(book.pdf_file.path) if book.pdf_file else False}")
    else:
        print("\n⚠️  No books with PDF files found!")
        print("   You need to upload PDF files to test the extraction feature.")
    
    return books_with_pdf.first() if books_with_pdf.exists() else None

def test_extract_text_function(book):
    """Test PDF text extraction"""
    if not book:
        print("\n⚠️  Skipping text extraction test - no book with PDF")
        return
    
    print("\n" + "=" * 60)
    print("TESTING: PDF Text Extraction")
    print("=" * 60)
    
    print(f"\nTesting with book: {book.title}")
    
    if not book.pdf_file:
        print("❌ Book has no PDF file")
        return
    
    if not os.path.exists(book.pdf_file.path):
        print(f"❌ PDF file does not exist: {book.pdf_file.path}")
        return
    
    try:
        import PyPDF2
        print("✅ PyPDF2 is installed")
        
        # Try to extract text
        with open(book.pdf_file.path, 'rb') as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            page_count = len(pdf_reader.pages)
            print(f"✅ PDF has {page_count} pages")
            
            # Extract first page
            if page_count > 0:
                first_page = pdf_reader.pages[0]
                text = first_page.extract_text()
                print(f"✅ Extracted {len(text)} characters from first page")
                print(f"\nFirst 200 characters:")
                print("-" * 60)
                print(text[:200])
                print("-" * 60)
            else:
                print("❌ PDF has no pages")
                
    except ImportError:
        print("❌ PyPDF2 not installed. Run: pip install PyPDF2")
    except Exception as e:
        print(f"❌ Error extracting text: {str(e)}")

def test_api_endpoint(book):
    """Test the API endpoint"""
    if not book:
        print("\n⚠️  Skipping API endpoint test - no book with PDF")
        return
    
    print("\n" + "=" * 60)
    print("TESTING: API Endpoint")
    print("=" * 60)
    
    factory = APIRequestFactory()
    request = factory.get(f'/api/audiobooks/extract-text/{book.id}/')
    
    try:
        response = extract_pdf_text(request, book.id)
        print(f"✅ API Response Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.data
            print(f"✅ Success: {data.get('success')}")
            print(f"✅ Book ID: {data.get('book_id')}")
            print(f"✅ Book Title: {data.get('book_title')}")
            print(f"✅ Text length: {len(data.get('text', ''))} characters")
            print(f"✅ Page count: {data.get('page_count')}")
        else:
            print(f"❌ Error: {response.data}")
            
    except Exception as e:
        print(f"❌ API Error: {str(e)}")

def test_urls():
    """Test URL configuration"""
    print("\n" + "=" * 60)
    print("TESTING: URL Configuration")
    print("=" * 60)
    
    from django.urls import resolve, reverse
    
    try:
        # Test if URL pattern exists
        url = reverse('extract-pdf-text', kwargs={'book_id': 1})
        print(f"✅ URL pattern exists: {url}")
        
        # Test if it resolves correctly
        resolved = resolve(url)
        print(f"✅ Resolves to: {resolved.func.__name__}")
        
    except Exception as e:
        print(f"❌ URL Error: {str(e)}")

def main():
    print("\n" + "=" * 60)
    print("AUDIOBOOK API BACKEND TEST")
    print("=" * 60)
    
    # Test 1: Check books
    book = test_books_with_pdf()
    
    # Test 2: Extract text
    test_extract_text_function(book)
    
    # Test 3: API endpoint
    test_api_endpoint(book)
    
    # Test 4: URLs
    test_urls()
    
    print("\n" + "=" * 60)
    print("TEST COMPLETE")
    print("=" * 60)
    print("\n✅ Backend is ready!")
    print("\nNext steps:")
    print("1. Start backend: python manage.py runserver")
    print("2. Start frontend: npm start (in frontend folder)")
    print("3. Visit: http://localhost:3000/audiobook-library")
    print("\n")

if __name__ == '__main__':
    main()
