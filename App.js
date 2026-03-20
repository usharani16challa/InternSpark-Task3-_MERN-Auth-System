import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import  ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';

// A simple Navbar to test the flow
const Navbar = () => {
  const { user, logout } = useAuth();
  return (
    <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
      <Link to="/">Home</Link> | {" "}
      {!user ? (
        <>
          <Link to="/login">Login</Link> | <Link to="/signup">Signup</Link>
        </>
      ) : (
        <>
          <Link to="/dashboard">Dashboard</Link> | {" "}
          <button onClick={logout}>Logout ({user.email})</button>
        </>
      )}
    </nav>
  );
};

const Dashboard = () => <h2>Welcome to your Private Dashboard!</h2>;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<h2>Public Home Page</h2>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;