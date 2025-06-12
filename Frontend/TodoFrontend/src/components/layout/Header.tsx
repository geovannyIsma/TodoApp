const Header = () => {
  return (
    <header className="bg-blue-600 dark:bg-blue-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Todo App</h1>
        <nav>
          <a
            href="/tasks/new"
            className="bg-white text-blue-600 hover:bg-blue-50
             dark:bg-slate-900 dark:text-slate-500 dark:hover:bg-white
               px-4 py-2 rounded-lg transition shadow-sm font-medium"
          >
            Nueva Tarea
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
