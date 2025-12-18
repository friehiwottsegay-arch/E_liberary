"""
Script to find and upload PDFs from alternative sources to the site
"""
import os
import sys
import django
import requests
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
import time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dl.settings')
django.setup()

from api.models import Book

def download_pdf(url, filename, timeout=60):
    """Download PDF with better error handling"""
    try:
        print(f"    📥 Downloading: {url}")
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, timeout=timeout, headers=headers, stream=True)
        response.raise_for_status()
        
        # Check if it's actually a PDF
        content_type = response.headers.get('content-type', '').lower()
        if 'pdf' not in content_type and not url.endswith('.pdf'):
            print(f"    ❌ Not a PDF file: {content_type}")
            return None
            
        content = b''
        for chunk in response.iter_content(chunk_size=8192):
            content += chunk
            
        if len(content) < 1000:  # Too small to be a real PDF
            print(f"    ❌ File too small: {len(content)} bytes")
            return None
            
        return ContentFile(content, name=filename)
        
    except Exception as e:
        print(f"    ❌ Download failed: {e}")
        return None

# Alternative PDF sources for classic books
PDF_SOURCES = {
    "Pride and Prejudice": [
        "https://standardebooks.org/ebooks/jane-austen/pride-and-prejudice/downloads/jane-austen_pride-and-prejudice.pdf",
        "https://www.planetebook.com/free-ebooks/pride-and-prejudice.pdf",
    ],
    "Frankenstein": [
        "https://standardebooks.org/ebooks/mary-shelley/frankenstein/downloads/mary-shelley_frankenstein.pdf",
        "https://www.planetebook.com/free-ebooks/frankenstein.pdf",
    ],
    "Dracula": [
        "https://standardebooks.org/ebooks/bram-stoker/dracula/downloads/bram-stoker_dracula.pdf",
        "https://www.planetebook.com/free-ebooks/dracula.pdf",
    ],
    "Alice's Adventures in Wonderland": [
        "https://standardebooks.org/ebooks/lewis-carroll/alices-adventures-in-wonderland/downloads/lewis-carroll_alices-adventures-in-wonderland.pdf",
        "https://www.planetebook.com/free-ebooks/alices-adventures-in-wonderland.pdf",
    ],
    "The Picture of Dorian Gray": [
        "https://standardebooks.org/ebooks/oscar-wilde/the-picture-of-dorian-gray/downloads/oscar-wilde_the-picture-of-dorian-gray.pdf",
        "https://www.planetebook.com/free-ebooks/the-picture-of-dorian-gray.pdf",
    ],
    "A Tale of Two Cities": [
        "https://standardebooks.org/ebooks/charles-dickens/a-tale-of-two-cities/downloads/charles-dickens_a-tale-of-two-cities.pdf",
        "https://www.planetebook.com/free-ebooks/a-tale-of-two-cities.pdf",
    ],
    "The Adventures of Sherlock Holmes": [
        "https://standardebooks.org/ebooks/arthur-conan-doyle/the-adventures-of-sherlock-holmes/downloads/arthur-conan-doyle_the-adventures-of-sherlock-holmes.pdf",
        "https://www.planetebook.com/free-ebooks/the-adventures-of-sherlock-holmes.pdf",
    ],
    "Jane Eyre": [
        "https://standardebooks.org/ebooks/charlotte-bronte/jane-eyre/downloads/charlotte-bronte_jane-eyre.pdf",
        "https://www.planetebook.com/free-ebooks/jane-eyre.pdf",
    ],
    "Wuthering Heights": [
        "https://standardebooks.org/ebooks/emily-bronte/wuthering-heights/downloads/emily-bronte_wuthering-heights.pdf",
        "https://www.planetebook.com/free-ebooks/wuthering-heights.pdf",
    ],
    "Emma": [
        "https://standardebooks.org/ebooks/jane-austen/emma/downloads/jane-austen_emma.pdf",
        "https://www.planetebook.com/free-ebooks/emma.pdf",
    ],
}

def upload_pdfs_to_site():
    """Find and upload PDFs to the site database"""
    print("🔍 Finding and uploading PDFs to your site...")
    print("=" * 60)
    
    uploaded_count = 0
    failed_count = 0
    
    for title, pdf_urls in PDF_SOURCES.items():
        try:
            book = Book.objects.get(title=title)
            
            if book.pdf_file:
                print(f"✅ {title} - PDF already exists")
                continue
                
            print(f"\n📚 Processing: {title}")
            
            pdf_uploaded = False
            for i, url in enumerate(pdf_urls, 1):
                print(f"  🔗 Trying source {i}/{len(pdf_urls)}")
                
                filename = f"{title.replace(' ', '_').replace(chr(39), '')}.pdf"
                pdf_content = download_pdf(url, filename)
                
                if pdf_content:
                    try:
                        book.pdf_file.save(filename, pdf_content, save=True)
                        print(f"  ✅ PDF uploaded successfully to your site!")
                        uploaded_count += 1
                        pdf_uploaded = True
                        break
                    except Exception as e:
                        print(f"  ❌ Upload to site failed: {e}")
                
                time.sleep(1)  # Be nice to servers
            
            if not pdf_uploaded:
                print(f"  ❌ All sources failed for {title}")
                failed_count += 1
                
        except Book.DoesNotExist:
            print(f"❌ Book not found in database: {title}")
            failed_count += 1
        except Exception as e:
            print(f"❌ Error processing {title}: {e}")
            failed_count += 1
    
    print("\n" + "=" * 60)
    print("📊 UPLOAD SUMMARY")
    print("=" * 60)
    print(f"✅ Successfully uploaded: {uploaded_count} PDFs")
    print(f"❌ Failed uploads: {failed_count}")
    print(f"📚 Total books with PDFs now: {Book.objects.exclude(pdf_file='').count()}")
    print(f"🆓 Free books with PDFs: {Book.objects.filter(is_free=True).exclude(pdf_file='').count()}")
    
    if uploaded_count > 0:
        print(f"\n🎉 Success! {uploaded_count} new PDFs are now available on your site!")
        print("Users can now download and read these classic books for free.")

if __name__ == "__main__":
    upload_pdfs_to_site()