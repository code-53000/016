from django.db import models


class Guqin(models.Model):
    STAGE_CHOICES = [
        ("drying", "木坯阴干"),
        ("grooving", "开槽"),
        ("assembling", "合琴"),
        ("lacquering", "髹漆"),
        ("trial", "试音"),
        ("finished", "完工"),
    ]

    name = models.CharField(max_length=100, verbose_name="琴名")
    serial_number = models.CharField(max_length=50, unique=True, verbose_name="编号")
    current_stage = models.CharField(
        max_length=20, choices=STAGE_CHOICES, default="drying", verbose_name="当前工序"
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        verbose_name = "琴"
        verbose_name_plural = "琴"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name}（{self.serial_number}）"


class ProcessStage(models.Model):
    guqin = models.ForeignKey(
        Guqin, on_delete=models.CASCADE, related_name="stages", verbose_name="琴"
    )
    stage = models.CharField(max_length=20, choices=Guqin.STAGE_CHOICES, verbose_name="工序")
    started_at = models.DateTimeField(verbose_name="开始时间")
    completed_at = models.DateTimeField(null=True, blank=True, verbose_name="完成时间")
    notes = models.TextField(blank=True, default="", verbose_name="备注")
    operator = models.CharField(max_length=50, blank=True, default="", verbose_name="操作人")

    class Meta:
        verbose_name = "工序记录"
        verbose_name_plural = "工序记录"
        ordering = ["-started_at"]

    def __str__(self):
        return f"{self.guqin.name} - {self.get_stage_display()}"
