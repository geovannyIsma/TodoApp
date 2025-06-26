import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Header from './components/layout/Header';
import TaskListPage from './pages/tasks/TaskListPage';
import TaskDetailPage from './pages/tasks/TaskDetailPage';
import TaskFormPage from './pages/tasks/TaskFormPage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ProfilePage from './components/auth/ProfilePage';
import NotificationSettingsPage from './pages/notifications/NotificationSettingsPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            <Header />
            <main className="container mx-auto py-8 px-4">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/tasks" element={<TaskListPage />} />
                  <Route path="/tasks/new" element={<TaskFormPage />} />
                  <Route path="/tasks/:id" element={<TaskDetailPage />} />
                  <Route path="/tasks/:id/edit" element={<TaskFormPage isEditing />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/notifications/settings" element={<NotificationSettingsPage />} />
                </Route>
              </Routes>
            </main>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
