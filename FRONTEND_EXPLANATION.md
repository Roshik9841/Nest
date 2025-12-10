# Complete Frontend Architecture Explanation

## Table of Contents
1. [Overview](#overview)
2. [React Basics](#react-basics)
3. [Component Structure](#component-structure)
4. [State Management](#state-management)
5. [Routing System](#routing-system)
6. [API Communication](#api-communication)
7. [Authentication Flow](#authentication-flow)
8. [LocalStorage](#localstorage)
9. [Complete Request Flow](#complete-request-flow)
10. [How Frontend Connects to Backend](#how-frontend-connects-to-backend)

---

## Overview

Your frontend is built with **React**, which is a JavaScript library for building user interfaces. It uses:
- **React Router** - Navigation between pages
- **Axios** - HTTP requests to backend
- **Tailwind CSS** - Styling
- **Vite** - Build tool and development server

### Main Concepts:
1. **Components** - Reusable UI pieces
2. **State** - Data that changes over time
3. **Props** - Data passed to components
4. **Hooks** - Functions that let you use React features
5. **Routing** - Navigation between pages
6. **API Calls** - Communication with backend

---

## React Basics

### What is React?

React is a library that lets you build user interfaces using **components**. Think of components as building blocks:

```
App (Main Component)
├── Login (Page Component)
├── Dashboard (Page Component)
│   └── Header (Reusable Component)
└── Courses (Page Component)
    └── Header (Reusable Component)
```

### Key React Concepts:

1. **JSX** - JavaScript + HTML
   ```jsx
   // This looks like HTML but it's JavaScript
   return (
     <div>
       <h1>Hello {user.name}</h1>
     </div>
   );
   ```

2. **Components** - Functions that return JSX
   ```jsx
   function Login() {
     return <div>Login Form</div>;
   }
   ```

3. **Props** - Data passed to components
   ```jsx
   <Header user={user} />  // user is a prop
   ```

4. **State** - Data that can change
   ```jsx
   const [email, setEmail] = useState('');
   // email is the value, setEmail updates it
   ```

---

## Component Structure

### File Organization

```
frontend/src/
├── App.jsx              # Main routing file
├── api.jsx              # API configuration
├── pages/               # Page components
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── AdminDashboard.jsx
│   ├── StudentDashboard.jsx
│   ├── Courses.jsx
│   └── ...
└── components/          # Reusable components
    └── Header.jsx
```

### Component Types:

1. **Page Components** - Full pages (Login, Dashboard, etc.)
2. **Reusable Components** - Used in multiple places (Header)

### Example Component Structure:

```jsx
// Login.jsx - A page component
import { useState } from 'react';
import api from '../api';

export const Login = () => {
    // 1. State variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    // 2. Event handlers
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission
    };
    
    // 3. Return JSX (what user sees)
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};
```

**Component Structure:**
1. **Imports** - What you need (React, API, etc.)
2. **State** - Data that changes
3. **Functions** - Event handlers, API calls
4. **Return** - JSX (what displays on screen)

---

## State Management

### useState Hook

**What it does:** Stores data that can change and causes re-render when updated.

```jsx
// Basic syntax
const [value, setValue] = useState(initialValue);

// Examples
const [email, setEmail] = useState('');           // String
const [count, setCount] = useState(0);            // Number
const [user, setUser] = useState(null);           // Object
const [courses, setCourses] = useState([]);       // Array
const [loading, setLoading] = useState(false);    // Boolean
```

**How it works:**

```jsx
// 1. Declare state
const [email, setEmail] = useState('');

// 2. Use value
<input value={email} />

// 3. Update value
setEmail('new@email.com');  // Component re-renders with new value
```

### Real Example from Login Component:

```jsx
export const Login = () => {
    // State for form inputs
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // State for error messages
    const [error, setError] = useState('');
    
    // State for loading indicator
    const [loading, setLoading] = useState(false);
    
    // When user types in email input
    <input
        value={email}  // Display current email
        onChange={(e) => setEmail(e.target.value)}  // Update when user types
    />
    
    // When form submits
    const handleSubmit = async (e) => {
        setLoading(true);      // Show loading
        setError('');          // Clear errors
        
        try {
            // API call...
            setLoading(false); // Hide loading
        } catch (err) {
            setError('Login failed');  // Show error
            setLoading(false);
        }
    };
};
```

### useEffect Hook

**What it does:** Runs code when component mounts or when dependencies change.

```jsx
// Basic syntax
useEffect(() => {
    // Code to run
}, [dependencies]);

// Examples
useEffect(() => {
    // Runs once when component loads
    fetchData();
}, []);  // Empty array = run once

useEffect(() => {
    // Runs when 'userId' changes
    fetchUserData(userId);
}, [userId]);  // Runs when userId changes
```

### Real Example from Courses Component:

```jsx
export const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Run when component first loads
    useEffect(() => {
        fetchCourses();  // Fetch data from API
    }, []);  // Empty array = only run once
    
    const fetchCourses = async () => {
        try {
            const response = await api.get('/courses');
            setCourses(response.data);  // Update state with data
        } catch (err) {
            setError('Failed to load courses');
        } finally {
            setLoading(false);  // Hide loading
        }
    };
    
    // Show loading while fetching
    if (loading) {
        return <p>Loading...</p>;
    }
    
    // Show courses when loaded
    return (
        <div>
            {courses.map(course => (
                <div key={course.id}>{course.title}</div>
            ))}
        </div>
    );
};
```

**Why useEffect?**
- Fetch data when page loads
- Subscribe to events
- Clean up when component unmounts

---

## Routing System

### React Router

**What it does:** Changes what component displays based on URL.

### App.jsx - Main Routing File

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>  {/* Enables routing */}
            <Routes>      {/* Container for routes */}
                {/* Define routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </BrowserRouter>
    );
}
```

### Route Types:

1. **Public Routes** - Anyone can access
   ```jsx
   <Route path="/login" element={<Login />} />
   <Route path="/register" element={<Register />} />
   ```

2. **Protected Routes** - Requires login
   ```jsx
   <Route
       path="/dashboard"
       element={
           <ProtectedRoute>
               <Dashboard />
           </ProtectedRoute>
       }
   />
   ```

### ProtectedRoute Component:

```jsx
const ProtectedRoute = ({ children }) => {
    // Check if user is logged in
    const isLoggedIn = !!localStorage.getItem('token');
    
    if (!isLoggedIn) {
        // Redirect to login if not logged in
        return <Navigate to="/login" replace />;
    }
    
    // Show the protected component
    return children;
};
```

**How it works:**
1. User tries to access `/dashboard`
2. `ProtectedRoute` checks if token exists
3. If no token → redirect to `/login`
4. If token exists → show `Dashboard` component

### Navigation

**How to navigate between pages:**

```jsx
import { useNavigate } from 'react-router-dom';

function MyComponent() {
    const navigate = useNavigate();
    
    // Navigate programmatically
    const handleClick = () => {
        navigate('/dashboard');  // Go to dashboard
    };
    
    // Navigate with Link component
    return (
        <Link to="/dashboard">Go to Dashboard</Link>
    );
}
```

### Complete Routing Example:

```jsx
function App() {
    // Check if logged in
    const isLoggedIn = () => {
        return !!localStorage.getItem('token');
    };
    
    // Get user role
    const getUserRole = () => {
        const userData = localStorage.getItem('user');
        if (userData) {
            return JSON.parse(userData).role;
        }
        return null;
    };
    
    // Protected route wrapper
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
                
                {/* Home redirects based on role */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            {getUserRole() === 'admin' ? (
                                <Navigate to="/admin-dashboard" />
                            ) : (
                                <Navigate to="/student-dashboard" />
                            )}
                        </ProtectedRoute>
                    }
                />
                
                {/* Protected admin routes */}
                <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                
                {/* Protected student routes */}
                <Route
                    path="/student-dashboard"
                    element={
                        <ProtectedRoute>
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
```

---

## API Communication

### Axios Setup (`api.jsx`)

**What it does:** Configures how to talk to the backend.

```jsx
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:3000',  // Backend URL
});

// Request interceptor - runs BEFORE every request
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        // Add token to request header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        return config;
    }
);

// Response interceptor - runs AFTER every response
api.interceptors.response.use(
    (response) => response,  // If successful, return response
    (error) => {
        // If 401 (unauthorized), logout user
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
```

**What interceptors do:**
- **Request Interceptor** - Automatically adds token to every request
- **Response Interceptor** - Handles errors (like expired tokens)

### Making API Calls

**GET Request (Fetch data):**
```jsx
const fetchCourses = async () => {
    try {
        const response = await api.get('/courses');
        // response.data contains the courses array
        setCourses(response.data);
    } catch (err) {
        setError('Failed to load courses');
    }
};
```

**POST Request (Create data):**
```jsx
const handleLogin = async (email, password) => {
    try {
        const response = await api.post('/auth/login', {
            email,
            password
        });
        // response.data contains { access_token, user }
        localStorage.setItem('token', response.data.access_token);
    } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
    }
};
```

**DELETE Request (Remove data):**
```jsx
const handleDelete = async (courseId) => {
    try {
        await api.delete(`/courses/${courseId}`);
        alert('Course deleted');
        fetchCourses();  // Refresh list
    } catch (err) {
        alert('Failed to delete');
    }
};
```

### Complete API Call Example:

```jsx
export const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Fetch courses when component loads
    useEffect(() => {
        fetchCourses();
    }, []);
    
    const fetchCourses = async () => {
        setLoading(true);
        try {
            // GET request to backend
            const response = await api.get('/courses');
            
            // Update state with data
            setCourses(response.data);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };
    
    const handleEnroll = async (courseId) => {
        try {
            // POST request to enroll
            await api.post(`/enrollments/course/${courseId}`);
            alert('Successfully enrolled!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to enroll');
        }
    };
    
    return (
        <div>
            {courses.map(course => (
                <div key={course.id}>
                    <h2>{course.title}</h2>
                    <button onClick={() => handleEnroll(course.id)}>
                        Enroll
                    </button>
                </div>
            ))}
        </div>
    );
};
```

---

## Authentication Flow

### Complete Login Flow

```
1. User enters email/password
   ↓
2. User clicks "Login" button
   ↓
3. handleSubmit() runs
   ↓
4. Frontend sends POST /auth/login
   {
     email: "user@example.com",
     password: "password123"
   }
   ↓
5. Backend validates credentials
   ↓
6. Backend returns JWT token + user info
   {
     access_token: "eyJhbGc...",
     user: { id: 1, name: "John", role: "student" }
   }
   ↓
7. Frontend saves token to localStorage
   localStorage.setItem('token', token);
   localStorage.setItem('user', JSON.stringify(user));
   ↓
8. Frontend redirects based on role
   if (user.role === 'admin') {
     navigate('/admin-dashboard');
   } else {
     navigate('/student-dashboard');
   }
```

### Code Flow:

```jsx
export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent page refresh
        
        try {
            // 1. Send login request to backend
            const response = await api.post('/auth/login', {
                email,
                password
            });
            
            // 2. Save token and user to localStorage
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // 3. Redirect based on role
            if (response.data.user.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/student-dashboard');
            }
        } catch (err) {
            // Show error if login fails
            setError(err.response?.data?.message || 'Login failed');
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    );
};
```

### Using Token in Protected Requests

**How token is automatically added:**

```jsx
// When you make an API call
api.get('/courses');

// Request interceptor automatically adds:
// Headers: {
//   Authorization: "Bearer eyJhbGc..."
// }

// Backend receives:
// req.headers.authorization = "Bearer eyJhbGc..."
// Backend validates token and attaches user to req.user
```

### Logout Flow:

```jsx
const handleLogout = () => {
    // Remove token and user from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login page
    navigate('/login');
};
```

---

## LocalStorage

### What is LocalStorage?

**Browser storage** that persists even after closing the browser.

### Common Operations:

```jsx
// Save data
localStorage.setItem('token', 'eyJhbGc...');
localStorage.setItem('user', JSON.stringify({ id: 1, name: 'John' }));

// Get data
const token = localStorage.getItem('token');
const userData = localStorage.getItem('user');
const user = JSON.parse(userData);  // Convert string back to object

// Remove data
localStorage.removeItem('token');
localStorage.removeItem('user');

// Clear all
localStorage.clear();
```

### Why Use LocalStorage?

1. **Persists** - Data stays even after page refresh
2. **Simple** - Easy to use
3. **Fast** - No database queries needed

### Important Notes:

- **Strings only** - Must use `JSON.stringify()` for objects
- **Same origin** - Only accessible from same domain
- **Not secure** - Don't store sensitive data (passwords)
- **Limited size** - ~5-10MB per domain

### Real Example:

```jsx
// After login
const response = await api.post('/auth/login', { email, password });

// Save token (string)
localStorage.setItem('token', response.data.access_token);

// Save user (convert object to string)
localStorage.setItem('user', JSON.stringify(response.data.user));

// Later, retrieve data
const token = localStorage.getItem('token');
const userData = localStorage.getItem('user');
const user = JSON.parse(userData);  // Convert back to object

// Check if logged in
const isLoggedIn = !!localStorage.getItem('token');
```

---

## Complete Request Flow

### Example: Student Enrolls in Course

```
1. User clicks "Enroll" button
   ↓
2. handleEnroll(courseId) function runs
   ↓
3. Frontend makes API call
   api.post(`/enrollments/course/${courseId}`)
   ↓
4. Request Interceptor adds token
   Headers: {
     Authorization: "Bearer eyJhbGc..."
   }
   ↓
5. Request sent to backend
   POST http://localhost:3000/enrollments/course/5
   ↓
6. Backend receives request
   - JwtAuthGuard validates token
   - Extracts user from token
   - Attaches user to req.user
   ↓
7. EnrollmentsController.enroll() runs
   - Gets req.user.id (student ID)
   - Calls EnrollmentsService.enroll()
   ↓
8. Service creates enrollment in database
   ↓
9. Backend returns success response
   ↓
10. Response Interceptor checks response
    - If 401, redirects to login
    - Otherwise, returns response
    ↓
11. Frontend receives response
    ↓
12. Frontend updates UI
    - Shows success message
    - Refreshes course list
    - Redirects to "My Courses"
```

### Code Flow:

```jsx
// Frontend: Courses.jsx
const handleEnroll = async (courseId) => {
    try {
        // 1. Make API call (token added automatically)
        await api.post(`/enrollments/course/${courseId}`);
        
        // 2. Show success
        alert('Successfully enrolled!');
        
        // 3. Navigate to my courses
        navigate('/student/my-courses');
    } catch (err) {
        // 4. Show error if fails
        alert(err.response?.data?.message || 'Failed to enroll');
    }
};

// Backend: enrollments.controller.ts
@Post('course/:courseId')
@UseGuards(JwtAuthGuard)  // Validates token
async enroll(@Request() req: any, @Param('courseId') courseId: number) {
    // req.user.id comes from JWT token
    return this.enrollmentsService.enroll(req.user.id, courseId);
}
```

---

## How Frontend Connects to Backend

### Connection Flow:

```
┌─────────────────────────────────────┐
│         FRONTEND (React)            │
│  - User interacts with UI           │
│  - Components make API calls        │
│  - Uses axios to send requests      │
└──────────────┬──────────────────────┘
               │
               │ HTTP Request
               │ (with JWT token)
               ↓
┌─────────────────────────────────────┐
│      API INTERCEPTORS (api.jsx)     │
│  - Adds token to every request      │
│  - Handles errors                   │
└──────────────┬──────────────────────┘
               │
               │ HTTP Request
               │ Authorization: Bearer <token>
               ↓
┌─────────────────────────────────────┐
│      BACKEND (NestJS)               │
│  - Receives request                 │
│  - Validates token                  │
│  - Processes request                │
│  - Returns response                 │
└──────────────┬──────────────────────┘
               │
               │ HTTP Response
               │ { data: [...] }
               ↓
┌─────────────────────────────────────┐
│      FRONTEND (React)                │
│  - Receives response                 │
│  - Updates state                     │
│  - Re-renders UI                     │
└─────────────────────────────────────┘
```

### Key Connection Points:

1. **Base URL** - Where backend is located
   ```jsx
   const api = axios.create({
       baseURL: 'http://localhost:3000',  // Backend URL
   });
   ```

2. **Token Management** - Automatic token injection
   ```jsx
   // Request interceptor adds token
   api.interceptors.request.use((config) => {
       const token = localStorage.getItem('token');
       if (token) {
           config.headers.Authorization = `Bearer ${token}`;
       }
       return config;
   });
   ```

3. **Error Handling** - Automatic logout on 401
   ```jsx
   // Response interceptor handles errors
   api.interceptors.response.use(
       (response) => response,
       (error) => {
           if (error.response?.status === 401) {
               // Token expired or invalid
               localStorage.removeItem('token');
               window.location.href = '/login';
           }
       }
   );
   ```

---

## Visual Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    USER BROWSER                         │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              React Application                   │   │
│  │                                                   │   │
│  │  ┌──────────────────────────────────────────┐   │   │
│  │  │         App.jsx (Router)                 │   │   │
│  │  │  - Defines all routes                     │   │   │
│  │  │  - Protects routes                        │   │   │
│  │  └──────────────┬─────────────────────────────┘   │   │
│  │                 │                                   │   │
│  │  ┌──────────────▼─────────────────────────────┐   │   │
│  │  │         Page Components                     │   │   │
│  │  │  - Login.jsx                                │   │   │
│  │  │  - Dashboard.jsx                            │   │   │
│  │  │  - Courses.jsx                             │   │   │
│  │  └──────────────┬─────────────────────────────┘   │   │
│  │                 │                                   │   │
│  │  ┌──────────────▼─────────────────────────────┐   │   │
│  │  │         Reusable Components                │   │   │
│  │  │  - Header.jsx                              │   │   │
│  │  └────────────────────────────────────────────┘   │   │
│  │                                                   │   │
│  │  ┌──────────────────────────────────────────┐   │   │
│  │  │         State Management                  │   │   │
│  │  │  - useState() - Component state           │   │   │
│  │  │  - localStorage - Persistent storage      │   │   │
│  │  └──────────────────────────────────────────┘   │   │
│  │                                                   │   │
│  │  ┌──────────────────────────────────────────┐   │   │
│  │  │         API Layer (api.jsx)              │   │   │
│  │  │  - Axios instance                        │   │   │
│  │  │  - Request interceptor (adds token)     │   │   │
│  │  │  - Response interceptor (handles errors) │   │   │
│  │  └──────────────┬───────────────────────────┘   │   │
│  └─────────────────┼───────────────────────────────┘   │
└─────────────────────┼───────────────────────────────────┘
                      │
                      │ HTTP Requests
                      │ (with JWT token)
                      ↓
┌─────────────────────────────────────────────────────────┐
│              BACKEND (NestJS)                           │
│  - Validates token                                       │
│  - Processes requests                                    │
│  - Returns data                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Practical Examples

### Example 1: Complete Login Component

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export const Login = () => {
    // 1. State variables
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    // 2. Navigation hook
    const navigate = useNavigate();
    
    // 3. Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent page refresh
        setError('');        // Clear previous errors
        setLoading(true);    // Show loading
        
        try {
            // 4. Send login request
            const response = await api.post('/auth/login', {
                email,
                password
            });
            
            // 5. Save token and user
            localStorage.setItem('token', response.data.access_token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // 6. Redirect based on role
            if (response.data.user.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/student-dashboard');
            }
        } catch (err) {
            // 7. Handle errors
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);  // Hide loading
        }
    };
    
    // 8. Render UI
    return (
        <form onSubmit={handleSubmit}>
            {error && <div className="error">{error}</div>}
            
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            
            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
};
```

### Example 2: Fetching and Displaying Data

```jsx
import { useState, useEffect } from 'react';
import api from '../api';

export const Courses = () => {
    // State for courses list
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Fetch courses when component loads
    useEffect(() => {
        fetchCourses();
    }, []);  // Empty array = run once
    
    const fetchCourses = async () => {
        try {
            // GET request to backend
            const response = await api.get('/courses');
            
            // Update state with courses
            setCourses(response.data);
        } catch (err) {
            setError('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };
    
    // Show loading state
    if (loading) {
        return <p>Loading courses...</p>;
    }
    
    // Show error state
    if (error) {
        return <p className="error">{error}</p>;
    }
    
    // Show courses
    return (
        <div>
            <h1>Available Courses</h1>
            {courses.map(course => (
                <div key={course.id}>
                    <h2>{course.title}</h2>
                    <p>{course.description}</p>
                </div>
            ))}
        </div>
    );
};
```

### Example 3: Creating Data (POST Request)

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export const CreateCourse = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [thumbnailUrl, setThumbnailUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // POST request to create course
            await api.post('/courses', {
                title,
                description,
                videoUrl,      // Optional video link
                thumbnailUrl,  // Optional thumbnail image
            });
            
            // Success - redirect
            alert('Course created!');
            navigate('/admin/courses');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create course');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Course Title"
                required
            />
            
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
            />
            
            <button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Course'}
            </button>
        </form>
    );
};
```

---

## Common Patterns

### Pattern 1: Loading States

```jsx
const [loading, setLoading] = useState(false);

const handleAction = async () => {
    setLoading(true);
    try {
        await api.post('/endpoint');
    } finally {
        setLoading(false);
    }
};

return (
    <button disabled={loading}>
        {loading ? 'Loading...' : 'Submit'}
    </button>
);
```

### Pattern 2: Error Handling

```jsx
const [error, setError] = useState('');

const handleAction = async () => {
    setError('');
    try {
        await api.post('/endpoint');
    } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong');
    }
};

return (
    <div>
        {error && <div className="error">{error}</div>}
        {/* Rest of component */}
    </div>
);
```

### Pattern 3: Conditional Rendering

```jsx
// Show different content based on state
{loading && <p>Loading...</p>}
{error && <p className="error">{error}</p>}
{courses.length === 0 && <p>No courses found</p>}
{courses.map(course => <div key={course.id}>{course.title}</div>)}
```

### Pattern 4: Role-Based Rendering

```jsx
const user = JSON.parse(localStorage.getItem('user'));

{user && user.role === 'admin' && (
    <button>Admin Only Button</button>
)}
```

---

## Key Takeaways

1. **Components** - Reusable UI pieces
2. **State** - Data that changes (useState)
3. **Effects** - Side effects (useEffect)
4. **Routing** - Navigation (React Router)
5. **API Calls** - Communication (Axios)
6. **LocalStorage** - Persistent storage
7. **Interceptors** - Automatic token handling
8. **Protected Routes** - Require authentication

### Data Flow:

```
User Action
  ↓
Event Handler
  ↓
API Call (with token)
  ↓
Backend Processes
  ↓
Response Received
  ↓
State Updated
  ↓
UI Re-renders
```

### Authentication Flow:

```
Login
  ↓
Save Token to localStorage
  ↓
Token Added to Every Request (Interceptor)
  ↓
Backend Validates Token
  ↓
Access Granted/Denied
```

---

## Videos and Thumbnails

- Courses now support optional `videoUrl` and `thumbnailUrl`.
- You can host videos/thumbnails yourself (e.g., place files in `frontend/public/videos/...` or `frontend/public/thumbs/...`) and reference them with relative paths like `/videos/myfolder/lesson1.mp4`.
- `CreateCourse` form includes fields for `videoUrl` and `thumbnailUrl`; these are sent to the backend.
- Course cards (admin, student, my courses) show a thumbnail; clicking the thumbnail (or “Watch Video”) opens an inline video player overlay.
- If no thumbnail is provided, a placeholder prompt appears (“Click to play video”).

This is how your frontend works! Each part has a specific job, and React ties them all together to create a smooth user experience.

