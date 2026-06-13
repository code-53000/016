from django.db import models
from processes.models import Guqin


class ToneTrial(models.Model):
    RATING_CHOICES = [
        (1, "差"),
        (2, "一般"),
        (3, "良好"),
        (4, "优秀"),
        (5, "绝佳"),
    ]

    guqin = models.ForeignKey(
        Guqin, on_delete=models.CASCADE, related_name="tone_trials", verbose_name="琴"
    )
    trial_date = models.DateField(verbose_name="试音日期")
    san_rating = models.IntegerField(
        choices=RATING_CHOICES, null=True, blank=True, verbose_name="散音评分"
    )
    an_rating = models.IntegerField(
        choices=RATING_CHOICES, null=True, blank=True, verbose_name="按音评分"
    )
    fan_rating = models.IntegerField(
        choices=RATING_CHOICES, null=True, blank=True, verbose_name="泛音评分"
    )
    noise_description = models.TextField(blank=True, default="", verbose_name="杂音描述")
    overall_rating = models.IntegerField(
        choices=RATING_CHOICES, null=True, blank=True, verbose_name="整体评分"
    )
    tester = models.CharField(max_length=50, blank=True, default="", verbose_name="试音人")
    notes = models.TextField(blank=True, default="", verbose_name="备注")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        verbose_name = "试音记录"
        verbose_name_plural = "试音记录"
        ordering = ["-trial_date"]

    def __str__(self):
        return f"{self.guqin.name} - {self.trial_date}"
