import { useState } from "react";
import axios from "axios";

const priceList = {
  Shirt: 100,
  Pants: 150,
  Saree: 300,
  Dress: 250,
  Blanket: 350,
};

export default function CreateOrder() {
  const [quantities, setQuantities] = useState({
    Shirt: 0,
    Pants: 0,
    Saree: 0,
    Dress: 0,
    Blanket: 0,
  });

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(() => {
  const now = new Date();
  // Defaulting to 2 days from now
  now.setDate(now.getDate() + 2); 
  return now.toISOString().split('T')[0]; 
});

  const increase = (item) => {
    setQuantities((prev) => ({
      ...prev,
      [item]: prev[item] + 1,
    }));
  };

  const decrease = (item) => {
    setQuantities((prev) => ({
      ...prev,
      [item]: Math.max(0, prev[item] - 1),
    }));
  };

  const total = Object.keys(quantities).reduce((acc, item) => {
    return acc + quantities[item] * priceList[item];
  }, 0);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const garments = Object.keys(quantities)
        .filter((item) => quantities[item] > 0)
        .map((item) => ({
          itemName: item,
          quantity: quantities[item],
        }));

      if (!customerName || !phone || garments.length === 0) {
        alert("Fill all details and select at least one item");
        return;
      }

      const token = localStorage.getItem("token");

      // --- 3. UPDATED AXIOS POST TO SEND DELIVERY DATE ---
      await axios.post(`${import.meta.env.VITE_API_URL}/api/orders/`,
         {
           customerName,
           phone,
           garments,
           estimatedDelivery: deliveryDate,
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });

      alert("Order Created!");

      setQuantities({
        Shirt: 0,
        Pants: 0,
        Saree: 0,
        Dress: 0,
        Blanket: 0,
      });
      setCustomerName("");
      setPhone("");
      // Reset date to +2 days for the next order
      setDeliveryDate(new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    } catch (err) {
      console.error(err);
      alert("Error creating order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-2xl">
        <h2 className="mb-4 text-2xl font-bold text-center">Create Order</h2>

        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full p-2 mb-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 mb-4 border rounded-lg outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="space-y-3">
          {Object.keys(priceList).map((item) => (
            <div key={item} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
              <div>
                <p className="font-semibold">{item}</p>
                <p className="text-sm text-gray-500">₹{priceList[item]}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => decrease(item)} className="px-3 py-1 text-white bg-red-500 rounded">-</button>
                <span>{quantities[item]}</span>
                <button onClick={() => increase(item)} className="px-3 py-1 text-white bg-green-500 rounded">+</button>
              </div>
            </div>
          ))}
        </div>

        {/* --- 2. ADDED UI INPUT FOR DATE --- */}
        <div className="mt-4">
          <label className="block mb-1 text-sm font-bold text-gray-700">
            Estimated Delivery Date
          </label>
          <input
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            className="w-full p-2 border rounded-lg shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mt-5 text-lg font-bold text-center">Total: ₹{total}</div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2 mt-4 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Submitting..." : "Submit Order"}
        </button>
      </div>
    </div>
  );
}