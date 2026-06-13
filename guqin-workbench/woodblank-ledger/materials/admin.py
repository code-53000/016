from django.contrib import admin
from .models import WoodBlank, LacquerRecord


@admin.register(WoodBlank)
class WoodBlankAdmin(admin.ModelAdmin):
    list_display = ["batch_number", "source", "wood_type", "drying_status", "received_at", "guqin"]
    list_filter = ["wood_type", "drying_status"]


@admin.register(LacquerRecord)
class LacquerRecordAdmin(admin.ModelAdmin):
    list_display = ["guqin", "coat_number", "lacquer_type", "applied_at", "dried_at"]
    list_filter = ["lacquer_type"]
