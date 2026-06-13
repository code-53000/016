from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GuqinViewSet, ProcessStageViewSet

router = DefaultRouter()
router.register("guqins", GuqinViewSet)
router.register("stages", ProcessStageViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
