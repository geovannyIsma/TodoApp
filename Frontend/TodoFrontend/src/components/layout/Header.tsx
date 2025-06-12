import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useRef, useEffect } from 'react';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle clicking outside the dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    // Add event listener when dropdown is open
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <header className="bg-blue-600 dark:bg-blue-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to={isAuthenticated ? "/tasks" : "/"} className="text-white text-2xl font-bold">Todo App</Link>
        <nav className="flex items-center space-x-4">
          {isAuthenticated && (
            <Link
              to="/tasks/new"
              className="bg-white text-blue-600 hover:bg-blue-50
               dark:bg-slate-900 dark:text-slate-500 dark:hover:bg-white
                 px-4 py-2 rounded-lg transition shadow-sm font-medium"
            >
              Nueva Tarea
            </Link>
          )}
          
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
              <button 
                className="flex items-center space-x-2 text-white"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <span>{user.username}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-12 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-10">
                  <Link 
                    to="/profile" 
                    className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link 
                to="/login" 
                className="text-white hover:text-blue-100 font-medium"
              >
                Iniciar Sesión
              </Link>
              <span className="text-white">|</span>
              <Link 
                to="/register" 
                className="text-white hover:text-blue-100 font-medium"
              >
                Registrarse
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
