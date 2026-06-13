from rest_framework import serializers
from .models import Guqin, ProcessStage


class ProcessStageSerializer(serializers.ModelSerializer):
    stage_display = serializers.CharField(source="get_stage_display", read_only=True)

    class Meta:
        model = ProcessStage
        fields = [
            "id", "guqin", "stage", "stage_display",
            "started_at", "completed_at", "notes", "operator",
        ]


class GuqinSerializer(serializers.ModelSerializer):
    stages = ProcessStageSerializer(many=True, read_only=True)
    current_stage_display = serializers.CharField(
        source="get_current_stage_display", read_only=True
    )

    class Meta:
        model = Guqin
        fields = [
            "id", "name", "serial_number", "current_stage",
            "current_stage_display", "stages", "created_at", "updated_at",
        ]


class GuqinBriefSerializer(serializers.ModelSerializer):
    current_stage_display = serializers.CharField(
        source="get_current_stage_display", read_only=True
    )

    class Meta:
        model = Guqin
        fields = ["id", "name", "serial_number", "current_stage", "current_stage_display"]
