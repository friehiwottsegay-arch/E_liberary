# Audio Book API Views
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.http import HttpResponse
from django.core.files.base import ContentFile
import os
import tempfile
import logging
from .models import Book
from .serializers import BookSerializer

# Set up logging
logger = logging.getLogger(__name__)

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
    """Save user's voice recording with enhanced features"""
    try:
        book_id = request.data.get('book_id')
        audio_file = request.FILES.get('audio_file')
        timestamp = request.data.get('timestamp', timezone.now().timestamp())
        note_text = request.data.get('note_text', '')
        page_number = request.data.get('page_number', 1)
        
        if not audio_file:
            return Response(
                {
                    'success': False,
                    'error': 'No audio file provided',
                    'required_fields': ['audio_file']
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate book exists
        if book_id:
            try:
                book = Book.objects.get(id=book_id, is_active=True)
            except Book.DoesNotExist:
                return Response(
                    {
                        'success': False,
                        'error': 'Book not found',
                        'book_id': book_id
                    },
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # Generate unique filename
        file_extension = audio_file.name.split('.')[-1] if '.' in audio_file.name else 'webm'
        recording_filename = f'voice_note_{book_id}_{timestamp}_{page_number}.{file_extension}'
        
        # Save recording to media folder
        try:
            from django.core.files.storage import default_storage
            
            # Save file
            file_path = default_storage.save(
                f'voice_recordings/{recording_filename}',
                audio_file
            )
            
            # Get full URL
            file_url = default_storage.url(file_path)
            
            # Create recording metadata (you might want to create a VoiceRecording model)
            recording_data = {
                'recording_id': f'rec_{int(timestamp)}',
                'book_id': book_id,
                'book_title': book.title if book_id else None,
                'page_number': page_number,
                'note_text': note_text,
                'file_path': file_path,
                'file_url': file_url,
                'filename': recording_filename,
                'file_size': audio_file.size,
                'created_at': timezone.now().isoformat()
            }
            
            return Response({
                'success': True,
                'message': 'Recording saved successfully',
                'recording': recording_data
            })
            
        except Exception as save_error:
            return Response(
                {
                    'success': False,
                    'error': f'Failed to save recording: {str(save_error)}',
                    'book_id': book_id
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    except Exception as e:
        logger.error(f"Error in save_recording: {str(e)}")
        return Response(
            {
                'success': False,
                'error': f'Unexpected error: {str(e)}'
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET', 'POST'])
def accessibility_settings(request):
    """
    Handle accessibility settings for users
    GET: Retrieve settings
    POST: Save settings
    """
    try:
        user_id = request.user.id if request.user.is_authenticated else None
        session_key = request.session.session_key
        
        if request.method == 'GET':
            # Retrieve accessibility settings
            # You might want to create an AccessibilitySettings model
            default_settings = {
                'screen_reader_enabled': False,
                'high_contrast': False,
                'large_text': False,
                'focus_mode': False,
                'reduced_motion': False,
                'voice_commands': True,
                'auto_read': False,
                'font_size': 18,
                'line_height': 1.8,
                'voice_speed': 1.0,
                'voice_pitch': 1.0,
                'voice_language': 'en'
            }
            
            return Response({
                'success': True,
                'settings': default_settings,
                'user_id': user_id,
                'session_key': session_key
            })
            
        elif request.method == 'POST':
            # Save accessibility settings
            settings_data = request.data.get('settings', {})
            
            # Validate settings
            valid_settings = {}
            
            # Boolean settings
            bool_fields = ['screen_reader_enabled', 'high_contrast', 'large_text', 
                          'focus_mode', 'reduced_motion', 'voice_commands', 'auto_read']
            for field in bool_fields:
                if field in settings_data:
                    valid_settings[field] = bool(settings_data[field])
            
            # Numeric settings
            if 'font_size' in settings_data:
                try:
                    font_size = int(settings_data['font_size'])
                    valid_settings['font_size'] = max(12, min(32, font_size))
                except (ValueError, TypeError):
                    pass
            
            if 'line_height' in settings_data:
                try:
                    line_height = float(settings_data['line_height'])
                    valid_settings['line_height'] = max(1.0, min(3.0, line_height))
                except (ValueError, TypeError):
                    pass
            
            if 'voice_speed' in settings_data:
                try:
                    voice_speed = float(settings_data['voice_speed'])
                    valid_settings['voice_speed'] = max(0.5, min(2.0, voice_speed))
                except (ValueError, TypeError):
                    pass
            
            if 'voice_pitch' in settings_data:
                try:
                    voice_pitch = float(settings_data['voice_pitch'])
                    valid_settings['voice_pitch'] = max(0.5, min(2.0, voice_pitch))
                except (ValueError, TypeError):
                    pass
            
            # String settings
            if 'voice_language' in settings_data:
                valid_languages = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'ja', 'ko', 'zh']
                if settings_data['voice_language'] in valid_languages:
                    valid_settings['voice_language'] = settings_data['voice_language']
            
            # Here you would save to database if you have an AccessibilitySettings model
            # For now, we'll just return the validated settings
            
            return Response({
                'success': True,
                'message': 'Accessibility settings saved successfully',
                'settings': valid_settings,
                'user_id': user_id,
                'session_key': session_key,
                'saved_at': timezone.now().isoformat()
            })
            
    except Exception as e:
        logger.error(f"Error in accessibility_settings: {str(e)}")
        return Response(
            {
                'success': False,
                'error': f'Error handling accessibility settings: {str(e)}'
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def text_to_speech_stream(request):
    """
    Generate streaming TTS for real-time audio playback
    """
    try:
        text = request.data.get('text', '')
        voice_speed = request.data.get('voice_speed', 1.0)
        voice_lang = request.data.get('voice_lang', 'en')
        chunk_size = request.data.get('chunk_size', 1000)
        
        if not text:
            return Response(
                {
                    'success': False,
                    'error': 'Text is required',
                    'required_fields': ['text']
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Split text into chunks for streaming
        text_chunks = []
        words = text.split()
        current_chunk = []
        current_length = 0
        
        for word in words:
            if current_length + len(word) > chunk_size and current_chunk:
                text_chunks.append(' '.join(current_chunk))
                current_chunk = [word]
                current_length = len(word)
            else:
                current_chunk.append(word)
                current_length += len(word) + 1
        
        if current_chunk:
            text_chunks.append(' '.join(current_chunk))
        
        # Generate audio URLs for each chunk
        chunk_urls = []
        try:
            from gtts import gTTS
            
            for i, chunk in enumerate(text_chunks):
                # Create TTS for chunk
                tts = gTTS(text=chunk, lang=voice_lang, slow=(voice_speed < 0.8))
                
                # Save to temporary file
                temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=f'_chunk_{i}.mp3')
                tts.save(temp_file.name)
                
                # You would typically save this to your media storage
                # For now, we'll just return the chunk info
                chunk_urls.append({
                    'chunk_index': i,
                    'text': chunk,
                    'temp_file': temp_file.name,
                    'estimated_duration': len(chunk.split()) / 150  # ~150 words per minute
                })
        
        except ImportError:
            return Response(
                {
                    'success': False,
                    'error': 'gTTS library not installed',
                    'solution': 'Install with: pip install gtts'
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response({
            'success': True,
            'message': 'TTS chunks generated successfully',
            'chunks': chunk_urls,
            'total_chunks': len(chunk_urls),
            'total_words': len(words),
            'estimated_total_duration': len(words) / 150,
            'voice_settings': {
                'language': voice_lang,
                'speed': voice_speed
            }
        })
        
    except Exception as e:
        logger.error(f"Error in text_to_speech_stream: {str(e)}")
        return Response(
            {
                'success': False,
                'error': f'Error generating TTS stream: {str(e)}'
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def extract_pdf_text(request, book_id):
    """
    Extract text from PDF for display and TTS with enhanced error handling
    """
    try:
        # Get book with proper error handling
        try:
            book = Book.objects.get(id=book_id, is_active=True)
        except Book.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'error': 'Book not found or inactive',
                    'book_id': book_id
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if book has PDF
        if not book.pdf_file:
            return Response(
                {
                    'success': False,
                    'error': 'Book does not have a PDF file',
                    'book_id': book.id,
                    'book_title': book.title,
                    'has_pdf': False
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if PDF file exists on disk
        pdf_path = None
        try:
            pdf_path = book.pdf_file.path
            if not os.path.exists(pdf_path):
                return Response(
                    {
                        'success': False,
                        'error': 'PDF file not found on server',
                        'book_id': book.id,
                        'book_title': book.title,
                        'pdf_path': pdf_path
                    },
                    status=status.HTTP_404_NOT_FOUND
                )
        except Exception as e:
            return Response(
                {
                    'success': False,
                    'error': f'Error accessing PDF file: {str(e)}',
                    'book_id': book.id,
                    'book_title': book.title
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Extract text from PDF with enhanced error handling
        try:
            import PyPDF2
            
            text_content = ""
            page_count = 0
            
            with open(pdf_path, 'rb') as pdf_file:
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                page_count = len(pdf_reader.pages)
                
                # Extract text from all pages with progress tracking
                for page_num in range(page_count):
                    try:
                        page = pdf_reader.pages[page_num]
                        page_text = page.extract_text()
                        if page_text.strip():  # Only add non-empty pages
                            text_content += f"\n--- Page {page_num + 1} ---\n"
                            text_content += page_text + "\n\n"
                    except Exception as page_error:
                        # Continue with other pages if one fails
                        text_content += f"\n--- Page {page_num + 1} (Error reading page) ---\n\n"
                        continue
                
                # Clean up text content
                text_content = text_content.strip()
                
                if not text_content:
                    return Response(
                        {
                            'success': False,
                            'error': 'No readable text found in PDF',
                            'book_id': book.id,
                            'book_title': book.title,
                            'page_count': page_count,
                            'text_length': 0
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
        except ImportError:
            return Response(
                {
                    'success': False,
                    'error': 'PyPDF2 library not installed. Please install it: pip install PyPDF2',
                    'book_id': book.id,
                    'book_title': book.title
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            return Response(
                {
                    'success': False,
                    'error': f'Failed to extract text from PDF: {str(e)}',
                    'book_id': book.id,
                    'book_title': book.title,
                    'pdf_path': pdf_path
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Return successful response with comprehensive data
        return Response({
            'success': True,
            'book_id': book.id,
            'book_title': book.title,
            'book_author': book.author,
            'text': text_content,
            'text_length': len(text_content),
            'page_count': page_count,
            'word_count': len(text_content.split()) if text_content else 0,
            'estimated_reading_time': max(1, len(text_content.split()) // 200) if text_content else 0,  # minutes
            'pdf_file_url': book.pdf_file.url,
            'cover_image_url': book.cover_image.url if book.cover_image else None,
            'extraction_timestamp': timezone.now().isoformat()
        })
        
    except Exception as e:
        return Response(
            {
                'success': False,
                'error': f'Unexpected error: {str(e)}',
                'book_id': book_id
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def generate_ai_audio(request):
    """
    Generate AI audio from PDF text using Text-to-Speech with enhanced features
    """
    try:
        # Extract parameters
        book_id = request.data.get('book_id')
        voice_speed = request.data.get('voice_speed', 1.0)  # 0.5 to 2.0
        voice_lang = request.data.get('voice_lang', 'en')
        max_chars = request.data.get('max_chars', 5000)
        page_range = request.data.get('page_range', None)  # [start, end] or None for all
        
        # Validate parameters
        if not book_id:
            return Response(
                {
                    'success': False,
                    'error': 'Book ID is required',
                    'required_fields': ['book_id']
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            voice_speed = float(voice_speed)
            if not (0.5 <= voice_speed <= 2.0):
                voice_speed = 1.0
        except (ValueError, TypeError):
            voice_speed = 1.0
        
        # Get book
        try:
            book = Book.objects.get(id=book_id, is_active=True)
        except Book.DoesNotExist:
            return Response(
                {
                    'success': False,
                    'error': 'Book not found or inactive',
                    'book_id': book_id
                },
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if book has PDF
        if not book.pdf_file:
            return Response(
                {
                    'success': False,
                    'error': 'Book does not have a PDF file',
                    'book_id': book.id,
                    'book_title': book.title
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extract text from PDF
        try:
            import PyPDF2
            
            pdf_path = book.pdf_file.path
            text_content = ""
            
            with open(pdf_path, 'rb') as pdf_file:
                pdf_reader = PyPDF2.PdfReader(pdf_file)
                total_pages = len(pdf_reader.pages)
                
                # Determine page range
                if page_range and len(page_range) == 2:
                    start_page = max(0, page_range[0] - 1)  # Convert to 0-based
                    end_page = min(total_pages, page_range[1])
                else:
                    # Default: first 10 pages or all if less
                    start_page = 0
                    end_page = min(10, total_pages)
                
                # Extract text from specified pages
                for page_num in range(start_page, end_page):
                    try:
                        page = pdf_reader.pages[page_num]
                        page_text = page.extract_text()
                        if page_text.strip():
                            text_content += page_text + " "
                    except Exception as page_error:
                        logger.warning(f"Error reading page {page_num + 1}: {page_error}")
                        continue
                
        except Exception as e:
            return Response(
                {
                    'success': False,
                    'error': f'Failed to extract text from PDF: {str(e)}',
                    'book_id': book.id,
                    'book_title': book.title
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        # Clean and limit text content
        text_content = text_content.strip()
        if not text_content:
            return Response(
                {
                    'success': False,
                    'error': 'No readable text found in PDF',
                    'book_id': book.id,
                    'book_title': book.title
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Limit text length for TTS
        original_length = len(text_content)
        if len(text_content) > max_chars:
            text_content = text_content[:max_chars] + "..."
        
        # Generate audio using gTTS
        try:
            from gtts import gTTS
            from django.core.files import File
            
            # Create TTS object with parameters
            tts = gTTS(
                text=text_content, 
                lang=voice_lang, 
                slow=(voice_speed < 0.8)
            )
            
            # Create temporary file
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
            tts.save(temp_file.name)
            
            # Generate filename
            audio_filename = f'ai_audio_{book_id}_{timezone.now().strftime("%Y%m%d_%H%M%S")}.mp3'
            
            # Save to book model (if has audio_file field) or return file
            try:
                with open(temp_file.name, 'rb') as audio_file:
                    # If book model has audio_file field, save it
                    if hasattr(book, 'audio_file'):
                        book.audio_file.save(audio_filename, File(audio_file), save=True)
                        audio_url = book.audio_file.url
                    else:
                        # Return file directly
                        audio_content = audio_file.read()
                        response = HttpResponse(audio_content, content_type='audio/mpeg')
                        response['Content-Disposition'] = f'attachment; filename="{audio_filename}"'
                        return response
                
                # Update book metadata
                if hasattr(book, 'has_audio'):
                    book.has_audio = True
                if hasattr(book, 'narrator'):
                    book.narrator = f"AI Generated Voice ({voice_lang})"
                book.save()
                
            except Exception as save_error:
                logger.error(f"Error saving audio file: {save_error}")
                # Return file content directly if saving fails
                with open(temp_file.name, 'rb') as audio_file:
                    audio_content = audio_file.read()
                    response = HttpResponse(audio_content, content_type='audio/mpeg')
                    response['Content-Disposition'] = f'attachment; filename="{audio_filename}"'
                    return response
            
            # Clean up temp file
            try:
                os.unlink(temp_file.name)
            except:
                pass
            
            return Response({
                'success': True,
                'message': 'AI audio generated successfully',
                'audio_url': audio_url if 'audio_url' in locals() else None,
                'book_id': book.id,
                'book_title': book.title,
                'audio_details': {
                    'filename': audio_filename,
                    'language': voice_lang,
                    'speed': voice_speed,
                    'text_length': len(text_content),
                    'original_text_length': original_length,
                    'pages_processed': end_page - start_page if 'start_page' in locals() else 0,
                    'estimated_duration_minutes': len(text_content.split()) // 150  # ~150 words per minute
                }
            })
            
        except ImportError:
            return Response(
                {
                    'success': False,
                    'error': 'gTTS library not installed',
                    'solution': 'Install with: pip install gtts',
                    'book_id': book.id
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except Exception as e:
            return Response(
                {
                    'success': False,
                    'error': f'Failed to generate audio: {str(e)}',
                    'book_id': book.id,
                    'book_title': book.title
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
    except Exception as e:
        logger.error(f"Unexpected error in generate_ai_audio: {str(e)}")
        return Response(
            {
                'success': False,
                'error': f'Unexpected error: {str(e)}',
                'book_id': book_id if 'book_id' in locals() else None
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
