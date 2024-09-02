import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import Login from './Login';
import EmployeeDashboard from './EmployeeDashboard';
import AdminDashboard from './AdminDashboard';
import ManagerDashboard from './ManagerDashboard';
import TravelAdminDashboard from './TravelAdminDashboard';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jwtDecode } from 'jwt-decode';
import './App.css';

function Navbar() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token; // Check if token exists

  // Decode the token if it exists
  let userName = '';
  let userRole = '';
  if (isLoggedIn) {
    try {
      const decodedToken = jwtDecode(token);
      userName = decodedToken.firstname || ''; // Extract username from the token
      userRole = decodedToken.roleId || '';
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  const isDashboardRoute = location.pathname.includes('/dashboard');
  
  // const getWelcomeMessage = () => {
  //   return userName ? Welcome, ${userName} : 'Welcome';
  // };

  return (
    <nav className="navbar">
      <div className="navbar-center">
        <span className="navbar-title">Trawell</span>
       
      </div>
      <div className="navbar-right">
      <Link className="nav-link" to="/">Home</Link>
        {isLoggedIn ? (
          <Link className="nav-link" to="/" onClick={() => {
            localStorage.clear();
            window.location.reload(); 
          }}>Logout</Link>
          
        ) : (
          
          <Link className="nav-link" to="/login">Login</Link>
        )}
     {/* {isLoggedIn && isDashboardRoute && (
          <span className="navbar-welcome">{getWelcomeMessage()}</span>
        )}  */}
      </div>
    </nav>
  );
}

function Home() {
  return (
    <div className="container-fluid">
      <div
        style={{
          backgroundImage: `url('/assets/loginbg.jpg')`,
          backgroundSize: 'cover',  // Ensures the image covers the entire div
          backgroundPosition: 'center',  // Centers the image within the div
          height: '100vh',  // Sets the height to full view height
          width: '100%',  // Ensures full width
        }}
      ></div>
    </div>
  );
}
function ErrorPage() {
  return (
    <div className="error-page">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link className="error-link" to="/">Go to Home</Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <React.Suspense fallback={<div className="loading">Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="dashboard/employee" element={<EmployeeDashboard />} />
            <Route path="dashboard/manager" element={<ManagerDashboard />} />
            <Route path="dashboard/travel-admin" element={<TravelAdminDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
            <Route path="/contact" element={<div className="page-content">Contact Page</div>} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </React.Suspense>
      </div>
    </Router>
  );
}

export default App;
 