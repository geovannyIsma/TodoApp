import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Iniciar Sesión</h2>
      
      {error && (
        <div className="mb-4 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-3 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1" htmlFor="email">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="nombre@ejemplo.com"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="********"
          />
        </div>
        
        <div className="flex flex-col gap-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
          
          <p className="text-center text-gray-600 dark:text-gray-400">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
              Regístrate
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
