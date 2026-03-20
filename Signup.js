import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Ensure the URL matches your Backend route exactly
      await axios.post('/api/signup', { email, password });
      alert("Registration Successful!");
      navigate('/login');
    } catch (err) {
      // This helps you see the REAL error in the alert
      const errorMsg = err.response?.data?.message || "Server is offline";
      alert("Signup Failed: " + errorMsg);
    }
  };

  return (
    <form onSubmit={handleSignup}>
      <h2>Create Account</h2>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;