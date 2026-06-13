from django.db import models
from processes.models import Guqin


class WoodBlank(models.Model):
    WOOD_TYPE_CHOICES = [
        ("paulownia", "桐木"),
        ("fir", "杉木"),
        ("other", "其他"),
    ]
    DRYING_STATUS_CHOICES = [
        ("natural", "自然阴干"),
        ("kiln", "烘房干燥"),
        ("ready", "阴干完成"),
    ]

    batch_number = models.CharField(max_length=50, unique=True, verbose_name="批次号")
    source = models.CharField(max_length=200, verbose_name="来源")
    wood_type = models.CharField(
        max_length=20, choices=WOOD_TYPE_CHOICES, default="paulownia", verbose_name="木材类型"
    )
    drying_status = models.CharField(
        max_length=20, choices=DRYING_STATUS_CHOICES, default="natural", verbose_name="阴干状态"
    )
    received_at = models.DateField(verbose_name="入库日期")
    notes = models.TextField(blank=True, default="", verbose_name="备注")
    guqin = models.OneToOneField(
        Guqin, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="wood_blank", verbose_name="关联琴"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        verbose_name = "木坯"
        verbose_name_plural = "木坯"
        ordering = ["-received_at"]

    def __str__(self):
        return f"{self.batch_number}（{self.get_wood_type_display()}）"


class LacquerRecord(models.Model):
    LACQUER_TYPE_CHOICES = [
        ("raw", "生漆"),
        ("refined", "熟漆"),
        ("mix", "调配漆"),
    ]

    guqin = models.ForeignKey(
        Guqin, on_delete=models.CASCADE, related_name="lacquer_records", verbose_name="琴"
    )
    coat_number = models.PositiveIntegerField(verbose_name="第几遍漆")
    lacquer_type = models.CharField(
        max_length=20, choices=LACQUER_TYPE_CHOICES, default="raw", verbose_name="漆料类型"
    )
    applied_at = models.DateField(verbose_name="涂漆日期")
    dried_at = models.DateField(null=True, blank=True, verbose_name="干透日期")
    notes = models.TextField(blank=True, default="", verbose_name="备注")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        verbose_name = "髹漆记录"
        verbose_name_plural = "髹漆记录"
        ordering = ["-applied_at"]
        unique_together = ["guqin", "coat_number"]

    def __str__(self):
        return f"{self.guqin.name} - 第{self.coat_number}遍"
