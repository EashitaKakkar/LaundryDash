const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Hardcoded price list
const priceList = {
  Shirt: 100,
  Pants: 150,
  Saree: 300,
  Dress: 250,
  Blanket: 350,
};

// --- CRUX 1: THE POST ROUTE (Missing in your previous snippet) ---
router.post("/", async (req, res) => {
  try {
    const { customerName, phone, garments } = req.body;

    let totalBill = 0;
    const updatedGarments = garments.map((g) => {
      const price = priceList[g.itemName] || 0;
      const itemTotal = price * g.quantity;
      totalBill += itemTotal;

      return {
        itemName: g.itemName,
        quantity: g.quantity,
        price,
      };
    });

    const orderId = "ORD-" + Date.now();

    const newOrder = new Order({
      customerName,
      phone,
      garments: updatedGarments,
      totalBill, // Matches your schema
      orderId,
      status: "RECEIVED" ,
      estimatedDelivery: req.body.estimatedDelivery || new Date(Date.now()+ 2* 24*60 *60 *1000)
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (err) {
    console.error("Post Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/dashboard", async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $facet: {
          totalOrders: [{ $count: "count" }],
          totalRevenue: [
            {
              $group: {
                _id: null,
                total: { $sum: "$totalBill" },
              },
            },
          ],
          statusCounts: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
          recentOrders: [
            { $sort: { createdAt: -1 } },
            { $limit: 10 } 
          ],
        },
      },
    ]);

    const dashboard = {
      totalOrders: result[0].totalOrders[0]?.count || 0,
      totalRevenue: result[0].totalRevenue[0]?.total || 0,
      orders: result[0].recentOrders || [], 
      statusCounts: result[0].statusCounts.reduce(
        (acc, curr) => {
          if (curr._id) acc[curr._id] = curr.count;
          return acc;
        },
        { RECEIVED: 0, PROCESSING: 0, READY: 0, DELIVERED: 0 }
      ),
    };

    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- NEW FEATURE: UPDATE ORDER STATUS ---
router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    
    // Safety check for valid statuses
    const validStatuses = ["RECEIVED", "PROCESSING", "READY", "DELIVERED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id, 
      { status: status }, 
      { new: true } // This returns the updated document instead of the old one
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (err) {
    console.error("Patch Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;