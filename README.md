# LaundryDash: Mini Order Management System

**LaundryDash** is a full-stack MERN application designed to streamline laundry operations. This project was developed with an **AI-First mindset**, leveraging artificial intelligence for rapid prototyping while applying rigorous manual engineering to resolve complex integration, security, and deployment challenges.

- **Frontend:** [Live on Vercel](https://laundry-dash-vphw.vercel.app)
- **Backend:** [Live on Render](https://laundrydash.onrender.com)

##  Project Demo Video
A video demonstration of the application's core features, including order creation, dashboard analytics, and status updates:

[Watch the Demo Video](./frontend/src/assets/Screen%20Recording%202026-04-29%20150903.mp4)

##  Tech Stack

- **Frontend:** Built with **React** and **Tailwind CSS v4** using **Vite** for a lightning-fast development experience and optimized production bundling.
- **Backend:** Powered by **Node.js** and **Express.js**, featuring **JWT** authentication and **Bcrypt** hashing to secure protected API routes.
- **Database:** Utilizes **MongoDB Atlas** with **Mongoose** to handle complex data modeling and efficient aggregation for real-time dashboard analytics.
---

##  Features Implemented

- **Secure Authentication:** JWT-based login system with bcrypt password hashing.
- **Order Management:** Create, view, and update laundry orders using Name, PhoneNo, garments, price and quantity with server-side validation.
- **Dynamic Dashboard:** Real-time calculation of Total Orders and Total Revenue using MongoDB Aggregation (`$facet`) and Order Status for respective order Ids.
- **Advanced Filtering:** Search orders by Customer Name, Phone, or ID, and filter by Status.
- **Status Workflow:** Transition orders through `RECEIVED`, `PROCESSING`, `READY`, and `DELIVERED`.
- **Intelligent Logic:**
  - **Dynamic Billing:** Server-side price calculation to ensure data integrity.
  - **Auto-Delivery Tracking:** Estimated delivery date auto-generation (Current Date + 2 days).
  - **Performance Optimized:** Use of `$facet` for single-query dashboard metrics.

---

##  AI Usage Report & Prompts

This project was built leveraging AI tools (ChatGPT/Gemini) to optimize speed and execution. Below is the exact sequence of prompts used and the corresponding implementations.

### Prompt Journey
<details>
<summary><b>Click to expand the exact prompt sequence used</b></summary>

1. **The Brief:**
   > "I had applied for an internship at quick dry cleaning through internshala, they've sent me this assignment that I need to complete to qualify Assignment: Build a Mini Laundry Order Management System (AI-First) Objective...........Hint (What Good Candidates Do) Start with API quickly Use AI to scaffold Iterate fast Fix AI mistakes Keep it simple but working what should I do"

2. **Backend Scaffolding:**
   > "Generate a basic server.js for a Node/Express app. Include middleware for JSON parsing and CORS. Set up a basic 'Hello World' route on / and a port listener on 5000."

3. **Database Schema:**
   > "Create a Mongoose schema for a Laundry Order. Fields: customerName (String), phone (String), garments (Array of objects with item name, quantity, price), totalBill (Number), status (Enum: RECEIVED, PROCESSING, READY, DELIVERED), and orderId (Unique String)."
   - **My Improvements:** Used separate sub-schema for garments, added timestamps, implemented `trim` for cleaner data, and set default status to "RECEIVED".

4. **Order API Development:**
   > "Write Express routes for: 1. POST /api/orders (calculates total and saves order), 2. GET /api/orders (returns all orders), 3. PATCH /api/orders/:id (updates status)"
   - **My Improvements:** Calculated bill dynamically server-side, added filtering (status, phone), and sorted by latest orders first.

5. **Dashboard Analytics:**
   > "In my orderRoutes.js, I need a GET /dashboard route. Use Order.aggregate to return: totalOrders: Count of all documents. totalRevenue: Sum of all totalBill fields. statusCounts: A breakdown of how many orders are in each status (RECEIVED, PROCESSING, etc.)."
   - **My Improvements:** Used `$facet` to compute multiple metrics in one DB call for efficiency and ensured all statuses exist in the response even with 0 counts.

6. **Authentication Layer:**
   > "I want to add basic JWT authentication to my MERN laundry app. Create a User model with email and password (hashed with bcrypt). Create signup and login routes that return a JWT token. Create a middleware function to protect my /api/orders routes so only logged-in users can access them."
   - **My Improvements:** Fixed AI-generated middleware that was failing token generation and properly implemented `bcrypt.genSalt` in the `pre-save` hook.

7. **Frontend Development:**
   > "I am building a React frontend for my Laundry app. Please create a 'CreateOrder' component using Tailwind CSS. It should have a list of garments: Shirt: 100, Pants: 150, Saree: 300, Dress: 250, Blanket: 350. Each garment should have a '+' and '-' button to increase/decrease quantity. Show a 'Live Total' at the bottom. When 'Submit' is clicked, send a POST request to http://localhost:5000/api/orders with the Bearer token from localStorage. Use the axios library for the request. I am using vite for frontend."
   - **My Improvements:** Implemented real-time calculation, prevented empty order submissions, and fixed PostCSS v4 compatibility issues.

8. **Refining Features:**
   > "now I need to add 2 more features, filter the orders by status, id, name and phone. No and ability to change the status of the orders"

9. **Logic Completion:**
   > "one final feature: adding the estimated delivery date, how do I add this, do I hardcode it to +2 from the current date or do I make the order placer( the owner add it manually) or update it based on changes in the status?"
</details>

---

##  Challenges & Solutions (Problem Solving)

### 1. Technical "Hallucinations" & Errors
- **Auth Middleware Bug:** The AI-generated middleware was failing to pass a valid `next()` value, breaking token generation. I resolved this by manually rewriting the `userSchema.pre("save")` hook to ensure correct password hashing and token flow.
- **Tailwind CSS v4 Compatibility:** Encountered a PostCSS error as the AI suggested v3 configurations. I identified that the PostCSS plugin moved to `@tailwindcss/postcss` and manually updated the architecture.
- **Deployment Pathing:** Discovered a persistent 404 error during deployment caused by a double-slash URL mismatch (`//api`). I debugged this via browser DevTools and cleaned up the environment variable fetching logic.

### 2. Infrastructure & Database
- **Vite/PostCSS Integration:** The CSS wasn't rendering because the `tailwindcss/vite` file was missing from the node modules; I manually verified and reinstalled dependencies to align with the new Vite architecture.
- **Local vs Cloud Migration:** Faced significant issues during deployment as local test users didn't exist in the cloud DB. I successfully navigated the MongoDB Atlas hierarchy to provision a Flex cluster and manually migrated users with hashed passwords.

### 3. Deployment
- **Hardcoded LocalHost values** Most of the code was designed around the localhost data and hence upon deploying showed many erros, to resolve this quickly (due to time constraints) I replaced them with hardcoded render and vercel links.

---
##  API Documentation (Postman)
The API endpoints were designed and validated using Postman. You can access the public workspace and collection to test the live API here:

[🔗 View Public Postman Collection]([https://eashitakakkar-1722905.postman.co/workspace/Eashita-Kakkar's-Workspace~f9764da9-209a-4365-89f8-c1f3e64dcfe1/collection/54354095-95e41df5-8257-45ff-9315-7e310edc7393](https://eashitakakkar-1722905.postman.co/workspace/Eashita-Kakkar's-Workspace~f9764da9-209a-4365-89f8-c1f3e64dcfe1/collection/54354095-95e41df5-8257-45ff-9315-7e310edc7393?action=share&creator=54354095))

##  Setup Instructions

### Backend
1. `cd backend`
2. `npm install`
3. Create a `.env` file with `MONGO_URI` and `JWT_SECRET`.
4. `npm start` (Runs on port 5000)

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` (Uses Vite for fast HMR)

---

##  Tradeoffs & Improvements
- **Tradeoff:** Skipped a public Signup frontend to focus on the core admin Dashboard; users are provisioned via database/Postman.
- **Tradeoff:** Hardcoded production URLs for the demo to ensure zero-config functionality for evaluators.
- **Future Improvements:** Implementation of Refresh Tokens, SMS/WhatsApp status notifications, and garment condition image uploads.
- **Future Improvements:** Implementation of automated real time updates based on deliveries.
- **Future Implementats:** Implementation of user signin and online application for dry cleaning requests, which could be integrated in the owner's DB.

---

##  Final Demo Credentials
- **Email:** `test@gmail.com`
- **Password:** `123456`
