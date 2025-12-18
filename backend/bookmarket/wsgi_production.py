"""
WSGI config for production deployment on Render
"""
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'bookmarket.settings_production')

application = get_wsgi_application()
