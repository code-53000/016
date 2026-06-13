from django.contrib import admin
from .models import Guqin, ProcessStage


@admin.register(Guqin)
class GuqinAdmin(admin.ModelAdmin):
    list_display = ["name", "serial_number", "current_stage", "created_at"]
    list_filter = ["current_stage"]


@admin.register(ProcessStage)
class ProcessStageAdmin(admin.ModelAdmin):
    list_display = ["guqin", "stage", "started_at", "completed_at", "operator"]
    list_filter = ["stage"]
