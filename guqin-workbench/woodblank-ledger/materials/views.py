from rest_framework import viewsets
from .models import WoodBlank, LacquerRecord
from .serializers import WoodBlankSerializer, LacquerRecordSerializer


class WoodBlankViewSet(viewsets.ModelViewSet):
    queryset = WoodBlank.objects.all()
    serializer_class = WoodBlankSerializer


class LacquerRecordViewSet(viewsets.ModelViewSet):
    queryset = LacquerRecord.objects.all()
    serializer_class = LacquerRecordSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        guqin_id = self.request.query_params.get("guqin")
        if guqin_id:
            queryset = queryset.filter(guqin_id=guqin_id)
        return queryset
