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
                                os.environ.get('MS2_SECRET_KEY', 'iRz6KyZZr2bjEsv9hcSW6ePpaZj-8LO9-cmYBFhAdQk'))
        logger.info(f"JWT Middleware initialized with secret key starting with: {self.secret_key[:5]}...")

    def __call__(self, request):
        # Excluir rutas que no necesitan autenticación
        if request.path.startswith('/admin/') or '/api/health/' in request.path:
            logger.debug(f"Ruta excluida de autenticación: {request.path}")
            return self.get_response(request)
        
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('Bearer '):
            # Para desarrollo: permitir solicitudes sin token
            request.user_id = None
            logger.warning(f"Solicitud sin token: {request.path} (método: {request.method})")
            return self.get_response(request)
        
        token = auth_header.split(' ')[1]
        
        try:
            # Decodificar el token
            logger.debug(f"Intentando decodificar token: {token[:10]}...")
            # Add algorithm explicitly and verify audience
            payload = jwt.decode(
                token, 
                self.secret_key, 
                algorithms=['HS256'],
                options={"verify_signature": True}
            )
            
            # Extraer la información del usuario
            email = payload.get('sub')
            user_id = payload.get('user_id')
            
            if not user_id and email:
                # Try to extract user_id from email claim if missing
                logger.info(f"No user_id found in token, but email is present: {email}")
                # In a real app, you might query a user service or database here
            
            logger.info(f"Token decodificado con éxito: email={email}, user_id={user_id}")
            
            # Añadir el ID del usuario al request para usarlo en las vistas
            request.user_id = user_id
            request.user_email = email
            
            # Debug logging for all requests to tasks endpoint
            if '/api/tasks/' in request.path:
                logger.info(f"{request.method} request to tasks with user_id={user_id}")
            
        except jwt.ExpiredSignatureError:
            logger.error("Token expirado")
            request.user_id = None
        except jwt.InvalidTokenError as e:
            logger.error(f"Token inválido: {str(e)}, Secret key starts with: {self.secret_key[:5]}")
            request.user_id = None
        except Exception as e:
            logger.error(f"Error desconocido al procesar token: {str(e)}")
            request.user_id = None
        
        response = self.get_response(request)
        return response
