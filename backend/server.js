/**
 * Node.js / Express.js Core Backend Server
 * 
 * Objective: Manages secure incoming REST API requests from the frontend client application,
 *            interfaces with the Supabase PostgreSQL instance, and tracks transaction states.
 * Hosting Platform: Production-ready for Railway deployment with automated CI/CD.
 */

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// 1. Core Global Middlewares
app.use(cors());
app.use(express.json()); // Parses incoming application/json request payloads

// 2. Initialize Centralized Supabase Connection Pool
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("FATAL ERROR: Missing database environment credentials.");
    process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 3. REST API Endpoint: Fetch All Orders (Used by the application dashboard)
app.get('/api/orders', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        return res.status(200).json({ success: true, count: data.length, data });
    } catch (err) {
        console.error("GET /api/orders error exception:", err.message);
        return res.status(500).json({ success: false, message: "Database read operation failed." });
    }
});

// 4. REST API Endpoint: Update Order Fulfillment Status (Triggered via App or n8n)
app.patch('/api/orders/:id', async (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ success: false, message: "Payload parameter 'status' is required." });
    }

    try {
        const { data, error } = await supabase
            .from('orders')
            .update({ status: status, updated_at: new Date().toISOString() })
            .eq('id', orderId)
            .select();

        if (error) throw error;
        if (data.length === 0) {
            return res.status(404).json({ success: false, message: "Target order ID matching parameter not found." });
        }

        return res.status(200).json({ success: true, message: "Order status modified successfully.", data });
    } catch (err) {
        console.error(`PATCH /api/orders/${orderId} exception:`, err.message);
        return res.status(500).json({ success: false, message: "Database update mutation failed." });
    }
});

// 5. Health Check Monitoring Probe (Crucial for Railway/Kubernetes live tracking)
app.get('/health', (req, res) => {
    return res.status(200).json({ status: "UP", timestamp: new Date().toISOString() });
});

// 6. Global 404 Fallback Routing Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Requested REST resource endpoint mapping not found." });
});

// 7. Initialize Application Listener Infrastructure
app.listen(PORT, () => {
    console.log(`Backend server successfully initialized. Listening actively on port allocation: ${PORT}`);
});
