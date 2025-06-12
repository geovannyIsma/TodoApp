import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    
    // Validate password match
    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    
    // Validate password length
    if (password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    await register({
      email,
      username,
      password,
      full_name: fullName || undefined
    });
    
    navigate('/');
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Crear Cuenta</h2>
      
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
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1" htmlFor="username">
            Nombre de Usuario
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            maxLength={50}
            className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="usuario123"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1" htmlFor="fullName">
            Nombre Completo (opcional)
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Juan Pérez"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="********"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Mínimo 8 caracteres
          </p>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1" htmlFor="confirmPassword">
            Confirmar Contraseña
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border dark:border-gray-600 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="********"
          />
          {passwordError && (
            <p className="mt-1 text-xs text-red-500">{passwordError}</p>
          )}
        </div>
        
        <div className="flex flex-col gap-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : 'Registrarse'}
          </button>
          
          <p className="text-center text-gray-600 dark:text-gray-400">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
