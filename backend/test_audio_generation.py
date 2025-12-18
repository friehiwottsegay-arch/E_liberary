#!/usr/bin/env python
"""
Test script to verify audio generation works
Run: python test_audio_generation.py
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dl.settings')
django.setup()

from api.models import Book

def test_audio_generation():
    print("🧪 Testing Audio Generation System...")
    print("-" * 50)
    
    # Check if gtts is installed
    try:
        from gtts import gTTS
        print("✅ gTTS installed")
    except ImportError:
        print("❌ gTTS not installed. Run: pip install gtts")
        return False
    
    # Check if PyPDF2 is installed
    try:
        import PyPDF2
        print("✅ PyPDF2 installed")
    except ImportError:
        print("❌ PyPDF2 not installed. Run: pip install PyPDF2")
        return False
    
    # Check if books exist
    books = Book.objects.all()
    print(f"✅ Found {books.count()} books in database")
    
    if books.count() == 0:
        print("⚠️  No books found. Add books in admin first.")
        return False
    
    # Check if any book has PDF
    books_with_pdf = Book.objects.exclude(pdf_file='')
    print(f"✅ Found {books_with_pdf.count()} books with PDF")
    
    if books_with_pdf.count() == 0:
        print("⚠️  No books with PDF. Upload PDF files in admin.")
        return False
    
    # Test text extraction
    book = books_with_pdf.first()
    print(f"\n📖 Testing with book: {book.title}")
    
    if book.pdf_file:
        try:
            with open(book.pdf_file.path, 'rb') as pdf_file:
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                page = pdf_reader.pages[0]
                text = page.extract_text()
                print(f"✅ Extracted {len(text)} characters from PDF")
                print(f"   First 100 chars: {text[:100]}...")
        except Exception as e:
            print(f"❌ Error extracting PDF: {e}")
            return False
    
    # Test TTS
    try:
        print("\n🎤 Testing Text-to-Speech...")
        tts = gTTS(text="This is a test", lang='en')
        test_file = 'test_audio.mp3'
        tts.save(test_file)
        print(f"✅ Generated test audio: {test_file}")
        
        # Clean up
        if os.path.exists(test_file):
            os.remove(test_file)
            print("✅ Cleaned up test file")
    except Exception as e:
        print(f"❌ Error generating audio: {e}")
        return False
    
    print("\n" + "=" * 50)
    print("✅ ALL TESTS PASSED!")
    print("=" * 50)
    print("\n🚀 System is ready to generate audio!")
    print(f"\nTo generate audio for '{book.title}':")
    print(f"POST http://127.0.0.1:8000/api/audiobooks/generate-audio/")
    print(f'Body: {{"book_id": {book.id}}}')
    
    return True

if __name__ == '__main__':
    test_audio_generation()
