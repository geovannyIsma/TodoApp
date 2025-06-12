from rest_framework import viewsets
from .models import Task
from .serializers import TaskSerializer

class TaskViewSet(viewsets.ModelViewSet):
    """
    API endpoint para ver o editar tareas sin autenticación
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
