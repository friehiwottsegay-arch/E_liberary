# Audio Book API Views
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from .models import Book
from .serializers import BookSerializer

class AudioBookViewSet(viewsets.ModelViewSet):
    """
    ViewSet for audio books
    """
    queryset = Book.objects.filter(is_active=True)
    serializer_class = BookSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        """Filter books that have audio"""
        queryset = Book.objects.filter(is_active=True)
        
        # Filter for audio books only (you can add has_audio field to Book model)
        # For now, return all books
        return queryset

    @action(detail=True, methods=['get'])
    def chapters(self, request, pk=None):
        """Get chapters for an audio book"""
        book = self.get_object()
        
        # Sample chapters data
        chapters = [
            {
                'id': 1,
                'title': f'Chapter 1: Introduction to {book.title}',
                'duration': '45:30',
                'audio_url': f'/media/audiobooks/{book.id}/chapter1.mp3'
            },
            {
                'id': 2,
                'title': f'Chapter 2: Main Content',
                'duration': '52:15',
                'audio_url': f'/media/audiobooks/{book.id}/chapter2.mp3'
            },
            {
                'id': 3,
                'title': f'Chapter 3: Conclusion',
                'duration': '38:20',
                'audio_url': f'/media/audiobooks/{book.id}/chapter3.mp3'
            }
        ]
        
        return Response({
            'book_id': book.id,
            'book_title': book.title,
            'chapters': chapters
        })

    @action(detail=True, methods=['post'])
    def track_progress(self, request, pk=None):
        """Track user's listening progress"""
        book = self.get_object()
        
        current_time = request.data.get('current_time', 0)
        chapter_id = request.data.get('chapter_id', 1)
        
        # Here you would save progress to database
        # For now, just return success
        
        return Response({
            'success': True,
            'message': 'Progress saved',
            'book_id': book.id,
            'chapter_id': chapter_id,
            'current_time': current_time
        })

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Get featured audio books"""
        featured_books = Book.objects.filter(
            is_active=True,
            is_featured=True
        )[:10]
        
        serializer = self.get_serializer(featured_books, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def get_audiobook_detail(request, book_id):
    """Get detailed audio book information"""
    try:
        book = Book.objects.get(id=book_id, is_active=True)
        
        # Prepare audio book data
        audiobook_data = {
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'narrator': 'Professional Narrator',  # Add narrator field to Book model
            'description': book.description,
            'cover_image': book.cover_image.url if book.cover_image else None,
            'duration': '5h 32m',  # Calculate from chapters
            'language': book.language,
            'rating': book.rating,
            'chapters': [
                {
                    'id': 1,
                    'title': f'Chapter 1: Introduction',
                    'duration': '45:30',
                    'audio_url': f'/media/audiobooks/{book.id}/chapter1.mp3'
                },
                {
                    'id': 2,
                    'title': f'Chapter 2: Main Content',
                    'duration': '52:15',
                    'audio_url': f'/media/audiobooks/{book.id}/chapter2.mp3'
                },
                {
                    'id': 3,
                    'title': f'Chapter 3: Conclusion',
                    'duration': '38:20',
                    'audio_url': f'/media/audiobooks/{book.id}/chapter3.mp3'
                }
            ]
        }
        
        return Response(audiobook_data)
        
    except Book.DoesNotExist:
        return Response(
            {'error': 'Audio book not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
def list_audiobooks(request):
    """List all available audio books"""
    books = Book.objects.filter(is_active=True)[:20]
    
    audiobooks = []
    for book in books:
        audiobooks.append({
            'id': book.id,
            'title': book.title,
            'author': book.author,
            'narrator': 'Professional Narrator',
            'cover_image': book.cover_image.url if book.cover_image else None,
            'duration': '5h 32m',
            'rating': book.rating,
            'language': book.language,
            'has_audio': True
        })
    
    return Response({
        'count': len(audiobooks),
        'audiobooks': audiobooks
    })


@api_view(['POST'])
def save_recording(request):
    """Save user's voice recording"""
    try:
        book_id = request.data.get('book_id')
        audio_file = request.FILES.get('audio_file')
        timestamp = request.data.get('timestamp')
        
        if not audio_file:
            return Response(
                {'error': 'No audio file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Save recording to media folder
        # You would implement actual file saving here
        
        return Response({
            'success': True,
            'message': 'Recording saved successfully',
            'recording_id': 'rec_' + str(timestamp)
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def extract_pdf_text(request, book_id):
    """
    Extract text from PDF for display and TTS
    """
    try:
        # Get book
        try:
            book = Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            return Response(
                {'error': 'Book not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if book has PDF
        if not book.pdf_file:
            return Response(
                {'error': 'Book does not have a PDF file'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extract text from PDF
        import PyPDF2
        
        pdf_path = book.pdf_file.path
        text_content = ""
        
        try:
            with open(pdf_path, 'rb') as pdf_file:
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                # Extract all pages
                for page_num in range(len(pdf_reader.pages)):
                    page = pdf_reader.pages[page_num]
                    text_content += page.extract_text() + "\n\n"
        except Exception as e:
            return Response(
                {'error': f'Failed to extract text from PDF: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response({
            'success': True,
            'book_id': book.id,
            'book_title': book.title,
            'text': text_content,
            'page_count': len(PyPDF2.PdfReader(open(pdf_path, 'rb')).pages)
        })
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def generate_ai_audio(request):
    """
    Generate AI audio from PDF text using Text-to-Speech
    """
    try:
        book_id = request.data.get('book_id')
        
        if not book_id:
            return Response(
                {'error': 'Book ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get book
        try:
            book = Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            return Response(
                {'error': 'Book not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if book has PDF
        if not book.pdf_file:
            return Response(
                {'error': 'Book does not have a PDF file'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extract text from PDF
        import PyPDF2
        import os
        
        pdf_path = book.pdf_file.path
        text_content = ""
        
        try:
            with open(pdf_path, 'rb') as pdf_file:
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                # Extract text from first 5 pages (or all if less)
                max_pages = min(5, len(pdf_reader.pages))
                for page_num in range(max_pages):
                    page = pdf_reader.pages[page_num]
                    text_content += page.extract_text()
        except Exception as e:
            return Response(
                {'error': f'Failed to extract text from PDF: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Limit text length (TTS services have limits)
        if len(text_content) > 5000:
            text_content = text_content[:5000] + "..."
        
        # Generate audio using gTTS (Google Text-to-Speech)
        try:
            from gtts import gTTS
            import tempfile
            from django.core.files import File
            
            # Create audio
            tts = gTTS(text=text_content, lang='en', slow=False)
            
            # Save to temporary file
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
            tts.save(temp_file.name)
            
            # Save to book model
            with open(temp_file.name, 'rb') as audio_file:
                book.audio_file.save(
                    f'ai_audio_{book_id}.mp3',
                    File(audio_file),
                    save=True
                )
            
            # Update book fields
            book.has_audio = True
            book.narrator = "AI Generated Voice"
            book.save()
            
            # Clean up temp file
            os.unlink(temp_file.name)
            
            return Response({
                'success': True,
                'message': 'AI audio generated successfully',
                'audio_url': book.audio_file.url if book.audio_file else None,
                'book_id': book.id
            })
            
        except ImportError:
            return Response(
                {'error': 'gTTS library not installed. Run: pip install gtts'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            return Response(
                {'error': f'Failed to generate audio: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
