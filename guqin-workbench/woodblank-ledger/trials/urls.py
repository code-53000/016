from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ToneTrialViewSet

router = DefaultRouter()
router.register("tone-trials", ToneTrialViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
