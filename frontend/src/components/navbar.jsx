import { Link } from 'react-router-dom';

const Navbar = () => {

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Force refresh to clear auth state
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white/80 backdrop-blur-md md:px-10">
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="text-xl font-black text-[#6b21a8] tracking-tight">LaundryDash</Link><div className="hidden gap-6 md:flex">
        <Link to="/dashboard" className="text-gray-600 hover:text-[#6b21a8] font-medium transition">
          Dashboard
        </Link>
        <Link to="/create-order" className="text-gray-600 hover:text-[#6b21a8] font-medium transition">
          New Order
        </Link>
      </div>
      </div>
      <button 
        onClick={handleLogout}
        className="bg-[#6b21a8] text-white px-4 py-1.5 rounded-lg font-medium hover:bg-purple-800 transition shadow-sm">
        Logout
      </button>
    </nav>
  );
};

export default Navbar; 