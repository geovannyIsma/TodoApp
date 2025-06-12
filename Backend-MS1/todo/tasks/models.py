from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # Campo para almacenar el ID del usuario desde el microservicio de autenticación
    user_id = models.IntegerField(null=True)

    def __str__(self):
        return self.title
        
    class Meta:
        ordering = ['-created_at']
