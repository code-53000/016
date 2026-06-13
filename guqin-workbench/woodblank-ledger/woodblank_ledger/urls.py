from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/processes/", include("processes.urls")),
    path("api/materials/", include("materials.urls")),
    path("api/trials/", include("trials.urls")),
    path("api/orders/", include("orders.urls")),
]
