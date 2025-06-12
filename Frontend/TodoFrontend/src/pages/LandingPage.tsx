import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to tasks
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tasks');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
        Bienvenido a Todo App
      </h1>
      <p className="text-xl md:text-2xl mb-8 max-w-2xl text-gray-600 dark:text-gray-300">
        Administra tus tareas de forma sencilla y organizada. Inicia sesión para comenzar.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          to="/login" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition"
        >
          Iniciar Sesión
        </Link>
        <Link 
          to="/register" 
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition"
        >
          Registrarse
        </Link>
      </div>

      <div className="mt-12 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
          ¿Qué puedes hacer?
        </h2>
        <ul className="list-disc list-inside text-left space-y-2 text-gray-700 dark:text-gray-300">
          <li>Crear y organizar tus tareas diarias</li>
          <li>Marcar tareas como completadas</li>
          <li>Editar detalles de tus tareas</li>
          <li>Mantener un registro de tus actividades</li>
          <li>Acceder a tus tareas desde cualquier dispositivo</li>
        </ul>
      </div>
    </div>
  );
};

export default LandingPage;
