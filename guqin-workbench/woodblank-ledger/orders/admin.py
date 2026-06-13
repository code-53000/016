from django.contrib import admin
from .models import Customer, Order


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ["name", "phone", "created_at"]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "guqin", "customer", "status", "reserved_at",
        "deposit_amount", "total_amount", "delivered_at",
    ]
    list_filter = ["status"]
