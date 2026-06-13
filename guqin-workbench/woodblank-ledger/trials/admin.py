from django.contrib import admin
from .models import ToneTrial


@admin.register(ToneTrial)
class ToneTrialAdmin(admin.ModelAdmin):
    list_display = [
        "guqin", "trial_date", "san_rating", "an_rating",
        "fan_rating", "overall_rating", "tester",
    ]
    list_filter = ["overall_rating", "tester"]
