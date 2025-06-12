import jwt
import os
import logging
from django.http import JsonResponse
from django.conf import settings

logger = logging.getLogger('todo.tasks.middleware')

class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        # Get the secret key from settings if available
        self.secret_key = getattr(settings, 'MS2_SECRET_KEY', 
                                os.environ.get('MS2_SECRET_KEY', 'your-secret-key-here'))
        logger.info(f"JWT Middleware initialized with secret key starting with: {self.secret_key[:5]}...")

    def __call__(self, request):
        # Excluir rutas que no necesitan autenticación
        if request.path.startswith('/admin/') or request.path == '/api/health/':
            return self.get_response(request)
        
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('Bearer '):
            # Para desarrollo: permitir solicitudes sin token
            request.user_id = None
            if request.method == 'POST' and '/api/tasks/' in request.path:
                logger.warning(f"Solicitud sin token: {request.path}")
            return self.get_response(request)
        
        token = auth_header.split(' ')[1]
        
        try:
            # Decodificar el token
            logger.debug(f"Intentando decodificar token: {token[:10]}...")
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            
            # Extraer la información del usuario
            email = payload.get('sub')
            user_id = payload.get('user_id')
            
            logger.info(f"Token decodificado: email={email}, user_id={user_id}")
            
            # Añadir el ID del usuario al request para usarlo en las vistas
            request.user_id = user_id
            request.user_email = email
            
            # Debug logging to verify user_id is correctly set
            if request.method == 'POST' and '/api/tasks/' in request.path:
                logger.info(f"Creando tarea con user_id={user_id}")
            
        except jwt.ExpiredSignatureError:
            logger.error("Token expirado")
            request.user_id = None
        except jwt.InvalidTokenError as e:
            logger.error(f"Token inválido: {str(e)}")
            request.user_id = None
        except Exception as e:
            logger.error(f"Error desconocido al procesar token: {str(e)}")
            request.user_id = None
        
        response = self.get_response(request)
        return response
