import { useAuth } from '../../context/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();
  
  if (!user) {
    return <div className="text-center py-8">Cargando perfil...</div>;
  }
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Mi Perfil</h1>
      
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-200 dark:border-gray-700">
          <span className="font-medium text-gray-500 dark:text-gray-400 w-32">Nombre de Usuario:</span>
          <span className="text-gray-800 dark:text-white mt-1 sm:mt-0">{user.username}</span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-200 dark:border-gray-700">
          <span className="font-medium text-gray-500 dark:text-gray-400 w-32">Correo:</span>
          <span className="text-gray-800 dark:text-white mt-1 sm:mt-0">{user.email}</span>
        </div>
        
        {user.full_name && (
          <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-200 dark:border-gray-700">
            <span className="font-medium text-gray-500 dark:text-gray-400 w-32">Nombre Completo:</span>
            <span className="text-gray-800 dark:text-white mt-1 sm:mt-0">{user.full_name}</span>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-200 dark:border-gray-700">
          <span className="font-medium text-gray-500 dark:text-gray-400 w-32">Cuenta Creada:</span>
          <span className="text-gray-800 dark:text-white mt-1 sm:mt-0">
            {new Date(user.created_at).toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center py-3">
          <span className="font-medium text-gray-500 dark:text-gray-400 w-32">Estado:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            user.is_active 
              ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
              : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
          }`}>
            {user.is_active ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
