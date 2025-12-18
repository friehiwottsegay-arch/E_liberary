import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dl.settings')
django.setup()

from api.models import Book

print("=" * 60)
print("BOOK DATABASE STATUS")
print("=" * 60)
print(f"Total books: {Book.objects.count()}")
print(f"Free books: {Book.objects.filter(is_free=True).count()}")
print(f"Books with covers: {Book.objects.exclude(cover_image='').count()}")
print(f"Books with PDFs: {Book.objects.exclude(pdf_file='').count()}")

print("\n" + "=" * 60)
print("TOP 20 FREE BOOKS")
print("=" * 60)
free_books = Book.objects.filter(is_free=True)[:20]
for i, book in enumerate(free_books, 1):
    has_cover = "✓" if book.cover_image else "✗"
    has_pdf = "✓" if book.pdf_file else "✗"
    print(f"{i:2}. {book.title[:40]:40} | Cover:{has_cover} PDF:{has_pdf}")
