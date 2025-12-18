"""
Script to insert 20 popular free books with PDFs and covers
"""
import os
import sys
import django
import requests
from urllib.parse import urlparse
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dl.settings')
django.setup()

from api.models import Book, BookCatagory
from datetime import date

def get_or_create_category(name):
    cat, created = BookCatagory.objects.get_or_create(name=name)
    return cat

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

def get_pdf_url(gutenberg_id):
    """Get PDF URL from Project Gutenberg"""
    return f"https://www.gutenberg.org/files/{gutenberg_id}/{gutenberg_id}-pdf.pdf"

FREE_BOOKS = [
    {"title": "Pride and Prejudice", "author": "Jane Austen", "description": "A romantic novel following Elizabeth Bennet as she deals with issues of manners, upbringing, morality, and marriage.", "category": "Fiction", "page_count": 432, "rating": 4.7, "gutenberg_id": "1342", "cover_url": "https://www.gutenberg.org/cache/epub/1342/pg1342.cover.medium.jpg"},
    {"title": "1984", "author": "George Orwell", "description": "A dystopian novel about totalitarianism, mass surveillance, and repressive regimentation.", "category": "Fiction", "page_count": 328, "rating": 4.8, "gutenberg_id": "19337", "cover_url": "https://www.gutenberg.org/cache/epub/19337/pg19337.cover.medium.jpg"},
    {"title": "The Great Gatsby", "author": "F. Scott Fitzgerald", "description": "A story of the mysteriously wealthy Jay Gatsby and his love for Daisy Buchanan.", "category": "Fiction", "page_count": 180, "rating": 4.5, "gutenberg_id": "64317", "cover_url": "https://www.gutenberg.org/cache/epub/64317/pg64317.cover.medium.jpg"},
    {"title": "Frankenstein", "author": "Mary Shelley", "description": "A Gothic novel about a young scientist who creates a sapient creature.", "category": "Fiction", "page_count": 280, "rating": 4.4, "gutenberg_id": "84", "cover_url": "https://www.gutenberg.org/cache/epub/84/pg84.cover.medium.jpg"},
    {"title": "Dracula", "author": "Bram Stoker", "description": "The classic Gothic horror novel that introduced Count Dracula.", "category": "Fiction", "page_count": 418, "rating": 4.3, "gutenberg_id": "345", "cover_url": "https://www.gutenberg.org/cache/epub/345/pg345.cover.medium.jpg"},
    {"title": "The Adventures of Sherlock Holmes", "author": "Arthur Conan Doyle", "description": "A collection of twelve short stories featuring detective Sherlock Holmes.", "category": "Fiction", "page_count": 307, "rating": 4.6, "gutenberg_id": "1661", "cover_url": "https://www.gutenberg.org/cache/epub/1661/pg1661.cover.medium.jpg"},
    {"title": "Alice's Adventures in Wonderland", "author": "Lewis Carroll", "description": "A young girl falls through a rabbit hole into a fantasy world.", "category": "Fiction", "page_count": 96, "rating": 4.5, "gutenberg_id": "11", "cover_url": "https://www.gutenberg.org/cache/epub/11/pg11.cover.medium.jpg"},
    {"title": "The Republic", "author": "Plato", "description": "A Socratic dialogue concerning justice and the just city-state.", "category": "Philosophy", "page_count": 416, "rating": 4.4, "gutenberg_id": "1497", "cover_url": "https://www.gutenberg.org/cache/epub/1497/pg1497.cover.medium.jpg"},
    {"title": "Meditations", "author": "Marcus Aurelius", "description": "Personal writings of the Roman Emperor on Stoic philosophy.", "category": "Philosophy", "page_count": 254, "rating": 4.7, "gutenberg_id": "2680", "cover_url": "https://www.gutenberg.org/cache/epub/2680/pg2680.cover.medium.jpg"},
    {"title": "The Prince", "author": "Niccolo Machiavelli", "description": "A political treatise on how to acquire and maintain political power.", "category": "Non-Fiction", "page_count": 140, "rating": 4.3, "gutenberg_id": "1232", "cover_url": "https://www.gutenberg.org/cache/epub/1232/pg1232.cover.medium.jpg"},
    {"title": "War and Peace", "author": "Leo Tolstoy", "description": "An epic novel chronicling French invasion of Russia.", "category": "Fiction", "page_count": 1225, "rating": 4.6, "gutenberg_id": "2600", "cover_url": "https://www.gutenberg.org/cache/epub/2600/pg2600.cover.medium.jpg"},
    {"title": "Crime and Punishment", "author": "Fyodor Dostoevsky", "description": "A psychological drama about a poor ex-student who commits murder.", "category": "Fiction", "page_count": 671, "rating": 4.5, "gutenberg_id": "2554", "cover_url": "https://www.gutenberg.org/cache/epub/2554/pg2554.cover.medium.jpg"},
    {"title": "The Odyssey", "author": "Homer", "description": "An ancient Greek epic poem following Odysseus's journey home.", "category": "Fiction", "page_count": 541, "rating": 4.4, "gutenberg_id": "1727", "cover_url": "https://www.gutenberg.org/cache/epub/1727/pg1727.cover.medium.jpg"},
    {"title": "A Tale of Two Cities", "author": "Charles Dickens", "description": "A historical novel set before and during the French Revolution.", "category": "Fiction", "page_count": 489, "rating": 4.4, "gutenberg_id": "98", "cover_url": "https://www.gutenberg.org/cache/epub/98/pg98.cover.medium.jpg"},
    {"title": "The Picture of Dorian Gray", "author": "Oscar Wilde", "description": "A novel about a young man whose portrait ages while he remains young.", "category": "Fiction", "page_count": 254, "rating": 4.5, "gutenberg_id": "174", "cover_url": "https://www.gutenberg.org/cache/epub/174/pg174.cover.medium.jpg"},
    {"title": "Moby Dick", "author": "Herman Melville", "description": "Captain Ahab's obsessive quest to kill the white whale.", "category": "Fiction", "page_count": 635, "rating": 4.3, "gutenberg_id": "2701", "cover_url": "https://www.gutenberg.org/cache/epub/2701/pg2701.cover.medium.jpg"},
    {"title": "The Art of War", "author": "Sun Tzu", "description": "An ancient Chinese military treatise on warfare, strategy, and tactics.", "category": "Non-Fiction", "page_count": 68, "rating": 4.6, "gutenberg_id": "132", "cover_url": "https://www.gutenberg.org/cache/epub/132/pg132.cover.medium.jpg"},
    {"title": "Jane Eyre", "author": "Charlotte Bronte", "description": "The story of an orphaned girl who becomes a governess and falls in love.", "category": "Fiction", "page_count": 507, "rating": 4.6, "gutenberg_id": "1260", "cover_url": "https://www.gutenberg.org/cache/epub/1260/pg1260.cover.medium.jpg"},
    {"title": "Wuthering Heights", "author": "Emily Bronte", "description": "A passionate tale of love and revenge on the Yorkshire moors.", "category": "Fiction", "page_count": 416, "rating": 4.4, "gutenberg_id": "768", "cover_url": "https://www.gutenberg.org/cache/epub/768/pg768.cover.medium.jpg"},
    {"title": "Emma", "author": "Jane Austen", "description": "The story of a young woman who delights in meddling in romantic affairs.", "category": "Fiction", "page_count": 474, "rating": 4.5, "gutenberg_id": "158", "cover_url": "https://www.gutenberg.org/cache/epub/158/pg158.cover.medium.jpg"},
]

def insert_books():
    print("Inserting 20 free books with PDFs and covers...")
    categories = {}
    for cat_name in ["Fiction", "Non-Fiction", "Philosophy"]:
        categories[cat_name] = get_or_create_category(cat_name)
    
    inserted = 0
    for i, book_data in enumerate(FREE_BOOKS, 1):
        print(f"\n[{i}/20] Processing: {book_data['title']}")
        
        if Book.objects.filter(title=book_data["title"]).exists():
            print(f"  Skipped: Already exists")
            continue
        
        # Create book first
        book = Book.objects.create(
            title=book_data["title"], 
            author=book_data["author"],
            description=book_data["description"], 
            category=categories.get(book_data["category"]),
            page_count=book_data["page_count"], 
            rating=book_data["rating"], 
            language="english",
            price=0.00, hard_price=0.00, soft_price=0.00, 
            is_free=True, is_active=True,
            is_for_sale=True, book_type='soft', grade_level='intermediate',
        )
        
        # Download and attach PDF
        if book_data.get("gutenberg_id"):
            pdf_url = get_pdf_url(book_data["gutenberg_id"])
            pdf_filename = f"{book_data['title'].replace(' ', '_')}.pdf"
            pdf_content = download_file(pdf_url, pdf_filename)
            if pdf_content:
                book.pdf_file.save(pdf_filename, pdf_content, save=False)
                print(f"  ✓ PDF attached")
            else:
                print(f"  ✗ PDF failed")
        
        # Download and attach cover image
        if book_data.get("cover_url"):
            cover_filename = f"{book_data['title'].replace(' ', '_')}_cover.jpg"
            cover_content = download_file(book_data["cover_url"], cover_filename)
            if cover_content:
                book.cover_image.save(cover_filename, cover_content, save=False)
                print(f"  ✓ Cover attached")
            else:
                print(f"  ✗ Cover failed")
        
        book.save()
        print(f"  ✓ Book created successfully")
        inserted += 1
    
    print(f"\n🎉 Done! Inserted: {inserted} books")
    print(f"📚 Total books: {Book.objects.count()}")
    print(f"🆓 Free books: {Book.objects.filter(is_free=True).count()}")
    print(f"📄 Books with PDFs: {Book.objects.exclude(pdf_file='').count()}")
    print(f"🖼️  Books with covers: {Book.objects.exclude(cover_image='').count()}")

if __name__ == "__main__":
    insert_books()
