from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Guqin, ProcessStage
from .serializers import GuqinSerializer, GuqinBriefSerializer, ProcessStageSerializer


class GuqinViewSet(viewsets.ModelViewSet):
    queryset = Guqin.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return GuqinBriefSerializer
        return GuqinSerializer

    @action(detail=True, methods=["post"], url_path="advance-stage")
    def advance_stage(self, request, pk=None):
        guqin = self.get_object()
        stage_order = [s[0] for s in Guqin.STAGE_CHOICES]
        current_idx = stage_order.index(guqin.current_stage)
        if current_idx >= len(stage_order) - 1:
            return Response(
                {"detail": "已处于最终工序"}, status=status.HTTP_400_BAD_REQUEST
            )
        next_stage = stage_order[current_idx + 1]
        ProcessStage.objects.filter(
            guqin=guqin, stage=guqin.current_stage, completed_at__isnull=True
        ).update(completed_at=timezone.now())
        guqin.current_stage = next_stage
        guqin.save(update_fields=["current_stage", "updated_at"])
        ProcessStage.objects.create(guqin=guqin, stage=next_stage, started_at=timezone.now())
        return Response(GuqinSerializer(guqin).data)


class ProcessStageViewSet(viewsets.ModelViewSet):
    queryset = ProcessStage.objects.all()
    serializer_class = ProcessStageSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        guqin_id = self.request.query_params.get("guqin")
        if guqin_id:
            queryset = queryset.filter(guqin_id=guqin_id)
        return queryset
