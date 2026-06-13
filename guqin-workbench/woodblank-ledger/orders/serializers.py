from rest_framework import serializers
from .models import Customer, Order


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ["id", "name", "phone", "address", "notes", "created_at"]


class OrderSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source="customer.name", read_only=True)
    guqin_name = serializers.CharField(source="guqin.name", read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "guqin", "guqin_name", "customer", "customer_name",
            "status", "status_display", "reserved_at",
            "deposit_amount", "total_amount", "delivered_at",
            "settled_at", "notes", "created_at", "updated_at",
        ]
