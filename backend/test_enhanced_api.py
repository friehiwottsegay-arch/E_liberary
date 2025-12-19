"""
Comprehensive test script for enhanced audiobook API with accessibility features
"""
import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000/api"

def test_enhanced_pdf_extraction():
    """Test enhanced PDF text extraction"""
    print("\n" + "="*60)
    print("Testing Enhanced PDF Text Extraction")
    print("="*60)
    
    # Test with a valid book ID (Emma = 33)
    book_id = 33
    
    try:
        response = requests.get(f"{BASE_URL}/audiobooks/extract-text/{book_id}/", timeout=30)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: {data.get('success')}")
            print(f"📚 Book: {data.get('book_title')} by {data.get('book_author')}")
            print(f"📄 Pages: {data.get('page_count')}")
            print(f"📝 Text Length: {data.get('text_length'):,} characters")
            print(f"📊 Word Count: {data.get('word_count'):,} words")
            print(f"⏱️ Est. Reading Time: {data.get('estimated_reading_time')} minutes")
            print(f"🔗 PDF URL: {data.get('pdf_file_url')}")
            print(f"🖼️ Cover URL: {data.get('cover_image_url')}")
            
            # Show text preview
            text = data.get('text', '')
            if text:
                print(f"\n📖 Text Preview (first 200 chars):")
                print(f"'{text[:200]}...'")
        else:
            data = response.json()
            print(f"❌ Failed: {data.get('error')}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def test_ai_audio_generation():
    """Test enhanced AI audio generation"""
    print("\n" + "="*60)
    print("Testing Enhanced AI Audio Generation")
    print("="*60)
    
    # Test parameters
    test_data = {
        'book_id': 33,  # Emma
        'voice_speed': 1.2,
        'voice_lang': 'en',
        'max_chars': 2000,
        'page_range': [1, 3]  # First 3 pages
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/audiobooks/generate-audio/", 
            json=test_data,
            timeout=60
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: {data.get('success')}")
            print(f"📚 Book: {data.get('book_title')}")
            print(f"🎵 Audio URL: {data.get('audio_url')}")
            
            audio_details = data.get('audio_details', {})
            print(f"\n🎧 Audio Details:")
            print(f"  📁 Filename: {audio_details.get('filename')}")
            print(f"  🌍 Language: {audio_details.get('language')}")
            print(f"  ⚡ Speed: {audio_details.get('speed')}")
            print(f"  📝 Text Length: {audio_details.get('text_length'):,} chars")
            print(f"  📄 Pages Processed: {audio_details.get('pages_processed')}")
            print(f"  ⏱️ Est. Duration: {audio_details.get('estimated_duration_minutes')} minutes")
        else:
            data = response.json()
            print(f"❌ Failed: {data.get('error')}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def test_accessibility_settings():
    """Test accessibility settings API"""
    print("\n" + "="*60)
    print("Testing Accessibility Settings API")
    print("="*60)
    
    # Test GET (retrieve settings)
    try:
        response = requests.get(f"{BASE_URL}/accessibility/settings/", timeout=10)
        print(f"GET Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ GET Success: {data.get('success')}")
            settings = data.get('settings', {})
            print(f"📋 Default Settings:")
            for key, value in settings.items():
                print(f"  {key}: {value}")
        else:
            print(f"❌ GET Failed: {response.text}")
            
    except Exception as e:
        print(f"❌ GET Error: {e}")
    
    # Test POST (save settings)
    test_settings = {
        'settings': {
            'screen_reader_enabled': True,
            'high_contrast': True,
            'large_text': False,
            'font_size': 20,
            'voice_speed': 1.5,
            'voice_language': 'en'
        }
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/accessibility/settings/", 
            json=test_settings,
            timeout=10
        )
        print(f"\nPOST Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ POST Success: {data.get('success')}")
            print(f"💾 Message: {data.get('message')}")
            saved_settings = data.get('settings', {})
            print(f"📋 Saved Settings:")
            for key, value in saved_settings.items():
                print(f"  {key}: {value}")
        else:
            print(f"❌ POST Failed: {response.text}")
            
    except Exception as e:
        print(f"❌ POST Error: {e}")

def test_tts_streaming():
    """Test TTS streaming API"""
    print("\n" + "="*60)
    print("Testing TTS Streaming API")
    print("="*60)
    
    test_data = {
        'text': "This is a test of the text-to-speech streaming functionality. It should break this text into smaller chunks for better performance and user experience.",
        'voice_speed': 1.0,
        'voice_lang': 'en',
        'chunk_size': 50
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/accessibility/tts-stream/", 
            json=test_data,
            timeout=30
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: {data.get('success')}")
            print(f"📝 Message: {data.get('message')}")
            print(f"🔢 Total Chunks: {data.get('total_chunks')}")
            print(f"📊 Total Words: {data.get('total_words')}")
            print(f"⏱️ Est. Duration: {data.get('estimated_total_duration'):.1f} minutes")
            
            chunks = data.get('chunks', [])
            print(f"\n📦 Chunks Preview:")
            for chunk in chunks[:3]:  # Show first 3 chunks
                print(f"  Chunk {chunk.get('chunk_index')}: '{chunk.get('text')[:50]}...'")
                print(f"    Duration: {chunk.get('estimated_duration'):.1f} min")
        else:
            data = response.json()
            print(f"❌ Failed: {data.get('error')}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def test_voice_recording():
    """Test voice recording save API"""
    print("\n" + "="*60)
    print("Testing Voice Recording API")
    print("="*60)
    
    # Create a dummy audio file for testing
    import tempfile
    import os
    
    # Create a small dummy file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as temp_file:
        temp_file.write(b'dummy audio content for testing')
        temp_file_path = temp_file.name
    
    try:
        with open(temp_file_path, 'rb') as audio_file:
            files = {'audio_file': ('test_recording.webm', audio_file, 'audio/webm')}
            data = {
                'book_id': 33,
                'note_text': 'This is a test voice note',
                'page_number': 5,
                'timestamp': int(time.time())
            }
            
            response = requests.post(
                f"{BASE_URL}/audiobooks/save-recording/", 
                files=files,
                data=data,
                timeout=30
            )
            
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success: {data.get('success')}")
            print(f"💾 Message: {data.get('message')}")
            
            recording = data.get('recording', {})
            print(f"\n🎤 Recording Details:")
            print(f"  📁 ID: {recording.get('recording_id')}")
            print(f"  📚 Book: {recording.get('book_title')}")
            print(f"  📄 Page: {recording.get('page_number')}")
            print(f"  📝 Note: {recording.get('note_text')}")
            print(f"  📁 Filename: {recording.get('filename')}")
            print(f"  📊 File Size: {recording.get('file_size')} bytes")
            print(f"  🔗 URL: {recording.get('file_url')}")
        else:
            data = response.json()
            print(f"❌ Failed: {data.get('error')}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        # Clean up temp file
        try:
            os.unlink(temp_file_path)
        except:
            pass

def test_book_detail():
    """Test enhanced book detail API"""
    print("\n" + "="*60)
    print("Testing Enhanced Book Detail API")
    print("="*60)
    
    book_id = 33  # Emma
    
    try:
        response = requests.get(f"{BASE_URL}/audiobooks/{book_id}/", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Success!")
            print(f"📚 Title: {data.get('title')}")
            print(f"✍️ Author: {data.get('author')}")
            print(f"📖 Description: {data.get('description', '')[:100]}...")
            print(f"🏷️ Category: {data.get('category_name')}")
            print(f"📄 Pages: {data.get('page_count')}")
            print(f"🌍 Language: {data.get('language')}")
            print(f"⭐ Rating: {data.get('rating')}")
            print(f"💰 Price: ${data.get('price')}")
            print(f"🆓 Free: {data.get('is_free')}")
            print(f"🔗 PDF URL: {data.get('pdf_file_url')}")
            print(f"🖼️ Cover URL: {data.get('cover_image_url')}")
            
            # Show price breakdown
            price_by_type = data.get('price_by_type', {})
            print(f"\n💰 Price Breakdown:")
            for book_type, details in price_by_type.items():
                print(f"  {book_type.title()}: ${details.get('price')} (Available: {details.get('available')})")
        else:
            print(f"❌ Failed: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def run_all_tests():
    """Run all API tests"""
    print("\n🧪 COMPREHENSIVE API TESTING")
    print("="*80)
    print("Testing enhanced Django backend with accessibility features")
    print("="*80)
    
    # Run all tests
    test_book_detail()
    test_enhanced_pdf_extraction()
    test_ai_audio_generation()
    test_accessibility_settings()
    test_tts_streaming()
    test_voice_recording()
    
    print("\n" + "="*80)
    print("🎉 ALL TESTS COMPLETED!")
    print("="*80)
    print("\nIf all tests passed, your Django backend is working properly with:")
    print("✅ Enhanced PDF text extraction")
    print("✅ AI audio generation with parameters")
    print("✅ Accessibility settings management")
    print("✅ TTS streaming for real-time audio")
    print("✅ Voice recording storage")
    print("✅ Comprehensive error handling")
    print("✅ Detailed API responses")
    print("="*80)

if __name__ == "__main__":
    run_all_tests()