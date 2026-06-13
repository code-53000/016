from rest_framework import serializers
from .models import ToneTrial


class ToneTrialSerializer(serializers.ModelSerializer):
    guqin_name = serializers.CharField(source="guqin.name", read_only=True)
    san_rating_display = serializers.CharField(
        source="get_san_rating_display", read_only=True, default=None
    )
    an_rating_display = serializers.CharField(
        source="get_an_rating_display", read_only=True, default=None
    )
    fan_rating_display = serializers.CharField(
        source="get_fan_rating_display", read_only=True, default=None
    )
    overall_rating_display = serializers.CharField(
        source="get_overall_rating_display", read_only=True, default=None
    )

    class Meta:
        model = ToneTrial
        fields = [
            "id", "guqin", "guqin_name", "trial_date",
            "san_rating", "san_rating_display",
            "an_rating", "an_rating_display",
            "fan_rating", "fan_rating_display",
            "noise_description", "overall_rating", "overall_rating_display",
            "tester", "notes", "created_at",
        ]
