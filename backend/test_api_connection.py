"""
Test API connection and endpoints
"""
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_books_list():
    """Test books list endpoint"""
    print("\n" + "="*60)
    print("Testing: GET /api/audiobooks/")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/audiobooks/", timeout=5)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success! Found {len(data)} books")
            if data:
                print(f"\nFirst book: {data[0].get('title', 'N/A')}")
                print(f"Has PDF: {'Yes' if data[0].get('pdf_file') else 'No'}")
                print(f"Has Cover: {'Yes' if data[0].get('cover_image') else 'No'}")
        else:
            print(f"❌ Failed: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Backend server is not running!")
        print("   Start backend with: python manage.py runserver")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_book_detail(book_id=1):
    """Test single book detail endpoint"""
    print("\n" + "="*60)
    print(f"Testing: GET /api/audiobooks/{book_id}/")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/audiobooks/{book_id}/", timeout=5)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success!")
            print(f"Title: {data.get('title', 'N/A')}")
            print(f"Author: {data.get('author', 'N/A')}")
            print(f"PDF File: {data.get('pdf_file', 'None')}")
            print(f"Cover Image: {data.get('cover_image', 'None')}")
        else:
            print(f"❌ Failed: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Backend server is not running!")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_extract_text(book_id=1):
    """Test PDF text extraction endpoint"""
    print("\n" + "="*60)
    print(f"Testing: GET /api/audiobooks/extract-text/{book_id}/")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/audiobooks/extract-text/{book_id}/", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success!")
            print(f"Book Title: {data.get('book_title', 'N/A')}")
            print(f"Page Count: {data.get('page_count', 'N/A')}")
            text = data.get('text', '')
            print(f"Text Length: {len(text)} characters")
            print(f"Text Preview: {text[:200]}...")
        else:
            print(f"❌ Failed: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Backend server is not running!")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_audiobooks_list():
    """Test audiobooks list endpoint"""
    print("\n" + "="*60)
    print("Testing: GET /api/audiobooks/list/")
    print("="*60)
    
    try:
        response = requests.get(f"{BASE_URL}/audiobooks/list/", timeout=5)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success!")
            print(f"Count: {data.get('count', 0)}")
            audiobooks = data.get('audiobooks', [])
            if audiobooks:
                print(f"\nFirst audiobook: {audiobooks[0].get('title', 'N/A')}")
        else:
            print(f"❌ Failed: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Backend server is not running!")
    except Exception as e:
        print(f"❌ Error: {e}")

def check_cors():
    """Check CORS configuration"""
    print("\n" + "="*60)
    print("Checking CORS Configuration")
    print("="*60)
    
    try:
        response = requests.options(f"{BASE_URL}/books/", timeout=5)
        print(f"Status Code: {response.status_code}")
        
        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin', 'Not Set'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods', 'Not Set'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers', 'Not Set'),
        }
        
        print("\nCORS Headers:")
        for header, value in cors_headers.items():
            status = "✅" if value != 'Not Set' else "❌"
            print(f"{status} {header}: {value}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("\n🔍 API CONNECTION TEST")
    print("="*60)
    
    # Run all tests
    test_books_list()
    test_book_detail(1)
    test_extract_text(1)
    test_audiobooks_list()
    check_cors()
    
    print("\n" + "="*60)
    print("✅ Test Complete!")
    print("="*60)
    print("\nIf you see connection errors, make sure:")
    print("1. Backend server is running: python manage.py runserver")
    print("2. Server is on http://127.0.0.1:8000")
    print("3. CORS is properly configured")
    print("="*60)
