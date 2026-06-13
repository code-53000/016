from rest_framework import serializers
from .models import WoodBlank, LacquerRecord


class WoodBlankSerializer(serializers.ModelSerializer):
    wood_type_display = serializers.CharField(source="get_wood_type_display", read_only=True)
    drying_status_display = serializers.CharField(
        source="get_drying_status_display", read_only=True
    )
    guqin_name = serializers.CharField(source="guqin.name", read_only=True, default=None)

    class Meta:
        model = WoodBlank
        fields = [
            "id", "batch_number", "source", "wood_type", "wood_type_display",
            "drying_status", "drying_status_display", "received_at",
            "notes", "guqin", "guqin_name", "created_at",
        ]


class LacquerRecordSerializer(serializers.ModelSerializer):
    lacquer_type_display = serializers.CharField(
        source="get_lacquer_type_display", read_only=True
    )
    guqin_name = serializers.CharField(source="guqin.name", read_only=True)

    class Meta:
        model = LacquerRecord
        fields = [
            "id", "guqin", "guqin_name", "coat_number", "lacquer_type",
            "lacquer_type_display", "applied_at", "dried_at", "notes", "created_at",
        ]
