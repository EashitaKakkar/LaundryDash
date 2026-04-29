import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [data, setData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    orders: [],
  });
  const [loading, setLoading] = useState(true);

  // --- NEW STATES FOR SEARCH & FILTER ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

 const fetchDashboardData = async () => {
  try {
    const token = localStorage.getItem("token");
    // HARDCODED RENDER URL
    const res = await axios.get("https://laundrydash.onrender.com/api/orders/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setData(res.data);
  } catch (err) {
    console.error("Error fetching dashboard data", err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    const loadDashboard = async () => {
      await fetchDashboardData();
    };
    
    loadDashboard();
  }, []); 

  // --- NEW FUNCTION TO UPDATE STATUS ---
  const handleUpdateStatus = async (id, newStatus) => {
  try {
    const token = localStorage.getItem("token");
    // HARDCODED RENDER URL
    await axios.patch(
      `https://laundrydash.onrender.com/api/orders/${id}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchDashboardData();
  } catch (err) {
    console.error("Error updating status", err);
    alert("Failed to update status");
  }
};

  // --- FILTERING LOGIC ---
  const filteredOrders = (data.orders || []).filter((order) => {
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      order._id.toLowerCase().includes(searchLower) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchLower)) ||
      (order.phone && order.phone.includes(searchLower));

    return matchesStatus && matchesSearch;
  });

  if (loading) return <div className="p-8 font-bold text-center">Loading LaundryDash...</div>;

  // Add this inside the Dashboard component, above the return statement
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  
  // This will format it like "Apr 30"
  return date.toLocaleDateString('en-IN', { 
    day: 'numeric', 
    month: 'short' 
  });
};
  return (
    <div className="min-h-screen p-4 bg-gray-50 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-2">
          <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-3xl">
            <span className="text-xs font-black tracking-widest text-indigo-400 uppercase">Total Orders</span>
            <h2 className="mt-2 text-5xl font-black text-gray-900">{data.totalOrders}</h2>
          </div>
          <div className="p-8 bg-white border border-gray-100 shadow-sm rounded-3xl">
            <span className="text-xs font-black tracking-widest text-green-400 uppercase">Total Revenue</span>
            <h2 className="mt-2 text-5xl font-black text-gray-900">₹{data.totalRevenue}</h2>
          </div>
        </div>

        {/* --- SEARCH AND FILTER CONTROLS --- */}
        <div className="flex flex-col gap-4 mb-6 md:flex-row">
          <input
            type="text"
            placeholder="Search by Name, Phone, or ID..."
            className="flex-1 p-3 border border-gray-200 shadow-sm outline-none rounded-2xl focus:ring-2 focus:ring-indigo-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="p-3 font-bold text-gray-600 bg-white border border-gray-200 shadow-sm outline-none rounded-2xl focus:ring-2 focus:ring-indigo-400"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="RECEIVED">Received</option>
            <option value="PROCESSING">Processing</option>
            <option value="READY">Ready</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>

        {/* Individual Orders Section */}
        <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-3xl">
          <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
            <h3 className="text-xl font-bold text-gray-800">Unique Order Tracking</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs tracking-tighter text-gray-400 uppercase">
                  <th className="px-8 py-4 font-black">Order Info</th>
                  <th className="px-8 py-4 font-black">Customer</th>
                  <th className="px-8 py-4 font-black">Status Update</th>
                  <th className="px-8 py-4 font-black">Delivery</th>
                  <th className="px-8 py-4 font-black text-right">Total Amount</th>

                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="transition-all group hover:bg-indigo-50/30">
                      <td className="px-8 py-5">
                        <span className="px-3 py-1 font-mono text-sm font-bold text-indigo-600 rounded-md bg-indigo-50">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="font-bold text-gray-800">{order.customerName}</div>
                        <div className="text-xs text-gray-500">{order.phone}</div>
                      </td>
                      <td className="px-8 py-5">
                        {/* --- STATUS UPDATE DROPDOWN --- */}
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          className={`text-xs font-black px-3 py-1 rounded-full uppercase cursor-pointer outline-none
                            ${order.status === 'READY' ? 'bg-green-100 text-green-700' : 
                              order.status === 'DELIVERED' ? 'bg-gray-100 text-gray-700' : 
                              'bg-amber-100 text-amber-700'}`}
                        >
                          <option value="RECEIVED">RECEIVED</option>
                          <option value="PROCESSING">PROCESSING</option>
                          <option value="READY">READY</option>
                          <option value="DELIVERED">DELIVERED</option>
                        </select>
                      </td>
                      <td className="px-8 py-5 font-bold text-gray-600">
                        {formatDate(order.estimatedDelivery)}
                        </td>
                      <td className="px-8 py-5 text-lg font-black text-right text-gray-900">
                        ₹{order.totalBill}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-10 font-medium text-center text-gray-400">
                      No matching orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;