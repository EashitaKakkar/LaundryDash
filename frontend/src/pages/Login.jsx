import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"; 
      // Hardcode the Render URL directly for now to bypass the env variable issue
      const res = await axios.post(
        'https://laundrydash.onrender.com/api/auth/login', 
        { email, password }
      );
      
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard'

      
      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      alert("Invalid Credentials");
    }
  };
  return (
  <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-purple-100 via-white to-purple-50">
    
    <div className="w-full max-w-md p-8 bg-white border border-gray-100 shadow-xl rounded-2xl">
      
      <h1 className="text-2xl font-black text-center text-[#6b21a8] mb-2">
        LaundryDash
      </h1>

      <p className="mb-6 text-center text-gray-500">
        Sign in to manage your orders
      </p>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">

        <input 
          type="email"
          placeholder="test@gmail.com"
          className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input 
          type="password"
          placeholder="123456"
          className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button 
          type="submit"
          className="bg-[#6b21a8] text-white py-3 rounded-lg font-semibold hover:bg-purple-800 transition shadow-md"
        >
          Sign In
        </button>
      </form>
    </div>
  </div>
);
}