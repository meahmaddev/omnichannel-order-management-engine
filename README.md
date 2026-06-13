# Omnichannel AI Order Management Engine — Full-Stack Backend & Integration Gateway

A production-ready, full-stack order management infrastructure designed to capture, classify, and fulfill e-commerce transactions originating from social messaging ecosystems. The system seamlessly aggregates unstructured text streams from Facebook, Instagram Graph, and WhatsApp Business APIs, runs real-time AI classification intent loops, and routes transaction states through a robust Node.js backend to a centralized database.

## 🛠️ Tech Stack & Architecture
- **Orchestration Layer:** n8n Workflow Automation (Omnichannel Ingestion & API Webhooks)
- **Backend Runtime Environment:** Node.js / Express.js (REST Architecture)
- **Cloud Infrastructure & Hosting:** Railway (Automated CI/CD Deployment)
- **Database Layer:** Supabase / PostgreSQL (Relational Transactional Storage)
- **AI Intent Layer:** Large Language Models (LLMs) trained for real-time text classification and extraction

## 📡 System Architecture & Data Flow
1. **Social Stream Ingestion:** Live customer chats and comments are captured via secure webhook subscriptions from Meta's API developer gateways (WhatsApp, FB, IG) directly into n8n.
2. **Intent Classification:** Unstructured raw messages are passed through an AI extraction node to detect if the text constitutes a purchase order, automatically isolating items, quantities, and customer metadata.
3. **Database Synchronization:** Validated order structures are pushed downstream to a centralized **Supabase/PostgreSQL** database, ensuring atomic transactions and instant data persistence.
4. **Backend REST Engine:** A high-performance **Node.js** app hosted on **Railway** acts as the core business logic layer, supplying secure APIs for frontend web/mobile interfaces to retrieve, update, and manage orders.
5. **Fault Isolation:** Webhook triggers utilize response verification and exception routing loops to prevent message drops during high-volume traffic spikes.

## 📂 Project Structure
- `/backend` : Core Node.js/Express application files, middleware routing, and server architecture blueprints.
- `/src-n8n` : Standalone JavaScript data cleaning snippets utilized within n8n payload processing nodes.
