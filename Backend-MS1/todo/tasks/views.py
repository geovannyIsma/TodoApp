from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Task
from .serializers import TaskSerializer
import logging

logger = logging.getLogger('todo.tasks.views')

@api_view(['GET'])
def health_check(request):
    """Simple health check endpoint to verify API connectivity"""
    return Response({"status": "ok"}, status=status.HTTP_200_OK)

class TaskViewSet(viewsets.ModelViewSet):
    """
    API endpoint para ver o editar tareas específicas de un usuario
    """
    serializer_class = TaskSerializer

    def get_queryset(self):
        # Filtrar tareas por user_id si está autenticado
        if hasattr(self.request, 'user_id') and self.request.user_id:
            logger.info(f"Filtrando tareas para user_id={self.request.user_id}")
            return Task.objects.filter(user_id=self.request.user_id)
        logger.warning("No se encontró user_id en el request, devolviendo todas las tareas")
        return Task.objects.all()  # Fallback para desarrollo sin autenticación

    def create(self, request, *args, **kwargs):
        # Create a mutable copy of request.data
        mutable_data = request.data.copy()
        
        # Add user_id to the mutable data
        if hasattr(request, 'user_id') and request.user_id:
            logger.info(f"Asignando user_id: {request.user_id} a la tarea")
            mutable_data['user_id'] = request.user_id
        else:
            logger.warning("No se encontró user_id en el request para asignar a la tarea")
            
        # Create serializer with the modified data
        serializer = self.get_serializer(data=mutable_data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        task = self.get_object()
        # Verificar que la tarea pertenece al usuario actual
        if task.user_id and hasattr(request, 'user_id') and task.user_id != request.user_id:
            return Response(
                {"error": "No tienes permiso para modificar esta tarea"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        task = self.get_object()
        # Verificar que la tarea pertenece al usuario actual
        if task.user_id and hasattr(request, 'user_id') and task.user_id != request.user_id:
            return Response(
                {"error": "No tienes permiso para eliminar esta tarea"}, 
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)
