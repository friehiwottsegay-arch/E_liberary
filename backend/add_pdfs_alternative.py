"""
Script to add PDFs using alternative sources and formats
"""
import os
import sys
import django
import requests
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dl.settings')
django.setup()

from api.models import Book

def download_file(url, filename):
    try:
        print(f"    Trying: {url}")
        response = requests.get(url, timeout=30, headers={'User-Agent': 'Mozilla/5.0'})
        response.raise_for_status()
        return ContentFile(response.content, name=filename)
    except Exception as e:
        print(f"    Failed: {e}")
        return None

def try_pdf_sources(gutenberg_id, title):
    """Try multiple PDF sources for a book"""
    pdf_urls = [
        f"https://www.gutenberg.org/files/{gutenberg_id}/{gutenberg_id}-pdf.pdf",
        f"https://www.gutenberg.org/cache/epub/{gutenberg_id}/pg{gutenberg_id}.pdf",
        f"https://www.gutenberg.org/ebooks/{gutenberg_id}.pdf.utf-8",
    ]
    
    filename = f"{title.replace(' ', '_')}.pdf"
    
    for url in pdf_urls:
        content = download_file(url, filename)
        if content:
            return content, filename
    
    return None, None

# Books with Gutenberg IDs that need PDFs
BOOKS_NEEDING_PDFS = [
    {"title": "Pride and Prejudice", "gutenberg_id": "1342"},
    {"title": "Frankenstein", "gutenberg_id": "84"},
    {"title": "Dracula", "gutenberg_id": "345"},
    {"title": "The Adventures of Sherlock Holmes", "gutenberg_id": "1661"},
    {"title": "Alice's Adventures in Wonderland", "gutenberg_id": "11"},
    {"title": "A Tale of Two Cities", "gutenberg_id": "98"},
    {"title": "The Picture of Dorian Gray", "gutenberg_id": "174"},
    {"title": "Moby Dick", "gutenberg_id": "2701"},
    {"title": "The Art of War", "gutenberg_id": "132"},
    {"title": "The Prince", "gutenberg_id": "1232"},
]

def add_pdfs():
    print("Adding PDFs using alternative sources...")
    
    added_count = 0
    for book_data in BOOKS_NEEDING_PDFS:
        try:
            book = Book.objects.get(title=book_data["title"])
            
            if book.pdf_file:
                print(f"✓ {book_data['title']} - PDF already exists")
                continue
                
            print(f"\n📖 Adding PDF for: {book_data['title']}")
            
            content, filename = try_pdf_sources(book_data["gutenberg_id"], book_data["title"])
            
            if content:
                book.pdf_file.save(filename, content, save=True)
                print(f"  ✅ PDF added successfully!")
                added_count += 1
            else:
                print(f"  ❌ All PDF sources failed")
                
        except Book.DoesNotExist:
            print(f"❌ Book not found: {book_data['title']}")
    
    print(f"\n🎉 Added PDFs to {added_count} books")
    print(f"📄 Total books with PDFs: {Book.objects.exclude(pdf_file='').count()}")

if __name__ == "__main__":
    add_pdfs()