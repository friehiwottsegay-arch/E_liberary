# Simplified Seller Model (add to existing models.py)
# This enhances the existing User model with basic seller fields

class Seller(models.Model):
    """Simple seller model - one model approach"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='seller_profile')
    business_name = models.CharField(max_length=200, blank=True, null=True)
    business_type = models.CharField(max_length=50, blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.business_name or f"Seller {self.user.username}"