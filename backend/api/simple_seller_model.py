"""
Simple Seller Implementation - One Model, One URL
Clean integration with existing models
"""

# Add this to your existing backend/api/models.py at the end:

class Seller(models.Model):
    """Simple seller model - one model approach"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='seller')
    business_name = models.CharField(max_length=200, blank=True, null=True)
    business_type = models.CharField(max_length=50, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.business_name or f"Seller {self.user.username}"

# Add this to your existing admin.py:

from .models import Seller

class SellerAdmin(admin.ModelAdmin):
    list_display = ['user', 'business_name', 'business_type', 'is_verified', 'created_at']
    list_filter = ['is_verified', 'business_type']
    search_fields = ['user__username', 'business_name']

admin.site.register(Seller, SellerAdmin)