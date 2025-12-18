from django.contrib import admin
from .models import AboutUs, Book, Project, SignWord, Subject, Questions, BookCatagory, SubBookCategory, Quiz, QCategory, TeamMember, User, Seller, Order, OrderItem, Inventory, SellerAnalytics
# Register your models here.
from .forms import QuestionsForm
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class QuestionsAdmin(admin.ModelAdmin):
    form = QuestionsForm
    list_display = ['subject', 'question_text']

class SellerAdmin(admin.ModelAdmin):
    list_display = ['user', 'business_name', 'business_type', 'is_verified', 'created_at']
    list_filter = ['is_verified', 'business_type', 'created_at']
    search_fields = ['user__username', 'business_name', 'business_type']
    readonly_fields = ['created_at']

class OrderAdmin(admin.ModelAdmin):
    list_display = ['order_number', 'customer', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['order_number', 'customer__username']
    readonly_fields = ['created_at', 'updated_at']

class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'book', 'quantity', 'price', 'book_type']
    list_filter = ['book_type']
    search_fields = ['order__order_number', 'book__title']

class InventoryAdmin(admin.ModelAdmin):
    list_display = ['book', 'hard_stock', 'soft_stock', 'total_stock', 'is_low_stock', 'last_updated']
    list_filter = ['last_updated']
    search_fields = ['book__title']
    readonly_fields = ['last_updated']

class SellerAnalyticsAdmin(admin.ModelAdmin):
    list_display = ['seller', 'total_sales', 'total_orders', 'total_books_sold', 'average_rating', 'last_updated']
    readonly_fields = ['last_updated']

admin.site.register(Questions, QuestionsAdmin)
admin.site.register(Seller, SellerAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem, OrderItemAdmin)
admin.site.register(Inventory, InventoryAdmin)
admin.site.register(SellerAnalytics, SellerAnalyticsAdmin)

admin.site.register(Book)
admin.site.register(Subject)
admin.site.register(BookCatagory)
admin.site.register(SubBookCategory)
admin.site.register(Quiz)
admin.site.register(Project)
admin.site.register(QCategory)
admin.site.register(SignWord)
admin.site.register(AboutUs)
admin.site.register(TeamMember)
admin.site.register(User)

