from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WoodBlankViewSet, LacquerRecordViewSet

router = DefaultRouter()
router.register("wood-blanks", WoodBlankViewSet)
router.register("lacquer-records", LacquerRecordViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
