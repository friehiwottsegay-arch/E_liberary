"""
Health check endpoint for Render
"""
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET"])
def health_check(request):
    """Simple health check endpoint"""
    return JsonResponse({
        'status': 'healthy',
        'service': 'elibrary-backend',
        'version': '1.0.0'
    })
