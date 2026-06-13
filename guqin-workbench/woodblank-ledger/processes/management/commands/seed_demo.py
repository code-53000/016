from datetime import date, timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from processes.models import Guqin, ProcessStage
from materials.models import WoodBlank, LacquerRecord
from trials.models import ToneTrial
from orders.models import Customer, Order


class Command(BaseCommand):
    help = "初始化虚构琴胚演示数据"

    def handle(self, *args, **options):
        if Guqin.objects.exists():
            self.stdout.write("琴数据已存在，跳过初始化")
            return

        today = date.today()

        guqin_data = [
            {
                "name": "听松",
                "serial_number": "GQ-2026-001",
                "current_stage": "lacquering",
                "wood": {
                    "batch_number": "WD-2024-A03",
                    "source": "河南兰考桐木林场",
                    "wood_type": "paulownia",
                    "drying_status": "ready",
                    "received_at": today - timedelta(days=500),
                },
                "stages": [
                    ("drying", today - timedelta(days=500), today - timedelta(days=200)),
                    ("grooving", today - timedelta(days=200), today - timedelta(days=160)),
                    ("assembling", today - timedelta(days=160), today - timedelta(days=120)),
                    ("lacquering", today - timedelta(days=120), None),
                ],
                "lacquers": [
                    (1, "raw", today - timedelta(days=120), today - timedelta(days=100)),
                    (2, "raw", today - timedelta(days=100), today - timedelta(days=80)),
                    (3, "refined", today - timedelta(days=80), today - timedelta(days=55)),
                ],
                "trial": {
                    "trial_date": today - timedelta(days=60),
                    "san_rating": 4,
                    "an_rating": 4,
                    "fan_rating": 3,
                    "noise_description": "七徽按音轻微沙音",
                    "overall_rating": 4,
                    "tester": "王师傅",
                },
                "order": {
                    "customer": ("李明远", "13800138001", "北京市朝阳区"),
                    "status": "in_production",
                    "reserved_at": today - timedelta(days=300),
                    "deposit_amount": "5000.00",
                    "total_amount": "28000.00",
                },
            },
            {
                "name": "鸣泉",
                "serial_number": "GQ-2026-002",
                "current_stage": "drying",
                "wood": {
                    "batch_number": "WD-2025-B07",
                    "source": "福建建瓯杉木产区",
                    "wood_type": "fir",
                    "drying_status": "natural",
                    "received_at": today - timedelta(days=60),
                },
                "stages": [
                    ("drying", today - timedelta(days=60), None),
                ],
                "lacquers": [],
                "trial": None,
                "order": None,
            },
            {
                "name": "碧涧",
                "serial_number": "GQ-2026-003",
                "current_stage": "finished",
                "wood": {
                    "batch_number": "WD-2023-C12",
                    "source": "四川雅安老桐木",
                    "wood_type": "paulownia",
                    "drying_status": "ready",
                    "received_at": today - timedelta(days=800),
                },
                "stages": [
                    ("drying", today - timedelta(days=800), today - timedelta(days=400)),
                    ("grooving", today - timedelta(days=400), today - timedelta(days=350)),
                    ("assembling", today - timedelta(days=350), today - timedelta(days=300)),
                    ("lacquering", today - timedelta(days=300), today - timedelta(days=100)),
                    ("trial", today - timedelta(days=100), today - timedelta(days=80)),
                    ("finished", today - timedelta(days=80), None),
                ],
                "lacquers": [
                    (1, "raw", today - timedelta(days=300), today - timedelta(days=270)),
                    (2, "raw", today - timedelta(days=270), today - timedelta(days=240)),
                    (3, "refined", today - timedelta(days=240), today - timedelta(days=210)),
                    (4, "refined", today - timedelta(days=210), today - timedelta(days=180)),
                    (5, "mix", today - timedelta(days=180), today - timedelta(days=140)),
                ],
                "trial": {
                    "trial_date": today - timedelta(days=90),
                    "san_rating": 5,
                    "an_rating": 5,
                    "fan_rating": 5,
                    "noise_description": "",
                    "overall_rating": 5,
                    "tester": "陈师傅",
                },
                "order": {
                    "customer": ("张清和", "13900139002", "上海市浦东新区"),
                    "status": "settled",
                    "reserved_at": today - timedelta(days=600),
                    "deposit_amount": "8000.00",
                    "total_amount": "56000.00",
                    "delivered_at": str(today - timedelta(days=70)),
                    "settled_at": str(today - timedelta(days=65)),
                },
            },
            {
                "name": "幽兰",
                "serial_number": "GQ-2026-004",
                "current_stage": "trial",
                "wood": {
                    "batch_number": "WD-2024-D05",
                    "source": "安徽宣城桐木合作社",
                    "wood_type": "paulownia",
                    "drying_status": "ready",
                    "received_at": today - timedelta(days=650),
                },
                "stages": [
                    ("drying", today - timedelta(days=650), today - timedelta(days=350)),
                    ("grooving", today - timedelta(days=350), today - timedelta(days=300)),
                    ("assembling", today - timedelta(days=300), today - timedelta(days=250)),
                    ("lacquering", today - timedelta(days=250), today - timedelta(days=60)),
                    ("trial", today - timedelta(days=60), None),
                ],
                "lacquers": [
                    (1, "raw", today - timedelta(days=250), today - timedelta(days=220)),
                    (2, "raw", today - timedelta(days=220), today - timedelta(days=190)),
                    (3, "refined", today - timedelta(days=190), today - timedelta(days=150)),
                    (4, "mix", today - timedelta(days=150), today - timedelta(days=80)),
                ],
                "trial": {
                    "trial_date": today - timedelta(days=30),
                    "san_rating": 4,
                    "an_rating": 3,
                    "fan_rating": 4,
                    "noise_description": "五徽泛音有轻微嗡声，需调整岳山",
                    "overall_rating": 3,
                    "tester": "王师傅",
                },
                "order": {
                    "customer": ("赵一鸣", "13700137003", "杭州市西湖区"),
                    "status": "in_production",
                    "reserved_at": today - timedelta(days=400),
                    "deposit_amount": "6000.00",
                    "total_amount": "35000.00",
                },
            },
        ]

        for data in guqin_data:
            guqin = Guqin.objects.create(
                name=data["name"],
                serial_number=data["serial_number"],
                current_stage=data["current_stage"],
            )

            wood = data["wood"]
            WoodBlank.objects.create(
                batch_number=wood["batch_number"],
                source=wood["source"],
                wood_type=wood["wood_type"],
                drying_status=wood["drying_status"],
                received_at=wood["received_at"],
                guqin=guqin,
            )

            for stage, started, completed in data["stages"]:
                ProcessStage.objects.create(
                    guqin=guqin,
                    stage=stage,
                    started_at=timezone.make_aware(
                        timezone.datetime.combine(started, timezone.datetime.min.time())
                    ),
                    completed_at=(
                        timezone.make_aware(
                            timezone.datetime.combine(completed, timezone.datetime.min.time())
                        )
                        if completed
                        else None
                    ),
                    operator="王师傅" if stage in ("drying", "grooving") else "陈师傅",
                )

            for coat_num, lacquer_type, applied, dried in data["lacquers"]:
                LacquerRecord.objects.create(
                    guqin=guqin,
                    coat_number=coat_num,
                    lacquer_type=lacquer_type,
                    applied_at=applied,
                    dried_at=dried,
                )

            if data["trial"]:
                t = data["trial"]
                ToneTrial.objects.create(
                    guqin=guqin,
                    trial_date=t["trial_date"],
                    san_rating=t["san_rating"],
                    an_rating=t["an_rating"],
                    fan_rating=t["fan_rating"],
                    noise_description=t["noise_description"],
                    overall_rating=t["overall_rating"],
                    tester=t["tester"],
                )

            if data["order"]:
                o = data["order"]
                customer = Customer.objects.create(
                    name=o["customer"][0],
                    phone=o["customer"][1],
                    address=o["customer"][2],
                )
                order_data = {
                    "guqin": guqin,
                    "customer": customer,
                    "status": o["status"],
                    "reserved_at": o["reserved_at"],
                    "deposit_amount": o["deposit_amount"],
                    "total_amount": o["total_amount"],
                }
                if "delivered_at" in o:
                    order_data["delivered_at"] = o["delivered_at"]
                if "settled_at" in o:
                    order_data["settled_at"] = o["settled_at"]
                Order.objects.create(**order_data)

        self.stdout.write(self.style.SUCCESS("成功初始化 4 张虚构琴胚数据"))
