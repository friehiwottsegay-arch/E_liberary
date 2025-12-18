"""
Script to update existing books with PDFs and covers
"""
import os
import sys
import django
import requests
from urllib.parse import urlparse
from django.core.files.base import ContentFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dl.settings')
django.setup()

from api.models import Book

def download_file(url, filename):
    """Download file from URL and return content"""
    try:
        print(f"    Downloading: {url}")
        response = requests.get(url, timeout=30, headers={'User-Agent': 'Mozilla/5.0'})
        response.raise_for_status()
        return ContentFile(response.content, name=filename)
    except Exception as e:
        print(f"    Failed to download {url}: {e}")
        return None

# Book data with Gutenberg IDs and cover URLs
BOOK_MEDIA = {
    "Pride and Prejudice": {"gutenberg_id": "1342", "cover_url": "https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg"},
    "1984": {"gutenberg_id": "19337", "cover_url": "https://www.gutenberg.org/cache/epub/19337/pg19337.cover.medium.jpg"},
    "The Great Gatsby": {"gutenberg_id": "64317", "cover_url": "https://www.gutenberg.org/cache/epub/64317/pg64317.cover.medium.jpg"},
    "Frankenstein": {"gutenberg_id": "84", "cover_url": "https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg"},
    "Dracula": {"gutenberg_id": "345", "cover_url": "https://www.gutenberg.org/cache/epub/345/pg345.cover.medium.jpg"},
    "The Adventures of Sherlock Holmes": {"gutenberg_id": "1661", "cover_url": "https://www.gutenberg.org/cache/epub/1661/pg1661.cover.medium.jpg"},
    "Alice's Adventures in Wonderland": {"gutenberg_id": "11", "cover_url": "https://www.gutenberg.org/cache/epub/11/pg11.cover.medium.jpg"},
    "The Republic": {"gutenberg_id": "1497", "cover_url": "https://www.gutenberg.org/cache/epub/1497/pg1497.cover.medium.jpg"},
    "Meditations": {"gutenberg_id": "2680", "cover_url": "https://www.gutenberg.org/cache/epub/2680/pg2680.cover.medium.jpg"},
    "The Prince": {"gutenberg_id": "1232", "cover_url": "https://www.gutenberg.org/cache/epub/1232/pg1232.cover.medium.jpg"},
    "War and Peace": {"gutenberg_id": "2600", "cover_url": "https://www.gutenberg.org/cache/epub/2600/pg2600.cover.medium.jpg"},
    "Crime and Punishment": {"gutenberg_id": "2554", "cover_url": "https://www.gutenberg.org/cache/epub/2554/pg2554.cover.medium.jpg"},
    "The Odyssey": {"gutenberg_id": "1727", "cover_url": "https://www.gutenberg.org/cache/epub/1727/pg1727.cover.medium.jpg"},
    "A Tale of Two Cities": {"gutenberg_id": "98", "cover_url": "https://www.gutenberg.org/cache/epub/98/pg98.cover.medium.jpg"},
    "The Picture of Dorian Gray": {"gutenberg_id": "174", "cover_url": "https://www.gutenberg.org/cache/epub/174/pg174.cover.medium.jpg"},
    "Moby Dick": {"gutenberg_id": "2701", "cover_url": "https://www.gutenberg.org/cache/epub/2701/pg2701.cover.medium.jpg"},
    "The Art of War": {"gutenberg_id": "132", "cover_url": "https://www.gutenberg.org/cache/epub/132/pg132.cover.medium.jpg"},
}

def update_books():
    print("Updating existing books with PDFs and covers...")
    
    updated_count = 0
    for title, media_data in BOOK_MEDIA.items():
        try:
            book = Book.objects.get(title=title)
            print(f"\n📖 Updating: {title}")
            
            updated = False
            
            # Add PDF if missing
            if not book.pdf_file and media_data.get("gutenberg_id"):
                pdf_url = f"https://www.gutenberg.org/files/{media_data['gutenberg_id']}/{media_data['gutenberg_id']}-pdf.pdf"
                pdf_filename = f"{title.replace(' ', '_')}.pdf"
                pdf_content = download_file(pdf_url, pdf_filename)
                if pdf_content:
                    book.pdf_file.save(pdf_filename, pdf_content, save=False)
                    print(f"  ✓ PDF added")
                    updated = True
                else:
                    print(f"  ✗ PDF failed")
            elif book.pdf_file:
                print(f"  ✓ PDF already exists")
            
            # Add cover if missing
            if not book.cover_image and media_data.get("cover_url"):
                cover_filename = f"{title.replace(' ', '_')}_cover.jpg"
                cover_content = download_file(media_data["cover_url"], cover_filename)
                if cover_content:
                    book.cover_image.save(cover_filename, cover_content, save=False)
                    print(f"  ✓ Cover added")
                    updated = True
                else:
                    print(f"  ✗ Cover failed")
            elif book.cover_image:
                print(f"  ✓ Cover already exists")
            
            if updated:
                book.save()
                updated_count += 1
                
        except Book.DoesNotExist:
            print(f"❌ Book not found: {title}")
    
    print(f"\n🎉 Updated {updated_count} books")
    print(f"📚 Total books: {Book.objects.count()}")
    print(f"📄 Books with PDFs: {Book.objects.exclude(pdf_file='').count()}")
    print(f"🖼️  Books with covers: {Book.objects.exclude(cover_image='').count()}")

if __name__ == "__main__":
    update_books()