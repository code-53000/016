from django.db import models
from processes.models import Guqin


class Customer(models.Model):
    name = models.CharField(max_length=100, verbose_name="姓名")
    phone = models.CharField(max_length=20, blank=True, default="", verbose_name="电话")
    address = models.TextField(blank=True, default="", verbose_name="地址")
    notes = models.TextField(blank=True, default="", verbose_name="备注")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        verbose_name = "客户"
        verbose_name_plural = "客户"
        ordering = ["-created_at"]

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = [
        ("reserved", "已预定"),
        ("deposit_paid", "定金已付"),
        ("in_production", "制作中"),
        ("ready_for_delivery", "待交付"),
        ("delivered", "已交付"),
        ("settled", "已结算"),
    ]

    guqin = models.ForeignKey(
        Guqin, on_delete=models.PROTECT, related_name="orders", verbose_name="琴"
    )
    customer = models.ForeignKey(
        Customer, on_delete=models.PROTECT, related_name="orders", verbose_name="客户"
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="reserved", verbose_name="状态"
    )
    reserved_at = models.DateField(verbose_name="预定日期")
    deposit_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0, verbose_name="定金金额"
    )
    total_amount = models.DecimalField(
        max_digits=10, decimal_places=2, default=0, verbose_name="总价"
    )
    delivered_at = models.DateField(null=True, blank=True, verbose_name="交付日期")
    settled_at = models.DateField(null=True, blank=True, verbose_name="结算日期")
    notes = models.TextField(blank=True, default="", verbose_name="备注")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        verbose_name = "订单"
        verbose_name_plural = "订单"
        ordering = ["-reserved_at"]

    def __str__(self):
        return f"{self.customer.name} - {self.guqin.name}"
