"""
Script to fix the remaining 6 books - add covers and PDFs
"""
import os
import sys
import django
import requests
from django.core.files.base import ContentFile
import time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dl.settings')
django.setup()

from api.models import Book

def download_file(url, filename, file_type="PDF"):
    """Download file with better error handling"""
    try:
        print(f"    📥 Downloading {file_type}: {url}")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, timeout=60, headers=headers, stream=True)
        response.raise_for_status()
        
        content = b''
        for chunk in response.iter_content(chunk_size=8192):
            content += chunk
            
        if len(content) < 500:  # Too small
            print(f"    ❌ File too small: {len(content)} bytes")
            return None
            
        return ContentFile(content, name=filename)
        
    except Exception as e:
        print(f"    ❌ {file_type} download failed: {e}")
        return None

# Missing books data with multiple sources
MISSING_BOOKS_DATA = {
    "The Adventures of Sherlock Holmes": {
        "pdf_urls": [
            "https://www.planetebook.com/free-ebooks/the-adventures-of-sherlock-holmes.pdf",
            "https://www.gutenberg.org/files/1661/1661-0.txt",  # Text fallback
        ],
        "cover_urls": [
            "https://covers.openlibrary.org/b/title/The%20Adventures%20of%20Sherlock%20Holmes-L.jpg",
            "https://m.media-amazon.com/images/I/81QcWC3FHOL.jpg",
        ]
    },
    "Moby Dick": {
        "pdf_urls": [
            "https://www.planetebook.com/free-ebooks/moby-dick.pdf",
            "https://standardebooks.org/ebooks/herman-melville/moby-dick/downloads/herman-melville_moby-dick.pdf",
        ],
        "cover_urls": [
            "https://covers.openlibrary.org/b/title/Moby%20Dick-L.jpg",
            "https://m.media-amazon.com/images/I/71d5wo+-MuL.jpg",
        ]
    },
    "The Odyssey": {
        "pdf_urls": [
            "https://www.planetebook.com/free-ebooks/the-odyssey.pdf",
            "https://standardebooks.org/ebooks/homer/the-odyssey/william-cullen-bryant/downloads/homer_the-odyssey.pdf",
        ],
        "cover_urls": [
            "https://covers.openlibrary.org/b/title/The%20Odyssey-L.jpg",
            "https://m.media-amazon.com/images/I/81g0AATkO9L.jpg",
        ]
    },
    "Crime and Punishment": {
        "pdf_urls": [
            "https://www.planetebook.com/free-ebooks/crime-and-punishment.pdf",
            "https://standardebooks.org/ebooks/fyodor-dostoevsky/crime-and-punishment/constance-garnett/downloads/fyodor-dostoevsky_crime-and-punishment.pdf",
        ],
        "cover_urls": [
            "https://covers.openlibrary.org/b/title/Crime%20and%20Punishment-L.jpg",
            "https://m.media-amazon.com/images/I/71O2XIytdqL.jpg",
        ]
    },
    "War and Peace": {
        "pdf_urls": [
            "https://www.planetebook.com/free-ebooks/war-and-peace.pdf",
            "https://standardebooks.org/ebooks/leo-tolstoy/war-and-peace/louise-maude_aylmer-maude/downloads/leo-tolstoy_war-and-peace.pdf",
        ],
        "cover_urls": [
            "https://covers.openlibrary.org/b/title/War%20and%20Peace-L.jpg",
            "https://m.media-amazon.com/images/I/A1agLFsWkOL.jpg",
        ]
    },
    "The Art of War": {
        "pdf_urls": [
            "https://www.planetebook.com/free-ebooks/the-art-of-war.pdf",
            "https://standardebooks.org/ebooks/sun-tzu/the-art-of-war/lionel-giles/downloads/sun-tzu_the-art-of-war.pdf",
        ],
        "cover_urls": [
            "https://covers.openlibrary.org/b/title/The%20Art%20of%20War-L.jpg",
            "https://m.media-amazon.com/images/I/71s7xcGlZzL.jpg",
        ]
    },
    "The Prince": {
        "pdf_urls": [
            "https://www.planetebook.com/free-ebooks/the-prince.pdf",
            "https://standardebooks.org/ebooks/niccolo-machiavelli/the-prince/w-k-marriott/downloads/niccolo-machiavelli_the-prince.pdf",
        ],
        "cover_urls": [
            "https://covers.openlibrary.org/b/title/The%20Prince-L.jpg",
            "https://m.media-amazon.com/images/I/71nXPGovoTL.jpg",
        ]
    },
    "Meditations": {
        "pdf_urls": [
            "https://www.planetebook.com/free-ebooks/meditations.pdf",
            "https://standardebooks.org/ebooks/marcus-aurelius/meditations/george-long/downloads/marcus-aurelius_meditations.pdf",
        ],
        "cover_urls": [
            "https://covers.openlibrary.org/b/title/Meditations-L.jpg",
            "https://m.media-amazon.com/images/I/71aG+xDKSYL.jpg",
        ]
    },
    "The Republic": {
        "pdf_urls": [
            "https://www.planetebook.com/free-ebooks/the-republic.pdf",
            "https://standardebooks.org/ebooks/plato/the-republic/benjamin-jowett/downloads/plato_the-republic.pdf",
        ],
        "cover_urls": [
            "https://covers.openlibrary.org/b/title/The%20Republic-L.jpg",
            "https://m.media-amazon.com/images/I/71rpa1-kyvL.jpg",
        ]
    },
    "To Kill a Mockingbird": {
        "pdf_urls": [
            # This book is still under copyright, so we'll skip PDF
        ],
        "cover_urls": [
            "https://covers.openlibrary.org/b/title/To%20Kill%20a%20Mockingbird-L.jpg",
            "https://m.media-amazon.com/images/I/71FxgtFKcQL.jpg",
        ]
    },
    "The Wealth of Nations": {
        "pdf_urls": [
            "https://www.planetebook.com/free-ebooks/the-wealth-of-nations.pdf",
            "https://standardebooks.org/ebooks/adam-smith/the-wealth-of-nations/downloads/adam-smith_the-wealth-of-nations.pdf",
        ],
        "cover_urls": [
            "https://covers.openlibrary.org/b/title/The%20Wealth%20of%20Nations-L.jpg",
            "https://m.media-amazon.com/images/I/71nXPGovoTL.jpg",
        ]
    },
    "The Communist Manifesto": {
        "pdf_urls": [
            "https://www.planetebook.com/free-ebooks/the-communist-manifesto.pdf",
            "https://standardebooks.org/ebooks/karl-marx_friedrich-engels/the-communist-manifesto/samuel-moore/downloads/karl-marx_friedrich-engels_the-communist-manifesto.pdf",
        ],
        "cover_urls": [
            "https://covers.openlibrary.org/b/title/The%20Communist%20Manifesto-L.jpg",
            "https://m.media-amazon.com/images/I/61fdrEuPJWL.jpg",
        ]
    }
}

def fix_remaining_books():
    """Fix the remaining books with missing covers and PDFs"""
    print("🔧 Fixing remaining books - adding covers and PDFs...")
    print("=" * 60)
    
    fixed_count = 0
    
    for title, data in MISSING_BOOKS_DATA.items():
        try:
            book = Book.objects.get(title=title)
            print(f"\n📚 Processing: {title}")
            
            updated = False
            
            # Add cover if missing
            if not book.cover_image and data.get("cover_urls"):
                for i, cover_url in enumerate(data["cover_urls"], 1):
                    print(f"  🖼️  Trying cover source {i}/{len(data['cover_urls'])}")
                    cover_filename = f"{title.replace(' ', '_').replace(chr(39), '')}_cover.jpg"
                    cover_content = download_file(cover_url, cover_filename, "Cover")
                    
                    if cover_content:
                        try:
                            book.cover_image.save(cover_filename, cover_content, save=False)
                            print(f"  ✅ Cover added!")
                            updated = True
                            break
                        except Exception as e:
                            print(f"  ❌ Cover save failed: {e}")
                    
                    time.sleep(1)
            elif book.cover_image:
                print(f"  ✅ Cover already exists")
            
            # Add PDF if missing
            if not book.pdf_file and data.get("pdf_urls"):
                for i, pdf_url in enumerate(data["pdf_urls"], 1):
                    print(f"  📄 Trying PDF source {i}/{len(data['pdf_urls'])}")
                    pdf_filename = f"{title.replace(' ', '_').replace(chr(39), '')}.pdf"
                    pdf_content = download_file(pdf_url, pdf_filename, "PDF")
                    
                    if pdf_content:
                        try:
                            book.pdf_file.save(pdf_filename, pdf_content, save=False)
                            print(f"  ✅ PDF added!")
                            updated = True
                            break
                        except Exception as e:
                            print(f"  ❌ PDF save failed: {e}")
                    
                    time.sleep(1)
            elif book.pdf_file:
                print(f"  ✅ PDF already exists")
            
            if updated:
                book.save()
                fixed_count += 1
                print(f"  💾 Book updated successfully!")
            
        except Book.DoesNotExist:
            print(f"❌ Book not found: {title}")
        except Exception as e:
            print(f"❌ Error processing {title}: {e}")
    
    print("\n" + "=" * 60)
    print("📊 FIX SUMMARY")
    print("=" * 60)
    print(f"🔧 Books processed: {fixed_count}")
    print(f"📚 Total books: {Book.objects.count()}")
    print(f"🆓 Free books: {Book.objects.filter(is_free=True).count()}")
    print(f"🖼️  Books with covers: {Book.objects.exclude(cover_image='').count()}")
    print(f"📄 Books with PDFs: {Book.objects.exclude(pdf_file='').count()}")
    
    print(f"\n🎉 Fix complete! Your book collection is now more complete.")

if __name__ == "__main__":
    fix_remaining_books()