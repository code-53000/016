from rest_framework import viewsets
from .models import ToneTrial
from .serializers import ToneTrialSerializer


class ToneTrialViewSet(viewsets.ModelViewSet):
    queryset = ToneTrial.objects.all()
    serializer_class = ToneTrialSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        guqin_id = self.request.query_params.get("guqin")
        if guqin_id:
            queryset = queryset.filter(guqin_id=guqin_id)
        return queryset
