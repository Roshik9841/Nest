import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { AdminDashboard } from './pages/AdminDashboard';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminCourses } from './pages/AdminCourses';
import { AdminUsers } from './pages/AdminUsers';
import { AdminEnrollments } from './pages/AdminEnrollments';
import { Courses } from './pages/Courses';
import { MyCourses } from './pages/MyCourses';
import { CreateCourse } from './pages/CreateCourse';
import { EditCourse } from './pages/EditCourse';
import './App.css';

function App() {
  // Simple function to check if user is logged in
  const isLoggedIn = () => {
    return !!localStorage.getItem('token');
  };

  // Simple function to get user role
  const getUserRole = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      return JSON.parse(userData).role;
    }
    return null;
  };

  // Simple protected route - just checks if logged in
  const ProtectedRoute = ({ children }) => {
    if (!isLoggedIn()) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };
  
  return (
    <BrowserRouter>
    <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Home redirects to dashboard based on role */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {getUserRole() === 'admin' ? (
                <Navigate to="/admin-dashboard" replace />
              ) : (
                <Navigate to="/student-dashboard" replace />
              )}
            </ProtectedRoute>
          }
        />
        
        {/* Admin routes - components will check role inside */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute>
              <AdminCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/enrollments"
          element={
            <ProtectedRoute>
              <AdminEnrollments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/create-course"
          element={
            <ProtectedRoute>
              <CreateCourse />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/edit-course/:id"
          element={
            <ProtectedRoute>
              <EditCourse />
            </ProtectedRoute>
          }
        />
        
        {/* Student routes - components will check role inside */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/courses"
          element={
            <ProtectedRoute>
              <Courses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/my-courses"
          element={
            <ProtectedRoute>
              <MyCourses />
            </ProtectedRoute>
          }
        />
    </Routes>
    </BrowserRouter>
  );
}

export default App;
