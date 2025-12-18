"""
Simple Seller API - One URL and One Model
Using existing models with minimal seller functionality
"""

from django.urls import path
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models import Q, Count, Sum
from .models import User, Book
from .serializers import BookSerializer
import json

# Simple Seller Model (in models.py)
# You can add this to your existing models.py:
# 
# class Seller(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='seller')
#     business_name = models.CharField(max_length=200, blank=True, null=True)
#     business_type = models.CharField(max_length=50, blank=True, null=True)
#     is_verified = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)
#     
#     def __str__(self):
#         return self.business_name or f"Seller {self.user.username}"

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def seller_dashboard(request):
    """
    Single Seller API Endpoint
    GET: Get seller dashboard data
    POST: Update seller information
    """
    user = request.user
    
    if request.method == 'GET':
        # Get seller's books
        my_books = Book.objects.filter(created_by=user)
        
        # Get seller's orders
        my_orders = Order.objects.filter(items__book__created_by=user).distinct()

        # Calculate basic stats
        total_books = my_books.count()
        total_orders = my_orders.count()
        total_revenue = my_orders.aggregate(
            total=Sum('total_amount')
        )['total'] or 0
        
        data = {
            'seller_info': {
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'business_name': getattr(user.seller, 'business_name', '') if hasattr(user, 'seller') else '',
                'business_type': getattr(user.seller, 'business_type', '') if hasattr(user, 'seller') else '',
                'is_verified': getattr(user.seller, 'is_verified', False) if hasattr(user, 'seller') else False,
            },
            'stats': {
                'total_books': total_books,
                'total_orders': total_orders,
                'total_revenue': float(total_revenue),
                'pending_orders': my_orders.filter(status='pending').count(),
                'completed_orders': my_orders.filter(status='completed').count(),
            },
            'recent_books': BookSerializer(my_books.order_by('-created_at')[:5], many=True).data,
            'recent_orders': [
                {
                    'id': order.id,
                    'order_number': order.order_number,
                    'customer': order.customer.username,
                    'status': order.status,
                    'total_amount': float(order.total_amount),
                    'created_at': order.created_at.isoformat(),
                }
                for order in my_orders.order_by('-created_at')[:5]
            ]
        }
        
        return Response(data)
    
    elif request.method == 'POST':
        # Update seller info
        business_name = request.data.get('business_name', '')
        business_type = request.data.get('business_type', '')
        
        # Create or update seller profile
        if hasattr(user, 'seller'):
            seller = user.seller
        else:
            from .models import Seller
            seller = Seller.objects.create(user=user)
        
        seller.business_name = business_name
        seller.business_type = business_type
        seller.save()
        
        return Response({
            'message': 'Seller information updated successfully',
            'seller': {
                'business_name': seller.business_name,
                'business_type': seller.business_type,
                'is_verified': seller.is_verified,
            }
        })

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def seller_books(request):
    """
    Seller Books Management
    GET: List seller's books
    POST: Add new book
    """
    user = request.user
    
    if request.method == 'GET':
        # Get all books by this seller
        books = Book.objects.filter(created_by=user)
        serializer = BookSerializer(books, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        # Create new book
        book_data = request.data.copy()
        book_data['created_by'] = user.id
        
        serializer = BookSerializer(data=book_data)
        if serializer.is_valid():
            book = serializer.save()
            return Response({
                'message': 'Book created successfully',
                'book': BookSerializer(book).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def seller_orders(request):
    """
    Seller Orders Management
    GET: List seller's orders
    """
    user = request.user

    # Get orders for books sold by this seller
    orders = Order.objects.filter(items__book__created_by=user).distinct().order_by('-created_at')

    orders_data = []
    for order in orders:
        order_items = OrderItem.objects.filter(order=order, book__created_by=user)
        orders_data.append({
            'id': order.id,
            'order_number': order.order_number,
            'customer': order.customer.username,
            'status': order.status,
            'total_amount': float(order.total_amount),
            'created_at': order.created_at.isoformat(),
            'items': [
                {
                    'book_title': item.book.title,
                    'quantity': item.quantity,
                    'price': float(item.price),
                    'book_type': item.book_type,
                }
                for item in order_items
            ]
        })

    return Response(orders_data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def seller_inventory(request):
    """
    Seller Inventory Management
    GET: List inventory for seller's books
    POST: Update inventory
    """
    user = request.user

    if request.method == 'GET':
        # Get inventory for seller's books
        inventories = Inventory.objects.filter(book__created_by=user)
        inventory_data = []

        for inv in inventories:
            inventory_data.append({
                'book_id': inv.book.id,
                'book_title': inv.book.title,
                'hard_stock': inv.hard_stock,
                'soft_stock': inv.soft_stock,
                'total_stock': inv.total_stock,
                'is_low_stock': inv.is_low_stock,
                'last_updated': inv.last_updated.isoformat(),
            })

        return Response(inventory_data)

    elif request.method == 'POST':
        book_id = request.data.get('book_id')
        hard_stock = request.data.get('hard_stock', 0)
        soft_stock = request.data.get('soft_stock', 0)

        try:
            inventory = Inventory.objects.get(book_id=book_id, book__created_by=user)
            inventory.hard_stock = hard_stock
            inventory.soft_stock = soft_stock
            inventory.save()

            return Response({
                'message': 'Inventory updated successfully',
                'inventory': {
                    'book_id': inventory.book.id,
                    'book_title': inventory.book.title,
                    'hard_stock': inventory.hard_stock,
                    'soft_stock': inventory.soft_stock,
                    'total_stock': inventory.total_stock,
                    'is_low_stock': inventory.is_low_stock,
                }
            })
        except Inventory.DoesNotExist:
            return Response({'error': 'Inventory not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def seller_analytics(request):
    """
    Seller Analytics
    GET: Get seller analytics data
    """
    user = request.user

    try:
        analytics = SellerAnalytics.objects.get(seller__user=user)

        data = {
            'total_sales': float(analytics.total_sales),
            'total_orders': analytics.total_orders,
            'total_books_sold': analytics.total_books_sold,
            'average_rating': analytics.average_rating,
            'last_updated': analytics.last_updated.isoformat(),
        }

        return Response(data)
    except SellerAnalytics.DoesNotExist:
        return Response({
            'total_sales': 0,
            'total_orders': 0,
            'total_books_sold': 0,
            'average_rating': 0,
            'last_updated': None,
        })